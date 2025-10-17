module:
  id: rc
  name: RAG Chain
  
actions:
  ask:
    description: Answer question using RAG
    params:
      - name: question
        type: string
        required: true
        description: User's question
    returns:
      type: object
      description: Answer with sources
  
  get_history:
    description: Get chat history
    params:
      - name: limit
        type: integer
        default: 50
        description: Number of messages to return
    returns:
      type: list[object]
      description: Chat history
  
  clear_history:
    description: Clear chat history
    returns:
      type: null