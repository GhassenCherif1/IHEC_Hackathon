from pydantic import BaseModel
from datetime import datetime


class ChatMessage(BaseModel):
    content: str
    role: str

class ChatFeedbackCreate(BaseModel):
    id: str
    message: str
    response: str
    liked: bool

class ChatFeedbackResponse(ChatFeedbackCreate):
    timestamp: datetime

    class Config:
        orm_mode = True