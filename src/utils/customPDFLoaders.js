const { Document} = require('langchain/document');
const { readFile} = require('fs/promises');
const { BaseDocumentLoader } = require('langchain/document_loaders/base');

class BufferLoader extends BaseDocumentLoader {
    constructor(filePathOrBlob) {
        super();
    }

    async load(){
        let buffer;
        let metadata;
        if (typeof this.filePathOrBlob === 'string') {
            buffer = await readFile(this.filePathOrBlob);
            metadata = {source: this.filePathOrBlob};
        } else {
            buffer = await this.filePathOrBlob
                .arrayBuffer()
                .then((ab) => Buffer.from(ab));
            metadata = {source: 'blob', blobType: this.filePathOrBlob.type};
        }
        return this.parse(buffer, metadata);
    }
}

class CustomPDFLoader extends BufferLoader {
    async parse(raw, metadata,){
        const {pdf} = await PDFLoaderImports();
        const parsed = await pdf(raw);
        return [new Document({
            pageContent: parsed.text, metadata: {
                ...metadata, pdf_numpages: parsed.numpages,
            },
        }),];
    }
}


async function PDFLoaderImports() {
    try {
        // the main entrypoint has some debug code that we don't want to import
        const {default: pdf} = await import('pdf-parse/lib/pdf-parse.js');
        return {pdf};
    } catch (e) {
        console.error(e);
        throw new Error('Error al cargar pdf-parse. Por favor, instalalo por ejemplo con, `npm install pdf-parse`.',);
    }
}

module.exports = { BufferLoader, CustomPDFLoader }