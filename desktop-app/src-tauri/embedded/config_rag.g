agent:
  name: "RAG Knowledge Assistant"
  version: "1.0.0"
  tier: "pro"
  description: "Private AI-powered document search and Q&A system"

providers:
  - local    # Ollama
  - openai
  - claude

workflows:
  process_document:
    name: "Process Document"
    description: "Extract text, generate embeddings, store in vector DB"
    steps:
      - name: "Extract Text"
        module: "dp"  # Document Processor
        action: "extract_text"
        params:
          chunk_size: 500
          chunk_overlap: 50
      
      - name: "Generate Embeddings"
        module: "eg"  # Embedding Generator
        action: "generate_embeddings"
        params:
          provider: "auto"  # Use configured provider
      
      - name: "Store in Vector DB"
        module: "vs"  # Vector Store
        action: "add_documents"

  answer_question:
    name: "Answer Question"
    description: "Search relevant documents and generate answer"
    steps:
      - name: "Embed Question"
        module: "eg"
        action: "embed_query"
      
      - name: "Search Similar"
        module: "vs"
        action: "search"
        params:
          top_k: 5
      
      - name: "Generate Answer"
        module: "rc"  # RAG Chain
        action: "generate_answer"
        params:
          provider: "auto"
          temperature: 0.7

  delete_document:
    name: "Delete Document"
    description: "Remove document from vector store"
    steps:
      - name: "Remove from DB"
        module: "vs"
        action: "delete_document"

schedule:
  enabled: false