module:
  id: eg
  name: Embedding Generator
  
actions:
  generate_embeddings:
    description: Generate embeddings for multiple texts
    params:
      - name: texts
        type: list[string]
        required: true
        description: List of texts to embed
    returns:
      type: array
      description: Numpy array of embeddings
  
  embed_query:
    description: Generate embedding for a single query
    params:
      - name: query
        type: string
        required: true
        description: Query text
    returns:
      type: array
      description: Embedding vector