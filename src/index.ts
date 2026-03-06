import { OllamaEmbeddings } from "@langchain/ollama";
import { QdrantVectorStore } from "@langchain/qdrant";
import ollama from "ollama";

async function query() {
  const userQuery = "Who are the famous narcissists from history?";

  const embeddings = new OllamaEmbeddings({
    model: "mxbai-embed-large:latest",
    baseUrl: "http://localhost:11434",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "lawsOfHuman",
    },
  );

  const retriever = vectorStore.asRetriever({ k: 3 });

  const results = await retriever.invoke(userQuery);

  const systemPrompt = `You are a helpful assistant. Use the following retrieved context to answer the user's question accurately. If the context does not contain enough information, say so.

                        <context>
                        ${JSON.stringify(results)}
                        </context>

                        Answer based on the context above. Mention the page and line number too`;

  const response = await ollama.chat({
    model: "llama2:latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });

  return response.message.content;
}

query()
  .then((res) => {
    console.log(res);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
