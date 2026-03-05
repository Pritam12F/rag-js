import { OllamaEmbeddings } from "@langchain/ollama";
import { QdrantVectorStore } from "@langchain/qdrant";
import ollama from "ollama";

async function query() {
  const userQuery = "";

  const embeddings = new OllamaEmbeddings({
    model: "llama2",
    baseUrl: "http://localhost:11434",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "lawsOfHuman",
    },
  );

  const results = await vectorStore.similaritySearch(userQuery, 3);

  const systemPrompt = `You are a helpful assistant. Use the following retrieved context to answer the user's question accurately. If the context does not contain enough information, say so.

                        <context>
                        ${results.map((doc, i) => `[${i + 1}] ${doc.pageContent}`).join("\n\n")}
                        </context>

                        Answer based on the context above.`;

  const response = await ollama.chat({
    model: "llama2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });

  console.log(response.message.content);
}

query().then(() => process.exit());
