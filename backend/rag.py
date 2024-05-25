from langchain_openai.chat_models import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain.prompts import PromptTemplate

from langchain_core.vectorstores import VectorStoreRetriever


from typing import List


class openAILlm:
    API_KEY: str
    MODEL_NAME: str

    model: ChatOpenAI
    embeddings: OpenAIEmbeddings
    retriever: VectorStoreRetriever | None
    promt: PromptTemplate
    parser: StrOutputParser

    def __init__(self, api_key: str, model_name: str) -> None:
        self.API_KEY = api_key
        self.MODEL_NAME = model_name

        self.model = ChatOpenAI(api_key=self.API_KEY, model=self.MODEL_NAME)
        self.embeddings = OpenAIEmbeddings()
        self.parser = StrOutputParser()
        self.retriever = None

        self.promt = PromptTemplate.from_template(
            """
                Answer the question based on the context below.
                If you can't answer the question, reply "I could not find any information from the provided context relevant to your question.".

                Context: {context}

                Question: {question}
            """
        )

    def loadPdf(self, path_to_pdf: str) -> None:
        loader: PyPDFLoader = PyPDFLoader(file_path=path_to_pdf)
        pages = loader.load_and_split()

        self.retriever = DocArrayInMemorySearch.from_documents(
            pages, embedding=self.embeddings
        ).as_retriever()


if __name__ == "__main__":
    pass
