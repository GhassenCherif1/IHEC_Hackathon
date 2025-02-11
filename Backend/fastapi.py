from . import schemas
from fastapi import FastAPI , Depends
from . import query_data
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from fastapi.middleware.cors import CORSMiddleware
from .database import get_db
from .database import engine
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines (tu peux restreindre à ["http://localhost:4200"])
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP
    allow_headers=["*"],  # Autorise tous les headers
)
# Create tables
models.Base.metadata.create_all(bind=engine)

@app.post("/chat")
async def get_response(messages : List[schemas.ChatMessage]):
    return await query_data.query_rag(messages)
    
@app.get("/feedback", response_model=list[schemas.ChatFeedbackResponse])
def get_feedbacks(db: Session = Depends(get_db)):
    posts = db.query(models.ChatFeedback).all()
    return posts

@app.post("/feedback", response_model=schemas.ChatFeedbackResponse)
def add_feedback(feedback: schemas.ChatFeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.ChatFeedback(**feedback.dict())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

# Get Feedback Stats
@app.get("/feedback/stats")
def get_feedback_stats(db: Session = Depends(get_db)):
    total = db.query(models.ChatFeedback).count()
    likes = db.query(models.ChatFeedback).filter(models.ChatFeedback.liked == True).count()
    dislikes = total - likes
    
    return {
        "total": total,
        "likes": likes,
        "dislikes": dislikes,
        "likePercentage": (likes / total) * 100 if total > 0 else 0
    }