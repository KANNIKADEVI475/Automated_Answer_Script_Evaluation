const BASE_URL = "http://127.0.0.1:8000";

export async function uploadFile(section, file) {

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
        `${BASE_URL}/upload/${section}`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Upload Failed");
    }

    return response.json();
}

export async function getUploads() {

    const response = await fetch(
        `${BASE_URL}/uploads`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch uploads");
    }

    return response.json();
}
export async function evaluateStudentScripts() {

    const response = await fetch(
        "http://127.0.0.1:8000/evaluate/student",
        {
            method: "POST"
        }
    );

    if (!response.ok)
        throw new Error("Evaluation Failed");

    return response.json();
}


export async function evaluateWithAnswerKey() {

    const response = await fetch(
        "http://127.0.0.1:8000/evaluate/answer-key",
        {
            method: "POST"
        }
    );

    if (!response.ok)
        throw new Error("Evaluation Failed");

    return response.json();
}