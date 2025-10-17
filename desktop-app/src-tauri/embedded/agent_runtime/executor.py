"""
Central Executor for RAG Agent
Routes commands to appropriate modules
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any, Optional
import subprocess
from prefabs.embedding_generator.embedding_generator import EmbeddingGenerator
from prefabs.document_processor.document_processor import DocumentProcessor
from prefabs.vector_store.vector_store import VectorStore
from prefabs.rag_chain.rag_chain import RAGChain
from prefabs.settings.settings_manager import SettingsManager


# Add parent directory to path for absolute imports
sys.path.insert(0, str(Path(__file__).parent.parent))


class Executor:
    """Execute RAG commands"""

    def __init__(self):
        self.base_dir = Path(__file__).parent.parent

        # Lazy load modules
        self._document_processor = None
        self._embedding_generator = None
        self._vector_store = None
        self._rag_chain = None
        self._settings_manager = None

        print("✅ RAG Executor initialized")

    @property
    def document_processor(self):
        if self._document_processor is None:
            self._document_processor = DocumentProcessor()
        return self._document_processor

    @property
    def embedding_generator(self):
        if self._embedding_generator is None:
            self._embedding_generator = EmbeddingGenerator()
        return self._embedding_generator

    @property
    def vector_store(self):
        if self._vector_store is None:
            self._vector_store = VectorStore()
        return self._vector_store

    @property
    def rag_chain(self):
        """Lazy load RAG chain"""
        if self._rag_chain is None:
            # Load settings
            from prefabs.settings.settings_manager import SettingsManager

            settings_manager = SettingsManager()
            settings = settings_manager.get_settings()

            # Pass vector_store, llm_provider, and settings
            self._rag_chain = RAGChain(
                vector_store=self.vector_store,
                llm_provider=settings.get("llm_provider", "openai"),
                settings=settings,
            )
        return self._rag_chain

    @property
    def settings_manager(self):
        if self._settings_manager is None:
            self._settings_manager = SettingsManager()
        return self._settings_manager

    def execute(self, command: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a command"""
        try:
            print(f"▶️  Executing: {command}")

            # Handle case where params is a JSON string
            if isinstance(params, str):
                import json

                params = json.loads(params) if params else {}
            elif params is None:
                params = {}

            # Handle command aliases
            if command == "get_documents":
                command = "get_all_documents"

            if command == "process_document":
                return self._handle_process_document(params)
            elif command == "answer_question":
                return self._handle_answer_question(params)
            elif command == "get_vector_stats":
                return self._handle_get_vector_stats(params)
            elif command == "get_all_documents":
                return self._handle_get_all_documents(params)
            elif command == "get_chat_history":
                return self._handle_get_chat_history(params)
            elif command == "clear_chat_history":
                return self._handle_clear_chat_history(params)
            elif command == "delete_document":
                return self._handle_delete_document(params)
            elif command == "save_ai_settings":  # ← ADD
                return self._handle_save_ai_settings(params)
            elif command == "get_ai_settings":  # ← ADD
                return self._handle_get_ai_settings(params)
            elif command == "check_ollama_installed":  # ← ADD
                return self._handle_check_ollama_installed(params)
            elif command == "get_ollama_models":  # ← ADD
                return self._handle_get_ollama_models(params)
            else:
                return {"error": f"Unknown command: {command}"}

        except Exception as e:
            print(f"❌ Command failed: {e}")
            import traceback

            traceback.print_exc()
            return {"error": str(e)}

    def _handle_delete_document(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Delete a document and all its chunks"""
        document_name = params.get("document_name")

        if not document_name:
            return {"error": "No document_name provided"}

        try:
            # Delete all chunks from this document
            self.vector_store.collection.delete(where={"doc_name": document_name})

            print(f"✅ Deleted document: {document_name}")
            return {"success": True, "message": f"Deleted {document_name}"}

        except Exception as e:
            print(f"❌ Failed to delete document: {e}")
            return {"error": str(e)}

    # ============================================
    # DOCUMENT HANDLERS
    # ============================================

    def _handle_process_document(self, params: Dict) -> Dict:
        """Process and add document"""
        file_path = params.get("file_path")
        if not file_path:
            return {"error": "file_path required"}

        # 1. Extract text and chunk
        chunks = self.document_processor.extract_text(file_path)

        # 2. Generate embeddings
        embeddings = self.embedding_generator.generate_embeddings(chunks)

        # 3. Store in vector DB
        doc_id = self.vector_store.add_document(
            file_path=file_path, chunks=chunks, embeddings=embeddings
        )

        return {"success": True, "doc_id": doc_id, "chunks_count": len(chunks)}

    def _handle_get_documents(self, params: Dict) -> Dict:
        """Get all documents"""
        documents = self.vector_store.get_all_documents()
        return {"documents": documents}

    def _handle_delete_document(self, params: Dict) -> Dict:
        """Delete a document"""
        doc_id = params.get("doc_id")
        if not doc_id:
            return {"error": "doc_id required"}

        self.vector_store.delete_document(doc_id)
        return {"success": True}

    def _handle_get_document_stats(self, params: Dict) -> Dict:
        """Get document statistics"""
        stats = self.vector_store.get_stats()
        return stats

    # ============================================
    # CHAT HANDLERS
    # ============================================

    def _handle_answer_question(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Handle answering a question"""
        # Handle empty params
        if not params or not isinstance(params, dict):
            params = {}

        question = params.get("question", "")

        if not question:
            return {"error": "No question provided"}

        # Just call answer_question without document_filter
        result = self.rag_chain.answer_question(question)
        return result

    def _handle_get_chat_history(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get chat history"""
        # Handle empty params
        if not params or not isinstance(params, dict):
            params = {}

        limit = params.get("limit", 50)
        history = self.rag_chain.get_chat_history(limit)
        return {"history": history}

    def _handle_clear_chat_history(self, params: Dict) -> Dict:
        """Clear chat history"""
        self.rag_chain.clear_history()
        return {"success": True}

    # ============================================
    # SETTINGS HANDLERS
    # ============================================

    def _handle_save_ai_settings(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Save AI settings"""
        if not params or not isinstance(params, dict):
            params = {}

        settings_str = params.get("settings", "{}")

        try:
            import json
            from pathlib import Path

            # Parse settings
            if isinstance(settings_str, str):
                settings = json.loads(settings_str)
            else:
                settings = settings_str

            # Save to file
            settings_path = Path.home() / ".giggliagents" / "rag_settings.json"
            settings_path.parent.mkdir(parents=True, exist_ok=True)

            with open(settings_path, "w") as f:
                json.dump(settings, f, indent=2)

            print("✅ Settings saved")
            return {"success": True}

        except Exception as e:
            print(f"❌ Failed to save settings: {e}")
            return {"error": str(e)}

    def _handle_get_ai_settings(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get AI settings"""
        try:
            import json
            from pathlib import Path

            settings_path = Path.home() / ".giggliagents" / "rag_settings.json"

            if settings_path.exists():
                with open(settings_path, "r") as f:
                    settings = json.load(f)
            else:
                # Default settings
                settings = {
                    "llm_provider": "openai",
                    "embedding_provider": "openai",
                    "ollama_model": "llama3",
                    "openai_model": "gpt-4o-mini",
                    "openai_api_key": "",
                    "temperature": 0.7,
                    "chunk_size": 500,
                    "chunk_overlap": 50,
                    "top_k": 5,
                }

            return settings

        except Exception as e:
            print(f"❌ Failed to load settings: {e}")
            return {"error": str(e)}

    def _handle_check_ollama_installed(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Check if Ollama is installed"""
        try:
            import subprocess

            result = subprocess.run(
                ["ollama", "--version"], capture_output=True, text=True
            )
            installed = result.returncode == 0
            return {"installed": installed}
        except:
            return {"installed": False}

    def _handle_get_ollama_models(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get installed Ollama models"""
        try:
            import subprocess

            result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
            if result.returncode == 0:
                lines = result.stdout.strip().split("\n")[1:]  # Skip header
                models = [line.split()[0] for line in lines if line.strip()]
                return {"models": models}
            return {"models": []}
        except:
            return {"models": []}

    def _handle_install_ollama_model(self, params: Dict) -> Dict:
        """Install Ollama model"""
        model_name = params.get("model_name")
        if not model_name:
            return {"error": "model_name required"}

        try:
            print(f"📥 Pulling {model_name}... (this may take 5-10 minutes)")

            # Run ollama pull
            process = subprocess.Popen(
                ["ollama", "pull", model_name],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True,  # CRITICAL for Windows!
            )

            # Wait for completion
            stdout, stderr = process.communicate(timeout=600)

            if process.returncode == 0:
                print(f"✅ {model_name} installed successfully!")
                return {"success": True, "message": f"{model_name} is ready to use"}
            else:
                print(f"❌ Pull failed: {stderr}")
                return {"error": stderr or "Installation failed"}

        except subprocess.TimeoutExpired:
            return {"error": "Installation timed out after 10 minutes"}
        except Exception as e:
            print(f"❌ Installation error: {e}")
            return {"error": str(e)}

    # ============================================
    # VECTOR STORE HANDLERS
    # ============================================

    def _handle_get_vector_stats(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get vector store statistics"""
        # Handle empty params
        if not params or not isinstance(params, dict):
            params = {}

        stats = self.vector_store.get_stats()
        return stats

    def _handle_reset_vector_store(self, params: Dict) -> Dict:
        """Reset vector store"""
        self.vector_store.reset()
        return {"success": True}

    def _handle_get_all_documents(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get all unique documents from vector store"""
        # Handle empty params
        if not params or not isinstance(params, dict):
            params = {}

        try:
            # Get all documents from vector store
            all_docs = self.vector_store.get_all_documents()

            # Get metadata for each document
            documents = []
            for doc_name in all_docs:
                # Try to get metadata from vector store
                try:
                    # Query for this document to get metadata
                    results = self.vector_store.collection.get(
                        where={"doc_name": doc_name}, limit=1, include=["metadatas"]
                    )

                    if results and results["metadatas"] and results["metadatas"][0]:
                        metadata = results["metadatas"][0]

                        # Count chunks for this document
                        chunk_count = self.vector_store.collection.count(
                            where={"doc_name": doc_name}
                        )

                        documents.append(
                            {
                                "doc_id": metadata.get("doc_id", ""),
                                "doc_name": doc_name,
                                "added_at": metadata.get("added_at", ""),
                                "chunks_count": chunk_count,
                                "doc_path": metadata.get("doc_path", ""),
                            }
                        )
                    else:
                        # No metadata found, add basic info
                        documents.append(
                            {
                                "doc_id": "",
                                "doc_name": doc_name,
                                "added_at": "",
                                "chunks_count": 0,
                                "doc_path": "",
                            }
                        )

                except Exception as e:
                    print(f"⚠️ Error getting metadata for {doc_name}: {e}")
                    documents.append(
                        {
                            "doc_id": "",
                            "doc_name": doc_name,
                            "added_at": "",
                            "chunks_count": 0,
                            "doc_path": "",
                        }
                    )

            return {"documents": documents}

        except Exception as e:
            print(f"❌ Failed to get documents: {e}")
            return {"documents": []}
