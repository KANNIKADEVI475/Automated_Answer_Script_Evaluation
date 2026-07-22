from pydantic import BaseModel


class UploadResponse(BaseModel):
    id: int
    section: str
    filename: str
    filepath: str

    class Config:
        from_attributes = True