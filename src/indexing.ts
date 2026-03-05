import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/ollama";

async function init() {
  const loader = new PDFLoader("./pdf/law.pdf");
  const embeddings = new OllamaEmbeddings({
    model: "llama2",
    baseUrl: "http://localhost:11434",
  });

  const docs = await loader.load();

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "lawsOfHuman",
    },
  );

  await vectorStore.addDocuments(docs);
}

init().then(() => process.exit(0));
