import os
import re
import json
from sentence_transformers import SentenceTransformer, util
from groq import Groq

_model = SentenceTransformer("all-MiniLM-L6-v2")

_groq_client = None

def _get_groq_client(api_key=None):
    global _groq_client
    if _groq_client is None:
        key = api_key or os.environ.get("GROQ_API_KEY")
        if not key:
            raise ValueError(
                "No Groq API key found. Set GROQ_API_KEY env var or pass api_key=..."
            )
        _groq_client = Groq(api_key=key)
    return _groq_client

def split_sentences(text):
    text = text.strip()
    sentences = re.split(r"(?<=[.!?])\s+", text)
    return [s.strip() for s in sentences if s.strip()]

CONCEPT_THRESHOLD = 0.55

def evaluate_with_teacher_answer(question, student_answer, teacher_answer):
    concepts = split_sentences(teacher_answer)
    if not concepts:
        raise ValueError("Teacher answer produced no usable sentences.")

    student_sentences = split_sentences(student_answer)
    if not student_sentences:
        student_sentences = [""]

    concept_embeddings = _model.encode(concepts, convert_to_tensor=True)
    student_embeddings = _model.encode(student_sentences, convert_to_tensor=True)

    sim_matrix = util.cos_sim(concept_embeddings, student_embeddings)

    best_scores = sim_matrix.max(dim=1).values.tolist()

    present, missing = [], []
    for concept, score in zip(concepts, best_scores):
        entry = {"concept": concept, "score": round(score, 2)}
        if score >= CONCEPT_THRESHOLD:
            present.append(entry)
        else:
            missing.append(entry)

    marks = round(len(present) / len(concepts) * 10, 1)
    similarity_pct = round(sum(best_scores) / len(best_scores) * 100, 1)

    return {
        "mode": "teacher_answer",
        "question": question,
        "concepts_present": present,
        "concepts_missing": missing,
        "similarity_percent": similarity_pct,
        "marks": f"{marks}/10",
    }

_SYSTEM_MSG = """You are a strict but fair exam evaluator.
Always respond with ONLY valid JSON, no other text, in exactly this shape:
{"marks": <number out of 10>, "reason": "<one or two sentence explanation>"}"""

def evaluate_without_teacher_answer(question, student_answer, api_key=None, model="llama-3.1-8b-instant"):
    client = _get_groq_client(api_key)

    user_msg = f"""Question:
{question}

Student answer:
{student_answer}

Judge correctness and completeness. Give marks out of 10."""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": _SYSTEM_MSG},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.3,  # low temperature -> consistent marks across repeated runs
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r"^```json|```$", "", raw, flags=re.MULTILINE).strip()

    try:
        parsed = json.loads(raw)
        marks = parsed.get("marks")
        reason = parsed.get("reason", "")
    except json.JSONDecodeError:
        marks = None
        reason = raw

    return {
        "mode": "llm_only",
        "question": question,
        "marks": f"{marks}/10" if marks is not None else "N/A",
        "reason": reason,
    }

def evaluate(question, student_answer, teacher_answer=None, groq_api_key=None):
    if teacher_answer and teacher_answer.strip():
        return evaluate_with_teacher_answer(question, student_answer, teacher_answer)
    else:
        return evaluate_without_teacher_answer(question, student_answer, api_key=groq_api_key)

if __name__ == "__main__":
    print("Mode 1 (teacher answer given):")
    result1 = evaluate(
        question="Explain stack data structure.",
        student_answer="Stack follows last in first out. Push adds values.",
        teacher_answer=(
            "A stack follows LIFO principle. "
            "Push inserts an element. "
            "Pop removes an element."
        ),
    )
    print(json.dumps(result1, indent=2))

    if os.environ.get("GROQ_API_KEY"):
        print("\nMode 2 (no teacher answer):")
        result2 = evaluate(
            question="Explain stack data structure.",
            student_answer="Stack follows LIFO and uses push and pop.",
        )
        print(json.dumps(result2, indent=2))
    else:
        print("\n(Skipping Mode 2 demo — set GROQ_API_KEY to test it)")