const httpStatus = require('http-status');
const { Doc } = require('../models');
const ApiError = require('../utils/ApiError');
const { OpenAI } = require('langchain/llms/openai');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory');
const { PDFLoader } = require('langchain/document_loaders/fs/pdf');
const { CustomPDFLoader } = require('../utils/customPDFLoaders');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { PineconeStore } = require('langchain/vectorstores/pinecone')
const { HNSWLib } = require('langchain/vectorstores/hnswlib')
const { PineconeClient } = require('@pinecone-database/pinecone');
const { makeChain } = require('../utils/makechain');
const { getUserPathWithCollection, getUserIndexPathWithCollection } = require('../utils/generatePath');
const dotenv = require('dotenv');
const { docsTypes } = require('../config/docs');
const { convertirTituloASlug } = require('../utils/stringUtils');

dotenv.config();

/**
 * Crea un documento
 * @param {String} user_id
 * @param {String} collection_name
 * @returns {Promise<Docs>}
 */
const createDocPDF = async (user_id, title) => {
  const collection_name = convertirTituloASlug(title)
  const pathUserWithCollection = getUserPathWithCollection(user_id, collection_name)

  try {
    const directoryLoader = new DirectoryLoader(pathUserWithCollection, {
      '.pdf': (path) => new PDFLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    const embeddings = new OpenAIEmbeddings();

    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings)

    // Guarda los vectores en un directorio
    const pathUserIndex = getUserIndexPathWithCollection(user_id, collection_name)
    await vectorStore.save(pathUserIndex);

    const newDoc = await Doc.create({
      user: user_id,
      type: docsTypes.PDF,
      title,
    });

    console.log('Todo listo, carpeta eliminada');
    return newDoc
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

/**
 * Pregunta sobre un documento
 * @param {Object} docBody
 * @returns {Promise<User>}
 */
const askPDF = async (user_id, collection_name, question, mode, initial_prompt) => {
  try {
    const embeddings = new OpenAIEmbeddings();

    
    // Cargar los vectores desde el mismo directorio
    const pathUserIndex = getUserIndexPathWithCollection(user_id, collection_name)
    const loadedVectorStore = await HNSWLib.load(pathUserIndex, embeddings);

    // const response = await loadedVectorStore.similaritySearchWithScore(question, 2);

    const chain = makeChain(loadedVectorStore, mode, '');

    const response = await chain.call({
      question: question, chat_history: [],
    })
      
    // // OpenAI recommends replacing newlines with spaces for best results
    // const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

    // //create chain
    // const chain = makeChain(vectorStore, mode, "");
    // //Ask a question using chat history
    // const response = await chain.call({
    //     question: sanitizedQuestion, chat_history: [],
    // });

    return response
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

/**
 * Get documents by user id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getDocsByUserId = async (id) => {
  return Doc.find({ user: id })
};

module.exports = {
  createDocPDF,
  askPDF,
  getDocsByUserId,
};
