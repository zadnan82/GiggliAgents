module:
  id: vs
  name: Vector Store
  
actions:
  add_document:
    description: Add document to vector database
    params:
      - name: file_path
        type: string
        required: true
      - name: chunks
        type: list[string]
        required: true
      - name: embeddings
        type: array
        required: true
    returns:
      type: string
      description: Document ID
  
  search:
    description: Search for similar chunks
    params:
      - name: query_embedding
        type: array
        required: true
      - name: top_k
        type: integer
        default: 5
    returns:
      type: object
      description: Search results with documents and metadata
  
  delete_document:
    description: Delete document from database
    params:
      - name: doc_id
        type: string
        required: true
    returns:
      type: null
  
  get_all_documents:
    description: Get list of all documents
    returns:
      type: list[object]
      description: List of documents with metadata
  
  get_stats:
    description: Get vector store statistics
    returns:
      type: object
      description: Statistics about storage
  
  reset:
    description: Delete all data from vector store
    returns:
      type: null