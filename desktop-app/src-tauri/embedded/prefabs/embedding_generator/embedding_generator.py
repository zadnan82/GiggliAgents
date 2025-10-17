"""
Embedding Generator Prefab
Generates embeddings using local or cloud models
"""

from typing import List
import numpy as np
from pathlib import Path
import json


class EmbeddingGenerator:
    """Generate embeddings for text"""

    def __init__(self):
        self.settings = self._load_settings()
        self.provider = self.settings.get("embedding_provider", "local")
        self._model = None

    def _load_settings(self) -> dict:
        """Load settings from config"""
        settings_path = Path.home() / ".giggliagents" / "rag_settings.json"
        if settings_path.exists():
            with open(settings_path, "r") as f:
                return json.load(f)
        return {}

    @property
    def model(self):
        """Lazy load embedding model"""
        if self._model is None:
            if self.provider == "local":
                from sentence_transformers import SentenceTransformer

                print("Loading local embedding model...")
                self._model = SentenceTransformer("all-MiniLM-L6-v2")
                print("✅ Local embedding model loaded")
            elif self.provider == "openai":
                import openai

                api_key = self.settings.get("openai_api_key")
                if not api_key:
                    raise ValueError("OpenAI API key not configured")
                openai.api_key = api_key
                self._model = "openai"
            elif self.provider == "claude":
                # Claude doesn't have embeddings, fall back to local
                from sentence_transformers import SentenceTransformer

                self._model = SentenceTransformer("all-MiniLM-L6-v2")

        return self._model

    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Generate embeddings for texts

        Args:
            texts: List of text chunks

        Returns:
            Numpy array of embeddings
        """
        print(f"🔢 Generating embeddings for {len(texts)} chunks...")

        if self.provider == "local":
            embeddings = self.model.encode(texts, show_progress_bar=False)

        elif self.provider == "openai":
            import openai

            api_key = self.settings.get("openai_api_key")
            if not api_key:
                raise ValueError("OpenAI API key not configured")

            # Create client with API key
            client = openai.OpenAI(api_key=api_key)

            embeddings = []
            for text in texts:
                response = client.embeddings.create(
                    model="text-embedding-3-small", input=text
                )
                embeddings.append(response.data[0].embedding)
            embeddings = np.array(embeddings)

        else:
            # Default to local
            from sentence_transformers import SentenceTransformer

            model = SentenceTransformer("all-MiniLM-L6-v2")
            embeddings = model.encode(texts, show_progress_bar=False)

        print(f"✅ Generated {len(embeddings)} embeddings")
        return embeddings

    def embed_query(self, query: str) -> np.ndarray:
        """
        Generate embedding for a single query

        Args:
            query: Query text

        Returns:
            Embedding vector
        """
        return self.generate_embeddings([query])[0]
