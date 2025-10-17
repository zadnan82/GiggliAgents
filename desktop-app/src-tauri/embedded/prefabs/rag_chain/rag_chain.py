"""
RAG Chain Prefab
Handles question answering with smart document filtering
"""

import json
from typing import Dict, Any, List
from datetime import datetime
from pathlib import Path


class RAGChain:
    """RAG chain for question answering with intelligent filtering"""

    def __init__(
        self, vector_store, llm_provider: str = "openai", settings: Dict = None
    ):
        self.vector_store = vector_store
        self.llm_provider = llm_provider
        self.settings = settings or {}
        self.chat_history_file = Path.home() / ".giggliagents" / "chat_history.json"
        self.chat_history_file.parent.mkdir(parents=True, exist_ok=True)

        print(f"✅ RAG Chain initialized (LLM: {llm_provider})")

    def _identify_document_intent(
        self, question: str, all_docs: List[str]
    ) -> List[str]:
        """
        Smart document filtering based on question intent

        Args:
            question: User's question
            all_docs: List of all document names

        Returns:
            List of relevant document names to search
        """
        question_lower = question.lower()

        # Keywords that indicate specific document types
        doc_type_keywords = {
            "image": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
            "audio": [".wav", ".mp3", ".m4a", ".flac", ".ogg"],
            "video": [".mp4", ".avi", ".mov", ".mkv"],
            "spreadsheet": [".csv", ".xlsx", ".xls"],
            "document": [".pdf", ".docx", ".doc", ".txt"],
            "code": [".html", ".xml", ".json", ".py", ".js"],
            "archive": [".zip", ".7z"],
        }

        # Check if question mentions specific file types
        relevant_docs = []
        mentioned_types = []

        for doc_type, extensions in doc_type_keywords.items():
            if doc_type in question_lower or any(
                ext[1:] in question_lower for ext in extensions
            ):
                mentioned_types.append(doc_type)
                # Add all docs of this type
                for doc in all_docs:
                    if any(doc.lower().endswith(ext) for ext in extensions):
                        relevant_docs.append(doc)

        # Check if question mentions specific filenames
        for doc in all_docs:
            doc_name_parts = doc.lower().replace("_", " ").replace("-", " ").split(".")
            for part in doc_name_parts[:-1]:  # Exclude extension
                if len(part) > 3 and part in question_lower:
                    if doc not in relevant_docs:
                        relevant_docs.append(doc)

        # If no specific docs identified, search all
        if not relevant_docs:
            return all_docs

        return relevant_docs

    def _improve_question(self, question: str) -> str:
        """
        Enhance vague questions to be more searchable

        Args:
            question: Original question

        Returns:
            Enhanced question
        """
        question_lower = question.lower().strip()

        # Common vague patterns and their improvements
        improvements = {
            # "what is in" → "summarize and describe the content"
            r"what\s+(is|are)\s+in": "Summarize and describe the main content and topics in",
            r"what.*about": "Explain the main topics and information about",
            r"tell me about": "Provide a detailed summary of",
            r"what does.*say": "Summarize the main points and information in",
            r"what.*contain": "List and describe the main content and information in",
        }

        # Apply improvements
        import re

        enhanced = question
        for pattern, replacement in improvements.items():
            enhanced = re.sub(pattern, replacement, enhanced, flags=re.IGNORECASE)

        return enhanced

    def answer_question(self, question: str, top_k: int = 5) -> Dict[str, Any]:
        """
        Answer question with smart filtering and helpful responses
        """
        print(f"❓ Question: {question}")

        # Get all available documents
        all_docs = self.vector_store.get_all_documents()

        if not all_docs:
            return {
                "answer": "No documents have been uploaded yet. Please upload some documents first to ask questions about them.",
                "sources": [],
            }

        # Check if question has explicit filter directive
        manual_filter = None
        clean_question = question

        if question.startswith("[Search only in ") and "]" in question:
            # Extract filter: [Search only in filename.pdf] actual question
            end_bracket = question.index("]")
            filter_part = question[16:end_bracket]  # After "[Search only in "
            clean_question = question[end_bracket + 1 :].strip()
            manual_filter = filter_part.strip()
            print(f"🎯 Manual filter detected: {manual_filter}")

        # If manual filter specified, use only that document
        if manual_filter:
            matching_docs = [d for d in all_docs if manual_filter in d]
            if matching_docs:
                relevant_doc_filter = matching_docs
                print(f"✅ Filtering to: {matching_docs}")
            else:
                print(f"⚠️ Filter '{manual_filter}' not found, using all docs")
                relevant_doc_filter = all_docs
        else:
            # Smart automatic filtering
            relevant_doc_filter = self._identify_document_intent(
                clean_question, all_docs
            )

        if len(relevant_doc_filter) < len(all_docs):
            print(
                f"🎯 Smart filter: Searching {len(relevant_doc_filter)}/{len(all_docs)} relevant documents"
            )
            for doc in relevant_doc_filter:
                print(f"   ✓ {doc}")
            ignored = [d for d in all_docs if d not in relevant_doc_filter]
            if ignored:
                print(
                    f"   ✗ Ignoring: {', '.join(ignored[:3])}{'...' if len(ignored) > 3 else ''}"
                )

        # Enhance vague questions
        enhanced_question = self._improve_question(clean_question)
        if enhanced_question != clean_question:
            print(f"💡 Enhanced query: {enhanced_question}")

        # Search with filtering
        results = self.vector_store.search(
            enhanced_question,
            top_k=top_k,
            document_filter=relevant_doc_filter
            if relevant_doc_filter != all_docs
            else None,
        )

        if not results:
            doc_list = "\n".join([f"• {doc}" for doc in all_docs])
            return {
                "answer": f"I couldn't find any relevant information. I have these documents:\n\n{doc_list}\n\nTry asking more specific questions about the content of these documents.",
                "sources": [],
            }

        # Check relevance quality
        best_relevance = results[0]["relevance"] if results else -1
        avg_relevance = (
            sum(r["relevance"] for r in results) / len(results) if results else -1
        )

        print(f"📊 Relevance: best={best_relevance:.2f}, avg={avg_relevance:.2f}")

        # Build context from results
        context = "\n\n".join(
            [f"From {r['document']}:\n{r['text']}" for r in results[:top_k]]
        )

        # Generate answer using LLM
        answer = self._generate_answer(context, question, results)

        # Save to history
        self._save_to_history(question, answer, results)

        return {"answer": answer, "sources": results}

    def _generate_answer(self, context: str, question: str, sources: List[Dict]) -> str:
        """Generate answer using LLM with helpful fallbacks"""

        # Build helpful prompt
        doc_list = ", ".join(set([s["document"] for s in sources[:5]]))

        prompt = f"""Based on the following information from documents ({doc_list}), answer the user's question.

Context:
{context}

Question: {question}

Instructions:
- Provide a clear, helpful answer based on the context
- If the context doesn't fully answer the question, explain what information IS available
- Be conversational and natural
- Don't say "based on the provided documents" - just answer naturally
- If you're not sure, say so clearly

Answer:"""

        try:
            if self.llm_provider == "openai":
                answer = self._call_openai(prompt)
            elif self.llm_provider == "local":
                answer = self._call_ollama(prompt)
            else:
                answer = "LLM provider not configured. Please check settings."

            # Add helpful context if relevance is low
            best_relevance = sources[0]["relevance"] if sources else -1
            if best_relevance < 0:
                doc_names = list(set([s["document"] for s in sources[:3]]))
                answer += f"\n\n💡 Note: I searched in {', '.join(doc_names)} but the match wasn't perfect. Try asking more specific questions about the content."

            return answer

        except Exception as e:
            print(f"❌ LLM error: {e}")
            # Fallback: return context directly
            return f"I found this information but couldn't generate a summary:\n\n{context[:500]}..."

    def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        import openai

        api_key = self.settings.get("openai_api_key")
        if not api_key:
            return "OpenAI API key not configured. Please add it in Settings."

        client = openai.OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model=self.settings.get("openai_model", "gpt-4o-mini"),
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions based on provided documents. Be clear, concise, and conversational.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=self.settings.get("temperature", 0.7),
            max_tokens=500,
        )

        return response.choices[0].message.content

    def _call_ollama(self, prompt: str) -> str:
        """Call local Ollama"""
        import ollama

        model = self.settings.get("ollama_model", "llama3")

        response = ollama.chat(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that answers questions based on provided documents. Be clear, concise, and conversational.",
                },
                {"role": "user", "content": prompt},
            ],
        )

        return response["message"]["content"]

    def _save_to_history(self, question: str, answer: str, sources: List[Dict]):
        """Save Q&A to history"""
        try:
            # Load existing history
            if self.chat_history_file.exists():
                with open(self.chat_history_file, "r", encoding="utf-8") as f:
                    history = json.load(f)
            else:
                history = []

            # Add new entry
            history.append(
                {
                    "timestamp": datetime.now().isoformat(),
                    "question": question,
                    "answer": answer,
                    "sources": [
                        {"document": s["document"], "relevance": s["relevance"]}
                        for s in sources[:5]
                    ],
                }
            )

            # Keep only last 100 entries
            history = history[-100:]

            # Save
            with open(self.chat_history_file, "w", encoding="utf-8") as f:
                json.dump(history, f, indent=2, ensure_ascii=False)

        except Exception as e:
            print(f"⚠️ Failed to save chat history: {e}")

    def get_chat_history(self, limit: int = 50) -> List[Dict]:
        """Get chat history"""
        try:
            if self.chat_history_file.exists():
                with open(self.chat_history_file, "r", encoding="utf-8") as f:
                    history = json.load(f)
                return history[-limit:]
            return []
        except Exception as e:
            print(f"⚠️ Failed to load chat history: {e}")
            return []

    def clear_history(self):
        """Clear chat history"""
        try:
            if self.chat_history_file.exists():
                self.chat_history_file.unlink()
            print("✅ Chat history cleared")
        except Exception as e:
            print(f"⚠️ Failed to clear history: {e}")
