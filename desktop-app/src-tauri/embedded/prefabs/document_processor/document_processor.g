module:
  id: dp
  name: Document Processor
  
actions:
  extract_text:
    description: Extract text from document and split into chunks
    params:
      - name: file_path
        type: string
        required: true
        description: Path to document file
      - name: chunk_size
        type: integer
        default: 500
        description: Size of each text chunk
      - name: chunk_overlap
        type: integer
        default: 50
        description: Overlap between chunks
    returns:
      type: list[string]
      description: List of text chunks