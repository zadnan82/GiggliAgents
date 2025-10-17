"""
Vector Store Prefab
Manages ChromaDB vector database
"""

from typing import List, Dict, Any
from pathlib import Path
import chromadb
from datetime import datetime
import uuid


class VectorStore:
    """Local vector database using ChromaDB"""

    def __init__(self):
        # Store in user's home directory
        self.db_path = Path.home() / ".giggliagents" / "rag_vectordb"
        self.db_path.mkdir(parents=True, exist_ok=True)

        # Initialize ChromaDB
        self.client = chromadb.PersistentClient(path=str(self.db_path))
        self.collection = self.client.get_or_create_collection(
            name="documents", metadata={"description": "RAG document store"}
        )

        print(f"✅ Vector store initialized at {self.db_path}")

    def add_document(self, file_path: str, chunks: List[str], embeddings: Any) -> str:
        """
        Add document to vector store

        Args:
            file_path: Path to original document
            chunks: List of text chunks
            embeddings: Embeddings for chunks

        Returns:
            Document ID
        """
        doc_id = str(uuid.uuid4())
        doc_name = Path(file_path).name

        # Generate IDs for each chunk
        chunk_ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]

        # Prepare metadata
        metadatas = [
            {
                "doc_id": doc_id,
                "doc_name": doc_name,
                "doc_path": file_path,
                "chunk_index": i,
                "added_at": datetime.now().isoformat(),
            }
            for i in range(len(chunks))
        ]

        # Add to collection
        self.collection.add(
            embeddings=embeddings.tolist(),
            documents=chunks,
            metadatas=metadatas,
            ids=chunk_ids,
        )

        print(f"✅ Added document {doc_name} with {len(chunks)} chunks")

        return doc_id

    def get_all_documents(self) -> List[str]:
        """Get list of all document names in the store"""
        try:
            # Get all items from collection
            results = self.collection.get(include=["metadatas"])

            if results and "metadatas" in results and results["metadatas"]:
                # Extract unique document names
                docs = set()
                for metadata in results["metadatas"]:
                    if metadata and "doc_name" in metadata:  # ← Changed here
                        docs.add(metadata["doc_name"])

                doc_list = sorted(list(docs))
                print(f"📚 Found {len(doc_list)} documents: {doc_list}")
                return doc_list

            print("⚠️ No documents found in vector store")
            return []

        except Exception as e:
            print(f"❌ Error getting documents: {e}")
            return []

    def search(
        self, query: str, top_k: int = 5, document_filter: List[str] = None
    ) -> List[Dict[str, Any]]:
        """Search with optional document filtering"""
        from prefabs.embedding_generator.embedding_generator import EmbeddingGenerator

        # EmbeddingGenerator loads settings itself - no parameters needed!
        embedding_gen = EmbeddingGenerator()
        query_embedding = embedding_gen.generate_embeddings([query])[0]

        # Build where clause for filtering
        where_clause = None
        if document_filter:
            where_clause = {"doc_name": {"$in": document_filter}}

        # Search
        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_k,
            where=where_clause,
        )

        # Format results
        formatted_results = []
        if results["documents"] and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                formatted_results.append(
                    {
                        "text": doc,
                        "relevance": -results["distances"][0][i],
                        "document": results["metadatas"][0][i].get(
                            "doc_name", "unknown"
                        )
                        if results["metadatas"]
                        else "unknown",
                    }
                )

        return formatted_results

    def delete_document(self, doc_id: str):
        """Delete all chunks for a document"""
        # Get all chunk IDs for this document
        results = self.collection.get(where={"doc_id": doc_id})

        if results["ids"]:
            self.collection.delete(ids=results["ids"])
            print(f"✅ Deleted document {doc_id}")

    def get_stats(self) -> Dict:
        """Get statistics about vector store"""
        all_data = self.collection.get()

        unique_docs = set()
        for metadata in all_data["metadatas"]:
            unique_docs.add(metadata["doc_id"])

        return {
            "total_chunks": len(all_data["ids"]),
            "total_documents": len(unique_docs),
            "storage_path": str(self.db_path),
        }

    def reset(self):
        """Delete all data"""
        self.client.delete_collection("documents")
        self.collection = self.client.create_collection(
            name="documents", metadata={"description": "RAG document store"}
        )
        print("✅ Vector store reset")
