from sqlalchemy import Column, Integer, String, Boolean, ForeignKey,Enum as Sqlalchemy_enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from .database import Base

class ChatFeedback(Base):
    __tablename__ = "chat_feedback"

    id = Column(String, primary_key=True, nullable=False)
    message = Column(String, nullable=False)
    response = Column(String, nullable=False)
    liked = Column(Boolean, nullable=False) 
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))  # Feedback timestamp
