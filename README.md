# RAG — Retrieval-Augmented Generation

A local RAG pipeline built with LangChain, Ollama, and Qdrant. It indexes a PDF into a vector store and answers questions from it using a local LLM — no external API keys required.

## How it works

1. **Indexing** — loads a PDF, splits it into chunks, embeds them with `mxbai-embed-large`, and stores them in Qdrant.
2. **Querying** — embeds the user's question, retrieves the most relevant chunks, and sends them as context to `llama2` via Ollama.

## Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- [Docker](https://www.docker.com)
- [Ollama](https://ollama.com)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Pull Ollama models

```bash
ollama pull mxbai-embed-large
ollama pull llama2
```

### 3. Start Qdrant

```bash
docker compose up -d
```

This starts Qdrant on `http://localhost:6333`.

### 4. Add your PDF

Place the PDF you want to query at:

```
pdf/law.pdf
```

### 5. Index the PDF

```bash
pnpm run index
```

This loads the PDF, splits it into chunks, and stores the embeddings in Qdrant under the collection `lawsOfHuman`.

### 6. Run a query

Edit the `userQuery` variable in [src/index.ts](src/index.ts), then run:

```bash
pnpm run dev
```

The answer will be printed to the console.

## Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `pnpm run index` | Index the PDF into Qdrant            |
| `pnpm run dev`   | Run a query against the indexed data |
| `pnpm run build` | Compile TypeScript                   |
| `pnpm run start` | Run the compiled output              |
