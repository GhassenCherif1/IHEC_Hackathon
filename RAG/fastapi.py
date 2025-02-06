from RAG.schemas import ChatMessage
from fastapi import FastAPI
import httpx
from query_data import query_rag
from typing import List
app = FastAPI()

@app.post("/chat")
async def get_response(messages : List[ChatMessage]):
    return await query_rag(messages)
    
