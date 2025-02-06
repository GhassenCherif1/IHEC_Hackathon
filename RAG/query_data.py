import argparse
from langchain.vectorstores.chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama
from schemas import ChatMessage
from get_embedding_function import get_embedding_function
from typing import List
import httpx
CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Here is some relevant context that may help answer the question:  

{context}  

---

Using the context above if helpful, answer the following question: {question}

"""
async def query_rag(chatmessages : List[ChatMessage]):
    # Prepare the DB.
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    query_text = chatmessages[-1].content
    # Search the DB.
    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    # print(prompt)
    chatmessages[-1].content = prompt
    url = "http://localhost:11434/api/chat"
    payload = {"messages": chatmessages, "model":"finellama", "stream": False}

    async with httpx.AsyncClient() as client:
        response_text = await client.post(url, json=payload)

    sources = [doc.metadata.get("id", None) for doc, _score in results]
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    print(formatted_response)
    return response_text