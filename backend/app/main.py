from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes.upload import router
from .routes.evaluate import router as evaluate_router



Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Answer Evaluation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your React URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(evaluate_router)
app.include_router(router)