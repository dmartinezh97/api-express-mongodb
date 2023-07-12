const httpStatus = require('http-status');
const { Docs } = require('../models');
const ApiError = require('../utils/ApiError');
const { OpenAI } = require('langchain/llms/openai');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { CustomPDFLoader } = require('../utils/customPDFLoaders');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { PineconeStore } = require('langchain/vectorstores/pinecone')
const dotenv = require('dotenv') // import * as dotenv from "dotenv";
const { PineconeClient } = require('@pinecone-database/pinecone');
const { makeChain } = require('../utils/makechain');

dotenv.config();

/**
 * Crea un documento
 * @param {Object} docBody
 * @returns {Promise<User>}
 */
const createDocPDF = async (collection_name, directoryPath) => {
  try {
    const directoryLoader = new DirectoryLoader(directoryPath, {
      '.pdf': (path) => new PDFLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    const embeddings = new OpenAIEmbeddings();

    const pinecone = new PineconeClient();

    await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index, namespace: collection_name, textKey: 'text',
    });
    
    console.log('Todo listo, carpeta eliminada');
    return true
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

/**
 * Pregunta sobre un documento
 * @param {Object} docBody
 * @returns {Promise<User>}
 */
const askPDF = async (req) => {
  const {question, collection_name, mode, initial_prompt} = req.body;
  try {
    const embeddings = new OpenAIEmbeddings();

    const pinecone = new PineconeClient();

    await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });

    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index, namespace: collection_name, textKey: 'text',
    });
    
    //create chain
    const chain = makeChain(vectorStore, mode, "");
    //Ask a question using chat history
    const response = await chain.call({
        question: sanitizedQuestion, chat_history: [],
    });

    return response
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

module.exports = {
  createDocPDF,
  askPDF,
};
