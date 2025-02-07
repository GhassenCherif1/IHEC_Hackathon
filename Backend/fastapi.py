from . import schemas
from fastapi import FastAPI
from . import query_data
from typing import List
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines (tu peux restreindre à ["http://localhost:4200"])
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP
    allow_headers=["*"],  # Autorise tous les headers
)

@app.post("/chat")
async def get_response(messages : List[schemas.ChatMessage]):
    return await query_data.query_rag(messages)
    
