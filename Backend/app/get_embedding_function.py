from langchain_community.embeddings.ollama import OllamaEmbeddings


def get_embedding_function():
    embeddings = OllamaEmbeddings(model="nomic-embed-text",base_url="http://host.docker.internal:11434")
    return embeddings