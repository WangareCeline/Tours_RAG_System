from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag_services import ask
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Tourism RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

class QuestionResponse(BaseModel):
    answer: str
    sources: list

@app.get("/")
def root():
    return{"message":"RAG API is running"}

@app.post("/ask", response_model=QuestionResponse)
def ask_question(request: QuestionRequest):
    try:
        answer, sources = ask(request.question)

        return QuestionResponse(
            answer=answer,
            sources=sources
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    