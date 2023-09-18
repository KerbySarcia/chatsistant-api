const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { Document } = require("langchain/document");
const Question = require("../schemas/question.schema");
const fs = require("fs");

const VECTOR_STORE_PATH = "./vectorstore"

const generate = async () => {
  const questions = await Question.find({}, { question: 1, answer : 1}).lean().exec();
  const docs = questions.map(d => new Document({
    pageContent: `${d.question} : ${d.answer}`
  }))

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const splitDocs = await splitter.splitDocuments(docs);
  
  const vectorstore = await HNSWLib.fromDocuments(splitDocs, new OpenAIEmbeddings());
  await vectorstore.save(VECTOR_STORE_PATH);
}

const load = async () => {
  return await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
}

const regenerate = async () => {
  fs.rmdirSync(VECTOR_STORE_PATH, { recursive: true });
  await generate();
}

const exists = () => {
  return fs.existsSync(VECTOR_STORE_PATH);
}

module.exports = {
  generate,
  load,
  exists
};