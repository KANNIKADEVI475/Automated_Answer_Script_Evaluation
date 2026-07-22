import os
import shutil

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Upload

router = APIRouter()

UPLOAD_DIR = "uploads"

folders = {
    "question-paper": "question_paper",
    "answer-key": "answer_key",
    "student-details": "student_details",
    "answer-scripts": "answer_scripts"
}


for folder in folders.values():
    os.makedirs(os.path.join(UPLOAD_DIR, folder), exist_ok=True)


@router.post("/upload/{section}")
async def upload_file(
    section: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if section not in folders:
        raise HTTPException(status_code=400, detail="Invalid Section")

    folder = os.path.join(UPLOAD_DIR, folders[section])

    filepath = os.path.join(folder, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    upload = Upload(
        section=section,
        filename=file.filename,
        filepath=filepath
    )

    db.add(upload)
    db.commit()
    db.refresh(upload)

    return {
        "message": "Uploaded Successfully",
        "filename": file.filename
    }


@router.get("/uploads")
def get_uploads(db: Session = Depends(get_db)):

    uploads = db.query(Upload).all()

    result = {
        "question_paper": None,
        "answer_key": None,
        "student_details": None,
        "answer_scripts": []
    }

    for file in uploads:

        if file.section == "question-paper":
            result["question_paper"] = file.filename

        elif file.section == "answer-key":
            result["answer_key"] = file.filename

        elif file.section == "student-details":
            result["student_details"] = file.filename

        elif file.section == "answer-scripts":
            result["answer_scripts"].append(file.filename)

    return result