const { OpenAI } = require('langchain/llms/openai');
const { PineconeStore } = require('langchain/vectorstores/pinecone')
const { ConversationalRetrievalQAChain } = require('langchain/chains');

const makeChain = (vectorstore, mode, initial_prompt) => {

    const prompts = getInitialPromptByMode(mode, initial_prompt);

    const model = new OpenAI({
        temperature: 1, // increase temepreature to get more creative answers
        modelName: 'gpt-3.5-turbo',
        // modelName: 'text-davinci-003' //OK
        // modelName: 'text-davinci-002' //OK
        // modelName: 'gpt-4',
    });

    let enableSourceDocuments = false;

    if (mode === 'pair_programmer') {
        enableSourceDocuments = true;
    }
    return ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
        qaTemplate: prompts.qa_prompt,
        questionGeneratorTemplate: prompts.condense_prompt,
        returnSourceDocuments: enableSourceDocuments, //The number of source documents returned is 4 by default
    },);
};

function getInitialPromptByMode(mode, initial_prompt) {
    switch (mode) {
        case 'assistant':
            return {
                condense_prompt: `Dada la siguiente conversación y una pregunta de seguimiento, reformule la pregunta de seguimiento para que sea una pregunta independiente.

Historia del chat:
{chat_history}
Entrada de seguimiento: {question}
Pregunta independiente:`, qa_prompt: initial_prompt
            };
        case 'pair_programmer':
            return {
                condense_prompt: `Dada la siguiente conversación y una pregunta de seguimiento, reformule la pregunta de seguimiento para que sea una pregunta independiente.

Historia del chat:
{chat_history}
Entrada de seguimiento: {question}
Pregunta independiente:`, qa_prompt: `Eres un programador de IA de gran ayuda. Se te dará el contenido del repositorio git y deberás responder a preguntas sobre el código en el contexto dado. 
Debes responder con código cuando se te pida que escribas uno, y debes responder con un archivo markdown cuando se te pida que escribas uno, si la pregunta no es sobre el código en el contexto, responde con "Sólo respondo preguntas sobre el código en el contexto dado".

{context}

Entrada de seguimiento: {question}
Respuesta útil en markdown:`
            };
        default:
            return {
                condense_prompt: `Dada la siguiente conversación y una pregunta de seguimiento, reformule la pregunta de seguimiento para que sea una pregunta independiente.

Historia del chat:
{chat_history}
Entrada de seguimiento: {question}
Pregunta independiente:`, qa_prompt: initial_prompt
            };
    }
}

// function getInitialPromptByMode(mode, initial_prompt) {
//     switch (mode) {
//         case 'assistant':
//             return {
//                 condense_prompt: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

// Chat History:
// {chat_history}
// Follow Up Input: {question}
// Standalone question:`, qa_prompt: initial_prompt
//             };
//         case 'pair_programmer':
//             return {
//                 condense_prompt: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

// Chat History:
// {chat_history}
// Follow Up Input: {question}
// Standalone question:`, qa_prompt: `You are a helpful AI programmer. you will be given the content of git repository and your should answer questions about the code in the given context. 
// You must answer with code when asked to write one, and you must answer with a markdown file when asked to write one, if the question is not about the code in the context, answer with "I only answer questions about the code in the given context".

// {context}

// Question: {question}
// Helpful answer in markdown:`
//             };
//         default:
//             return {
//                 condense_prompt: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

// Chat History:
// {chat_history}
// Follow Up Input: {question}
// Standalone question:`, qa_prompt: initial_prompt
//             };
//     }
// }

module.exports = { makeChain }