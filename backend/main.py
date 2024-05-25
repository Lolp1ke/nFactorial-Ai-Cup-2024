import glob
from flask import Flask, request, Response
from operator import itemgetter
from bs import parse_links_from_query, parse_text_from_website

from rag import openAILlm

from dotenv import load_dotenv, dotenv_values
from typing import List, Dict
import os

load_dotenv()
cfg = dotenv_values()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024

llm: openAILlm = openAILlm(api_key=cfg["OPENAI_API_KEY"], model_name="gpt-3.5-turbo")

@app.route("/")
def hello_world() -> str:
    return "<p>Hello, World!</p>"


@app.post("/read")
def read() -> Response:
    ALLOWED_EXTENSIONS: List[str] = ["pdf"]

    def allowed_file(filename: str):
        return (
            "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
        )

    if "file" not in request.files:
        return Response(response="Couldn't find file", status=400)

    file = request.files["file"]

    if not (file and allowed_file(filename=file.filename)):
        return Response(
            response=f"File with this extension is not supported\nSupported file extensions are: {ALLOWED_EXTENSIONS}",
            status=400,
        )
    
    filepath: str = os.path.join("static", file.filename)
    file.save(filepath)
    llm.loadPdf(filepath)


    return Response(response=f"All good\nContent: {file.read().decode("utf-8")}", status=200)

@app.post("/prompt")
def prompt() -> Response:
    if llm.retriever == None:
        return Response(response="No context provided", status=400)
    chain = (
            {
                "context": itemgetter("question") | llm.retriever,
                "question": itemgetter("question"),
            }
            | llm.promt
            | llm.model
            | llm.parser
        )
    
    data: Dict = request.json
    prompt: str | None = data.get("prompt")
    if prompt == None:
        return Response(response="No prompt provided", status=400)
    response: str = chain.invoke({"question": prompt})

    return Response(response=response, status=200)

@app.post("/upload/<id>")
def upload(id: str) -> Response:
    ALLOWED_EXTENSIONS: List[str] = ["pdf"]

    def allowed_file(filename: str):
        return (
            "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
        )


    if "file" not in request.files:
        return Response(response="Couldn't find file", status=400)

    file = request.files["file"]

    if not (file and allowed_file(filename=file.filename)):
        return Response(
            response=f"File with this extension is not supported\nSupported file extensions are: {ALLOWED_EXTENSIONS}",
            status=400,
        )
    
    filepath: str = os.path.join(f"static/{id}", file.filename)
    file.save(filepath)


    return Response(response=f"All good", status=200)

@app.post("/clear/<id>")
def clear(id: str) -> Response:
    directory: str = f"static/{id}"
    files = glob.glob(os.path.join(directory, '*'))
    for file in files:
        if os.path.isfile(file):
            os.remove(file)

    llm.retriever = None

    return Response(response="Context has been cleared", status=200)



@app.post("/prompt/<id>")
def prompt_new(id: str) -> Response:
    if llm.retriever == None:
        directory: str = f"static/{id}"
        num_files = 0

        for filename in os.listdir(directory):
            filepath = os.path.join(directory, filename)
            if os.path.isfile(filepath):
                num_files += 1

        if num_files > 0:
            llm.loadPdf(f"{directory}/{filename}")
        else:
            return Response(response="Waiting for context to be uploaded", status=400)


    chain = (
            {
                "context": itemgetter("question") | llm.retriever,
                "question": itemgetter("question"),
            }
            | llm.promt
            | llm.model
            | llm.parser
        )
    
    data: Dict = request.json
    prompt: str | None = data.get("prompt")
    if prompt == None:
        return Response(response="No prompt provided", status=400)
    response = chain.invoke({"question": prompt})

    return Response(response=response, status=200)

@app.post("/search")
def search() -> Response:
    data: Dict = request.json
    query: str | None = data.get("query")
    if query == None:
        return Response(response="No query provided", status=200)

    links: List[str] = parse_links_from_query(query=query)
    long_text: str = ""
    for link in links:
        not_long_text: str | None = parse_text_from_website(url=link)
        if not_long_text == None: continue
        long_text += not_long_text


    response: str = "Nothing"

    return Response(response=long_text, status=200)
    

@app.get("/check/<id>")
def check(id: str) -> Response:
    if not os.path.exists(f"static/{id}"):
        os.makedirs(f"static/{id}")
        return Response(response="Upload context first", status=400)
    
    directory: str = f"static/{id}"
    num_files = 0

    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if os.path.isfile(filepath):
            num_files += 1
    
    if not (num_files > 0):
        return Response(response="Upload context first", status=400)
        
    return Response(response=f"{id}", status=200)

@app.post("/create/<id>")
def create(id: str) -> Response:
    os.makedirs(f"static/{id}", exist_ok=True)
    return Response(response="New user registered", status=201)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=cfg["FLASK_DEBUG"] == "true")
