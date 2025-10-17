"""
Settings Manager
Manages app settings
"""

from pathlib import Path
import json
from typing import Dict


class SettingsManager:
    """Manage RAG settings"""

    def __init__(self):
        self.settings_path = Path.home() / ".giggliagents" / "rag_settings.json"
        self.settings_path.parent.mkdir(parents=True, exist_ok=True)

        # Default settings
        self.defaults = {
            "llm_provider": "local",
            "embedding_provider": "local",
            "ollama_model": "llama3",
            "openai_model": "gpt-4",
            "openai_api_key": "",
            "claude_model": "claude-3-sonnet-20240229",
            "claude_api_key": "",
            "chunk_size": 500,
            "chunk_overlap": 50,
            "top_k": 5,
            "temperature": 0.7,
        }

    def get_settings(self) -> Dict:
        """Get current settings"""
        if self.settings_path.exists():
            with open(self.settings_path, "r") as f:
                settings = json.load(f)
                # Merge with defaults (in case new settings added)
                return {**self.defaults, **settings}
        return self.defaults

    def save_settings(self, settings: Dict):
        """Save settings"""
        with open(self.settings_path, "w") as f:
            json.dump(settings, f, indent=2)
        print("✅ Settings saved")
