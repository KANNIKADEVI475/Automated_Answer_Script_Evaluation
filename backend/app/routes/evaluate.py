from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from ..database import get_db
from ..models import Upload

router = APIRouter(prefix="/evaluate")


@router.post("/student")
def evaluate_student_scripts(db: Session = Depends(get_db)):

    scripts = db.query(Upload).filter(
        Upload.section == "answer-scripts"
    ).all()

    if len(scripts) == 0:
        return {
            "message": "No Student Answer Scripts Found"
        }

    for script in scripts:

        filepath = script.filepath

        print(filepath)

        # Call your embedding model here
        #
        # embedding_model(filepath)

    return {

        "message":
        f"{len(scripts)} Student Scripts Sent To Embedding Model"

    }


@router.post("/answer-key")
def evaluate_with_answer_key(
    db: Session = Depends(get_db)
):

    answer_key = db.query(Upload).filter(
        Upload.section == "answer-key"
    ).first()

    scripts = db.query(Upload).filter(
        Upload.section == "answer-scripts"
    ).all()

    if answer_key is None:

        return {
            "message": "Answer Key Missing"
        }

    if len(scripts) == 0:

        return {
            "message": "No Student Scripts Found"
        }

    answer_key_path = answer_key.filepath

    for script in scripts:

        script_path = script.filepath

        # embedding_model(
        #       script_path,
        #       answer_key_path
        # )

    return {

        "message":
        "Answer Key Evaluation Started"

    }