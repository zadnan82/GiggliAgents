## **📋 COMPLETE MEETING ASSISTANT BUILD SPECIFICATION**

**Version:** 1.0  
**Last Updated:** 2025-01-18  
**Purpose:** This document serves as a complete specification and prompt for building the AI Meeting Assistant desktop application.

---

# **AI MEETING ASSISTANT - COMPLETE BUILD SPECIFICATION**

## **TABLE OF CONTENTS**

1. [Project Overview](#1-project-overview)
2. [Architecture & Tech Stack](#2-architecture--tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Backend Implementation (Python)](#5-backend-implementation-python)
6. [Frontend Implementation (React)](#6-frontend-implementation-react)
7. [Tauri Integration (Rust)](#7-tauri-integration-rust)
8. [License System Integration](#8-license-system-integration)
9. [Build & Deployment](#9-build--deployment)
10. [Testing Requirements](#10-testing-requirements)
11. [Feature Specifications](#11-feature-specifications)

---

## **1. PROJECT OVERVIEW**

### **1.1 What is AI Meeting Assistant?**

AI Meeting Assistant is a **desktop application** that records meetings, transcribes them using AI, and automatically generates summaries, action items, decisions, and quotes. All processing happens **locally on the user's computer** for complete privacy.

### **1.2 Core Value Proposition**

- **Privacy-First:** All data stored locally, never touches cloud servers (except OpenAI API for transcription/summarization)
- **Time-Saving:** Auto-generates meeting notes, eliminating manual note-taking
- **Searchable Archive:** Find any meeting instantly using full-text or semantic search
- **AI-Powered Analysis:** Extracts action items, decisions, and quotes automatically

### **1.3 Target Users**

- Lawyers (need transcript records, privacy critical)
- Doctors (patient consultations, HIPAA compliance)
- Consultants (client meeting records)
- Sales teams (call analysis)
- Product managers (meeting documentation)
- Anyone in frequent meetings

### **1.4 Key Features**

**Recording:**
- Record audio from microphone or system audio
- Real-time transcription during meeting
- Speaker identification
- Audio waveform visualization

**AI Processing:**
- Transcription using OpenAI Whisper
- Executive summary generation using GPT-4
- Action item extraction
- Key decision extraction
- Notable quote extraction
- Auto-tagging by topic

**Search & Archive:**
- Full-text search across all meetings
- Semantic search (find by meaning, not just keywords)
- Filter by date, speaker, tags
- Calendar view of meetings

**Export:**
- PDF summary export
- Email meeting summaries
- Markdown export
- CSV export of action items

### **1.5 Pricing Tiers**

- **Free:** 5 meetings max, basic features
- **Personal Monthly:** $15/month - Unlimited meetings
- **Personal Annual:** $49/year - Unlimited meetings
- **Business:** $299/year - 10 users, team features

---

## **2. ARCHITECTURE & TECH STACK**

### **2.1 Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    DESKTOP APPLICATION                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          React Frontend (UI Layer)                   │   │
│  │  - Dashboard, Recording, Archive, Search, Settings   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Tauri (Rust) - IPC Bridge                   │   │
│  │  - Commands, Audio Capture, File System             │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Python Backend (Business Logic)             │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  Prefabs (Modular Components):              │   │   │
│  │  │  - audio_recorder (PyAudio)                 │   │   │
│  │  │  - transcriber (Whisper API)                │   │   │
│  │  │  - ai_processor (GPT-4)                     │   │   │
│  │  │  - meeting_store (SQLite + ChromaDB)       │   │   │
│  │  │  - search_engine (FTS + Vector)            │   │   │
│  │  │  - export_manager (PDF, Email)             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │    Local Storage (~/.giggliagents/meetings/)        │   │
│  │    - meetings.db (SQLite)                           │   │
│  │    - vectors/ (ChromaDB)                            │   │
│  │    - audio/ (WAV files)                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│              External APIs (Cloud Services)                  │
│  - OpenAI Whisper API (Transcription)                       │
│  - OpenAI GPT-4 API (Summarization & Analysis)              │
│  - License Server (Validation)                              │
└─────────────────────────────────────────────────────────────┘
```

### **2.2 Tech Stack**

**Frontend:**
- React 18+ (UI framework)
- Vite (Build tool)
- TailwindCSS (Styling)
- React Router (Navigation)

**Backend:**
- Python 3.11+ (Core logic)
- PyAudio (Audio recording)
- OpenAI Python SDK (Whisper + GPT-4)
- SQLAlchemy (ORM)
- SQLite (Database)
- ChromaDB (Vector database for semantic search)
- ReportLab (PDF generation)

**Desktop Framework:**
- Tauri 1.5+ (Rust-based desktop framework)
- Rust 1.70+ (System layer)

**Development Tools:**
- Node.js 18+ (Frontend development)
- npm/pnpm (Package management)
- Git (Version control)

---

## **3. PROJECT STRUCTURE**

### **3.1 Complete Directory Structure**

```
meeting-assistant-desktop/
│
├── 📁 src/                                    # React Frontend
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   │
│   │   ├── 📁 recording/
│   │   │   ├── RecordingControls.jsx         # Start/Stop/Pause buttons
│   │   │   ├── LiveTranscription.jsx         # Real-time transcript display
│   │   │   ├── AudioVisualizer.jsx           # Waveform animation
│   │   │   ├── SpeakerIndicator.jsx          # Current speaker display
│   │   │   └── RecordingTimer.jsx            # Duration counter
│   │   │
│   │   ├── 📁 meeting/
│   │   │   ├── MeetingCard.jsx               # Meeting list item
│   │   │   ├── MeetingSummary.jsx            # AI-generated summary
│   │   │   ├── ActionItemsList.jsx           # Tasks with checkboxes
│   │   │   ├── DecisionsList.jsx             # Key decisions
│   │   │   ├── QuotesList.jsx                # Notable quotes
│   │   │   └── TranscriptView.jsx            # Full transcript
│   │   │
│   │   ├── 📁 search/
│   │   │   ├── SearchBar.jsx                 # Search input
│   │   │   ├── SearchFilters.jsx             # Date, speaker filters
│   │   │   └── SearchResults.jsx             # Results list
│   │   │
│   │   ├── 📁 player/
│   │   │   ├── AudioPlayer.jsx               # Playback controls
│   │   │   └── TranscriptSync.jsx            # Sync audio with transcript
│   │   │
│   │   ├── 📁 export/
│   │   │   ├── ExportModal.jsx               # Export options
│   │   │   └── EmailForm.jsx                 # Email summary form
│   │   │
│   │   └── Toast.jsx                         # Notifications
│   │
│   ├── 📁 pages/
│   │   ├── Dashboard.jsx                     # Main landing page
│   │   ├── RecordMeeting.jsx                 # Recording interface
│   │   ├── MeetingDetail.jsx                 # Single meeting view
│   │   ├── Archive.jsx                       # All meetings list
│   │   ├── SearchPage.jsx                    # Search interface
│   │   ├── Settings.jsx                      # Settings page
│   │   ├── Analytics.jsx                     # Meeting stats
│   │   └── LicenseActivation.jsx             # License entry
│   │
│   ├── App.jsx                               # Main app component
│   └── main.jsx                              # Entry point
│
├── 📁 src-tauri/                              # Tauri Backend
│   │
│   ├── 📁 src/
│   │   ├── main.rs                           # Main Rust file
│   │   ├── commands.rs                       # Tauri commands
│   │   └── lib.rs                            # Library exports
│   │
│   ├── 📁 embedded/                           # Python Backend
│   │   │
│   │   ├── agent.g                           # Workflow definitions (DSL)
│   │   ├── main.py                           # Python entry point
│   │   │
│   │   ├── 📁 prefabs/
│   │   │   │
│   │   │   ├── 📁 audio_recorder/
│   │   │   │   ├── audio_recorder.g          # Module spec
│   │   │   │   ├── audio_recorder.py         # Implementation
│   │   │   │   └── __init__.py
│   │   │   │
│   │   │   ├── 📁 transcriber/
│   │   │   │   ├── transcriber.g
│   │   │   │   ├── transcriber.py
│   │   │   │   └── __init__.py
│   │   │   │
│   │   │   ├── 📁 ai_processor/
│   │   │   │   ├── ai_processor.g
│   │   │   │   ├── ai_processor.py
│   │   │   │   └── __init__.py
│   │   │   │
│   │   │   ├── 📁 meeting_store/
│   │   │   │   ├── meeting_store.g
│   │   │   │   ├── meeting_store.py
│   │   │   │   ├── database.py               # SQLite setup
│   │   │   │   ├── models.py                 # SQLAlchemy models
│   │   │   │   └── __init__.py
│   │   │   │
│   │   │   ├── 📁 search_engine/
│   │   │   │   ├── search_engine.g
│   │   │   │   ├── search_engine.py
│   │   │   │   └── __init__.py
│   │   │   │
│   │   │   └── 📁 export_manager/
│   │   │       ├── export_manager.g
│   │   │       ├── export_manager.py
│   │   │       └── __init__.py
│   │   │
│   │   ├── 📁 agent_runtime/
│   │   │   ├── __init__.py
│   │   │   ├── executor.py                   # Command executor
│   │   │   └── workflow_engine.py            # Workflow orchestrator
│   │   │
│   │   ├── 📁 license/
│   │   │   ├── __init__.py
│   │   │   └── license_manager.py            # License validation
│   │   │
│   │   └── 📁 utils/
│   │       ├── __init__.py
│   │       ├── config.py                     # Configuration
│   │       └── logger.py                     # Logging setup
│   │
│   ├── tauri.conf.json                        # Tauri configuration
│   ├── Cargo.toml                             # Rust dependencies
│   ├── build.rs                               # Build script
│   └── 📁 icons/                              # App icons
│
├── 📁 database/
│   ├── schema.sql                             # Database schema
│   └── 📁 migrations/
│       ├── 001_initial.sql
│       └── 002_add_speakers.sql
│
├── package.json                               # Node dependencies
├── vite.config.js                             # Vite configuration
├── tailwind.config.js                         # Tailwind configuration
├── requirements.txt                           # Python dependencies
├── README.md                                  # Documentation
└── .gitignore
```

### **3.2 Key Files Explained**

**`agent.g`** - Workflow definitions using DSL (documentation/spec)
**`main.py`** - Python entry point, initializes all prefabs
**`executor.py`** - Receives commands from Tauri, routes to prefabs
**`workflow_engine.py`** - Executes workflows defined in agent.g
**Prefabs** - Self-contained modules (audio, transcription, AI, storage, search, export)

---

## **4. DATABASE SCHEMA**

### **4.1 SQLite Schema**

**Location:** `~/.giggliagents/meetings/meetings.db`

```sql
-- Meetings table
CREATE TABLE meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,  -- ISO 8601 format
    duration INTEGER,    -- seconds
    audio_file_path TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Transcripts table (stores transcript segments)
CREATE TABLE transcripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id INTEGER NOT NULL,
    speaker TEXT,        -- Speaker name/ID
    text TEXT NOT NULL,  -- Transcript text
    start_time REAL,     -- seconds from meeting start
    end_time REAL,       -- seconds from meeting start
    confidence REAL,     -- 0-1 confidence score
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
);

-- Summaries table (AI-generated summaries)
CREATE TABLE summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id INTEGER NOT NULL UNIQUE,
    executive_summary TEXT,      -- Short summary
    key_points TEXT,             -- JSON array of key points
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
);

-- Action items table
CREATE TABLE action_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    assignee TEXT,               -- Person responsible
    due_date TEXT,               -- ISO 8601 format
    completed BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
);

-- Decisions table
CREATE TABLE decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id INTEGER NOT NULL,
    decision TEXT NOT NULL,
    timestamp REAL,              -- time in meeting when decided
    context TEXT,                -- surrounding context
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
);

-- Quotes table
CREATE TABLE quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id INTEGER NOT NULL,
    speaker TEXT NOT NULL,
    quote TEXT NOT NULL,
    timestamp REAL,              -- time in meeting
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Meeting-Tag junction table
CREATE TABLE meeting_tags (
    meeting_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (meeting_id, tag_id),
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Speakers table (stores speaker profiles)
CREATE TABLE speakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    voice_profile BLOB           -- Future: voice fingerprint for identification
);

-- Embeddings table (for semantic search)
CREATE TABLE embeddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,    -- Text chunk
    embedding BLOB NOT NULL,      -- Vector embedding (binary)
    FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE
);

-- Full-text search virtual table (SQLite FTS5)
CREATE VIRTUAL TABLE transcripts_fts USING fts5(
    meeting_id UNINDEXED,
    speaker,
    text,
    content=transcripts,
    content_rowid=id
);

-- Triggers to keep FTS in sync
CREATE TRIGGER transcripts_ai AFTER INSERT ON transcripts BEGIN
    INSERT INTO transcripts_fts(rowid, meeting_id, speaker, text)
    VALUES (new.id, new.meeting_id, new.speaker, new.text);
END;

CREATE TRIGGER transcripts_ad AFTER DELETE ON transcripts BEGIN
    DELETE FROM transcripts_fts WHERE rowid = old.id;
END;

CREATE TRIGGER transcripts_au AFTER UPDATE ON transcripts BEGIN
    UPDATE transcripts_fts 
    SET speaker = new.speaker, text = new.text
    WHERE rowid = new.id;
END;

-- Indexes for performance
CREATE INDEX idx_meetings_date ON meetings(date);
CREATE INDEX idx_transcripts_meeting ON transcripts(meeting_id);
CREATE INDEX idx_action_items_meeting ON action_items(meeting_id);
CREATE INDEX idx_decisions_meeting ON decisions(meeting_id);
CREATE INDEX idx_quotes_meeting ON quotes(meeting_id);
```

### **4.2 ChromaDB Collection**

**Location:** `~/.giggliagents/meetings/vectors/`

**Collection name:** `meeting_embeddings`

**Purpose:** Store vector embeddings for semantic search

**Schema:**
- `id`: Unique chunk ID
- `document`: Text chunk
- `embedding`: Vector (1536 dimensions for OpenAI)
- `metadata`: `{meeting_id, speaker, timestamp}`

---

## **5. BACKEND IMPLEMENTATION (PYTHON)**

### **5.1 Entry Point - `main.py`**

```python
"""
Main Python entry point for Meeting Assistant
Initializes all prefabs and handles commands from Tauri
"""

import sys
import json
from pathlib import Path

# Add prefabs to path
sys.path.insert(0, str(Path(__file__).parent))

from agent_runtime.executor import Executor

def main():
    """Initialize and run the Python backend"""
    
    # Initialize executor (handles all commands)
    executor = Executor()
    
    # Read command from stdin (sent by Tauri)
    if len(sys.argv) > 1:
        command = sys.argv[1]
        params = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        
        # Execute command
        result = executor.execute(command, params)
        
        # Return result as JSON
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No command provided"}))

if __name__ == "__main__":
    main()
```

### **5.2 Command Executor - `agent_runtime/executor.py`**

```python
"""
Command executor - routes commands to appropriate prefabs
"""

from typing import Dict, Any
from pathlib import Path

# Import all prefabs
from prefabs.audio_recorder.audio_recorder import AudioRecorder
from prefabs.transcriber.transcriber import Transcriber
from prefabs.ai_processor.ai_processor import AIProcessor
from prefabs.meeting_store.meeting_store import MeetingStore
from prefabs.search_engine.search_engine import SearchEngine
from prefabs.export_manager.export_manager import ExportManager
from license.license_manager import LicenseManager

class Executor:
    """Executes commands by routing to prefabs"""
    
    def __init__(self):
        """Initialize all prefabs"""
        
        # Initialize license manager
        self.license_manager = LicenseManager(
            product_id="meeting_assistant",
            app_name="Meeting Assistant"
        )
        
        # Initialize prefabs
        self.audio_recorder = AudioRecorder()
        self.transcriber = Transcriber()
        self.ai_processor = AIProcessor()
        self.meeting_store = MeetingStore()
        self.search_engine = SearchEngine()
        self.export_manager = ExportManager()
        
        print("✅ All prefabs initialized")
    
    def execute(self, command: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute a command
        
        Args:
            command: Command name (e.g., "start_recording")
            params: Command parameters
            
        Returns:
            Result dictionary
        """
        
        try:
            # Route to appropriate handler
            if command == "start_recording":
                return self._handle_start_recording(params)
            
            elif command == "stop_recording":
                return self._handle_stop_recording(params)
            
            elif command == "transcribe_meeting":
                return self._handle_transcribe_meeting(params)
            
            elif command == "analyze_meeting":
                return self._handle_analyze_meeting(params)
            
            elif command == "search_meetings":
                return self._handle_search_meetings(params)
            
            elif command == "get_meeting":
                return self._handle_get_meeting(params)
            
            elif command == "list_meetings":
                return self._handle_list_meetings(params)
            
            elif command == "delete_meeting":
                return self._handle_delete_meeting(params)
            
            elif command == "export_meeting":
                return self._handle_export_meeting(params)
            
            elif command == "activate_license":
                return self._handle_activate_license(params)
            
            elif command == "validate_license":
                return self._handle_validate_license(params)
            
            else:
                return {"error": f"Unknown command: {command}"}
                
        except Exception as e:
            print(f"❌ Error executing {command}: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e)}
    
    # Handler methods (one for each command)
    
    def _handle_start_recording(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Start recording audio"""
        device = params.get("device", "default")
        recording_id = self.audio_recorder.start_recording(device=device)
        return {"recording_id": recording_id, "status": "recording"}
    
    def _handle_stop_recording(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Stop recording and save audio"""
        recording_id = params.get("recording_id")
        result = self.audio_recorder.stop_recording(recording_id)
        
        # Create meeting record
        meeting_id = self.meeting_store.create_meeting(
            title=params.get("title", "Untitled Meeting"),
            audio_file_path=result["audio_file_path"],
            duration=result["duration"]
        )
        
        return {
            "meeting_id": meeting_id,
            "audio_file_path": result["audio_file_path"],
            "duration": result["duration"]
        }
    
    def _handle_transcribe_meeting(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Transcribe meeting audio"""
        meeting_id = params.get("meeting_id")
        
        # Get meeting
        meeting = self.meeting_store.get_meeting(meeting_id)
        
        # Transcribe
        transcript = self.transcriber.transcribe(
            audio_file_path=meeting["audio_file_path"]
        )
        
        # Identify speakers
        speakers = self.transcriber.diarize_speakers(
            audio_file_path=meeting["audio_file_path"],
            transcript_segments=transcript["segments"]
        )
        
        # Save transcript
        self.meeting_store.save_transcript(
            meeting_id=meeting_id,
            segments=transcript["segments"],
            speakers=speakers
        )
        
        return {
            "success": True,
            "transcript": transcript["text"],
            "segments_count": len(transcript["segments"])
        }
    
    def _handle_analyze_meeting(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze meeting with AI"""
        meeting_id = params.get("meeting_id")
        
        # Get meeting with transcript
        meeting = self.meeting_store.get_meeting(meeting_id)
        transcript = meeting["transcript"]
        
        # Generate summary
        summary = self.ai_processor.summarize(transcript)
        
        # Extract action items
        action_items = self.ai_processor.extract_action_items(transcript)
        
        # Extract decisions
        decisions = self.ai_processor.extract_decisions(transcript)
        
        # Extract quotes
        quotes = self.ai_processor.extract_quotes(
            transcript=transcript,
            speakers=meeting["speakers"]
        )
        
        # Generate tags
        tags = self.ai_processor.tag_meeting(
            transcript=transcript,
            summary=summary["summary"]
        )
        
        # Save analysis
        self.meeting_store.save_analysis(
            meeting_id=meeting_id,
            summary=summary["summary"],
            key_points=summary["key_points"],
            action_items=action_items,
            decisions=decisions,
            quotes=quotes,
            tags=tags
        )
        
        return {
            "success": True,
            "summary": summary,
            "action_items": action_items,
            "decisions": decisions,
            "quotes": quotes,
            "tags": tags
        }
    
    def _handle_search_meetings(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Search meetings"""
        query = params.get("query", "")
        
        # Full-text search
        fts_results = self.search_engine.full_text_search(
            query=query,
            limit=params.get("limit", 10)
        )
        
        # Semantic search
        semantic_results = self.search_engine.semantic_search(
            query=query,
            top_k=params.get("top_k", 5)
        )
        
        # Merge results
        merged = self.search_engine.merge_results(
            fts_results=fts_results,
            semantic_results=semantic_results
        )
        
        return {"results": merged}
    
    def _handle_get_meeting(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Get meeting by ID"""
        meeting_id = params.get("meeting_id")
        meeting = self.meeting_store.get_meeting(meeting_id)
        return meeting
    
    def _handle_list_meetings(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """List all meetings"""
        meetings = self.meeting_store.list_meetings(
            limit=params.get("limit", 50),
            offset=params.get("offset", 0),
            filters=params.get("filters", {})
        )
        return meetings
    
    def _handle_delete_meeting(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Delete meeting"""
        meeting_id = params.get("meeting_id")
        success = self.meeting_store.delete_meeting(meeting_id)
        return {"success": success}
    
    def _handle_export_meeting(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Export meeting"""
        meeting_id = params.get("meeting_id")
        format_type = params.get("format", "pdf")
        
        file_path = self.export_manager.export(
            meeting_id=meeting_id,
            format=format_type,
            include_transcript=params.get("include_transcript", True)
        )
        
        return {"file_path": file_path}
    
    def _handle_activate_license(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Activate license"""
        license_key = params.get("license_key")
        email = params.get("email")
        return self.license_manager.activate(license_key, email)
    
    def _handle_validate_license(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Validate license"""
        return self.license_manager.validate()
```

### **5.3 Prefab Implementations**

Each prefab follows this structure:

```python
# prefabs/audio_recorder/audio_recorder.py

class AudioRecorder:
    """Records audio from microphone or system audio"""
    
    def __init__(self):
        """Initialize audio recorder"""
        self.recordings = {}  # Active recordings
        # Initialize PyAudio, etc.
    
    def start_recording(self, device: str = "default") -> str:
        """Start recording audio"""
        # Implementation here
        pass
    
    def stop_recording(self, recording_id: str) -> dict:
        """Stop recording and save audio"""
        # Implementation here
        pass
    
    # ... other methods
```

**IMPORTANT:** Each prefab should be **self-contained** and follow the interface defined in its `.g` file.

---

## **6. FRONTEND IMPLEMENTATION (REACT)**

### **6.1 Main App Structure - `src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

// Pages
import Dashboard from './pages/Dashboard';
import RecordMeeting from './pages/RecordMeeting';
import MeetingDetail from './pages/MeetingDetail';
import Archive from './pages/Archive';
import SearchPage from './pages/SearchPage';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import LicenseActivation from './pages/LicenseActivation';

// Components
import Sidebar from './components/layout/Sidebar';

function App() {
  const [isLicensed, setIsLicensed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = async () => {
    try {
      const result = await invoke('validate_license');
      const data = JSON.parse(result);
      setIsLicensed(data.valid);
    } catch (error) {
      console.error('License check failed:', error);
      setIsLicensed(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLicensed) {
    return <LicenseActivation onActivated={() => setIsLicensed(true)} />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/record" element={<RecordMeeting />} />
            <Route path="/meeting/:id" element={<MeetingDetail />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### **6.2 Key Pages**

**Dashboard (`src/pages/Dashboard.jsx`):**
- Shows quick stats (total meetings, this week, action items)
- Recent meetings list
- Quick actions (Record new meeting, Search)

**RecordMeeting (`src/pages/RecordMeeting.jsx`):**
- Recording controls (Start/Stop/Pause)
- Live transcription display
- Audio waveform visualization
- Speaker indicator

**MeetingDetail (`src/pages/MeetingDetail.jsx`):**
- Executive summary
- Action items (with checkboxes)
- Key decisions
- Notable quotes
- Full transcript
- Audio player synced with transcript
- Export options

**Archive (`src/pages/Archive.jsx`):**
- List of all meetings
- Calendar view
- Filters (date, tags, speaker)
- Sort options

**SearchPage (`src/pages/SearchPage.jsx`):**
- Search input
- Filters
- Results list with highlights

### **6.3 Component Communication Pattern**

All backend communication goes through Tauri's `invoke`:

```jsx
import { invoke } from '@tauri-apps/api/tauri';

// Example: Start recording
const startRecording = async () => {
  try {
    const result = await invoke('start_recording', {
      device: 'default'
    });
    const data = JSON.parse(result);
    console.log('Recording started:', data);
  } catch (error) {
    console.error('Failed to start recording:', error);
  }
};
```

---

## **7. TAURI INTEGRATION (RUST)**

### **7.1 Main Rust File - `src-tauri/src/main.rs`**

```rust
// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;

// Execute Python command
fn execute_python_command(command: &str, params: Option<serde_json::Value>) -> Result<String, String> {
    let params_str = match params {
        Some(p) => serde_json::to_string(&p).unwrap(),
        None => "{}".to_string(),
    };

    let output = Command::new("python")
        .arg("embedded/main.py")
        .arg(command)
        .arg(params_str)
        .output()
        .map_err(|e| format!("Failed to execute Python: {}", e))?;

    if output.status.success() {
        let result = String::from_utf8_lossy(&output.stdout).to_string();
        Ok(result)
    } else {
        let error = String::from_utf8_lossy(&output.stderr).to_string();
        Err(format!("Python error: {}", error))
    }
}

// Tauri commands

#[tauri::command]
fn start_recording(device: String) -> Result<String, String> {
    let params = serde_json::json!({ "device": device });
    execute_python_command("start_recording", Some(params))
}

#[tauri::command]
fn stop_recording(recording_id: String, title: String) -> Result<String, String> {
    let params = serde_json::json!({
        "recording_id": recording_id,
        "title": title
    });
    execute_python_command("stop_recording", Some(params))
}

#[tauri::command]
fn transcribe_meeting(meeting_id: i64) -> Result<String, String> {
    let params = serde_json::json!({ "meeting_id": meeting_id });
    execute_python_command("transcribe_meeting", Some(params))
}

#[tauri::command]
fn analyze_meeting(meeting_id: i64) -> Result<String, String> {
    let params = serde_json::json!({ "meeting_id": meeting_id });
    execute_python_command("analyze_meeting", Some(params))
}

#[tauri::command]
fn search_meetings(query: String, limit: i32) -> Result<String, String> {
    let params = serde_json::json!({
        "query": query,
        "limit": limit
    });
    execute_python_command("search_meetings", Some(params))
}

#[tauri::command]
fn get_meeting(meeting_id: i64) -> Result<String, String> {
    let params = serde_json::json!({ "meeting_id": meeting_id });
    execute_python_command("get_meeting", Some(params))
}

#[tauri::command]
fn list_meetings(limit: i32, offset: i32) -> Result<String, String> {
    let params = serde_json::json!({
        "limit": limit,
        "offset": offset
    });
    execute_python_command("list_meetings", Some(params))
}

#[tauri::command]
fn delete_meeting(meeting_id: i64) -> Result<String, String> {
    let params = serde_json::json!({ "meeting_id": meeting_id });
    execute_python_command("delete_meeting", Some(params))
}

#[tauri::command]
fn export_meeting(meeting_id: i64, format: String) -> Result<String, String> {
    let params = serde_json::json!({
        "meeting_id": meeting_id,
        "format": format
    });
    execute_python_command("export_meeting", Some(params))
}

#[tauri::command]
fn activate_license(license_key: String, email: String) -> Result<String, String> {
    let params = serde_json::json!({
        "license_key": license_key,
        "email": email
    });
    execute_python_command("activate_license", Some(params))
}

#[tauri::command]
fn validate_license() -> Result<String, String> {
    execute_python_command("validate_license", None)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_recording,
            stop_recording,
            transcribe_meeting,
            analyze_meeting,
            search_meetings,
            get_meeting,
            list_meetings,
            delete_meeting,
            export_meeting,
            activate_license,
            validate_license,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### **7.2 Tauri Configuration - `src-tauri/tauri.conf.json`**

```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Meeting Assistant",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "fs": {
        "all": true,
        "scope": ["$HOME/.giggliagents/**"]
      },
      "dialog": {
        "all": true
      }
    },
    "bundle": {
      "active": true,
      "category": "Productivity",
      "copyright": "",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.giggliagents.meeting-assistant",
      "longDescription": "AI-powered meeting recorder and analyzer",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "Meeting Assistant",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 800,
        "resizable": true,
        "title": "Meeting Assistant",
        "width": 1200,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  }
}
```

---

## **8. LICENSE SYSTEM INTEGRATION**

### **8.1 License Manager - `embedded/license/license_manager.py`**

This should be a **symlink** to the shared license manager in the parent project:

```bash
cd src-tauri/embedded/license/
ln -s ../../../../shared-modules/license_manager.py license_manager.py
```

**Usage in Python:**

```python
from license.license_manager import LicenseManager

# Initialize
license_mgr = LicenseManager(
    product_id="meeting_assistant",
    app_name="Meeting Assistant"
)

# Activate
result = license_mgr.activate(license_key="XXXX-XXXX", email="user@example.com")

# Validate
is_valid = license_mgr.validate()

# Get tier
tier = license_mgr.get_tier()  # Returns: "free", "personal_monthly", "personal_annual", "business"

# Check feature access
if license_mgr.get_features().get("realtime_transcription"):
    # Feature enabled
    pass
```

### **8.2 License Tiers & Features**

**Free Tier:**
- 5 meetings max
- Basic features only
- No export
- No real-time transcription

**Personal Monthly ($15/month):**
- Unlimited meetings
- Real-time transcription
- Export to PDF
- Email summaries

**Personal Annual ($49/year):**
- Everything in Monthly
- Save 67% vs monthly
- Priority support

**Business ($299/year):**
- Everything in Annual
- Up to 10 users
- Team sharing
- Admin dashboard
- API access
- Priority support

### **8.3 Feature Checks**

Wrap premium features with license checks:

```python
def start_realtime_transcription(self):
    """Start real-time transcription (premium feature)"""
    
    # Check license
    if not self.license_manager.get_features().get("realtime_transcription"):
        return {
            "error": "Real-time transcription requires Personal or Business plan",
            "upgrade_required": True
        }
    
    # Proceed with feature
    # ...
```

---

## **9. BUILD & DEPLOYMENT**

### **9.1 Development Setup**

```bash
# Clone repository
git clone <repo-url>
cd meeting-assistant-desktop

# Install Node dependencies
npm install

# Install Python dependencies
cd src-tauri/embedded
pip install -r requirements.txt
cd ../..

# Create symlink to shared modules (if applicable)
cd src-tauri/embedded/license
ln -s ../../../../shared-modules/license_manager.py license_manager.py
cd ../../..

# Run in development mode
npm run tauri dev
```

### **9.2 Build for Production**

```bash
# Build desktop app
npm run tauri build

# Output locations:
# Windows: src-tauri/target/release/bundle/msi/
# macOS: src-tauri/target/release/bundle/dmg/
# Linux: src-tauri/target/release/bundle/appimage/
```

### **9.3 Python Dependencies - `requirements.txt`**

```txt
# Core
openai>=1.0.0
sqlalchemy>=2.0.0
chromadb>=0.4.0

# Audio processing
pyaudio>=0.2.13
wave>=0.0.2
numpy>=1.24.0

# PDF generation
reportlab>=4.0.0

# Email sending (optional)
sendgrid>=6.10.0

# Utilities
python-dotenv>=1.0.0
requests>=2.31.0
```

### **9.4 Environment Variables**

Create `.env` file in `src-tauri/embedded/`:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-...

# License Server URL
LICENSE_SERVER_URL=https://api.giggliagents.com

# Optional: Email service
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@giggliagents.com

# Database paths (optional, defaults to ~/.giggliagents)
DATABASE_PATH=~/.giggliagents/meetings/meetings.db
VECTOR_DB_PATH=~/.giggliagents/meetings/vectors
AUDIO_PATH=~/.giggliagents/meetings/audio
```

---

## **10. TESTING REQUIREMENTS**

### **10.1 Unit Tests**

Test each prefab independently:

```python
# tests/test_audio_recorder.py
import pytest
from prefabs.audio_recorder.audio_recorder import AudioRecorder

def test_start_recording():
    recorder = AudioRecorder()
    recording_id = recorder.start_recording()
    assert recording_id is not None
    assert isinstance(recording_id, str)
    
def test_stop_recording():
    recorder = AudioRecorder()
    recording_id = recorder.start_recording()
    result = recorder.stop_recording(recording_id)
    assert result["audio_file_path"] is not None
    assert result["duration"] > 0
```

### **10.2 Integration Tests**

Test complete workflows:

```python
# tests/test_full_workflow.py
def test_complete_meeting_flow():
    """Test: Record → Transcribe → Analyze → Search"""
    
    # 1. Record meeting
    recorder = AudioRecorder()
    recording_id = recorder.start_recording()
    time.sleep(10)  # Record for 10 seconds
    result = recorder.stop_recording(recording_id)
    
    # 2. Transcribe
    transcriber = Transcriber()
    transcript = transcriber.transcribe(result["audio_file_path"])
    assert len(transcript["text"]) > 0
    
    # 3. Analyze
    processor = AIProcessor()
    summary = processor.summarize(transcript["text"])
    assert len(summary["summary"]) > 0
    
    # 4. Search
    search_engine = SearchEngine()
    results = search_engine.full_text_search("meeting")
    assert len(results) > 0
```

### **10.3 E2E Tests**

Use Playwright or similar to test UI:

```javascript
// tests/e2e/meeting_flow.spec.js
test('complete meeting recording flow', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:5173');
  
  // Click record button
  await page.click('[data-testid="record-button"]');
  
  // Wait 5 seconds
  await page.waitForTimeout(5000);
  
  // Stop recording
  await page.click('[data-testid="stop-button"]');
  
  // Check meeting created
  await expect(page.locator('[data-testid="meeting-list"]')).toContainText('Untitled Meeting');
});
```

---

## **11. FEATURE SPECIFICATIONS**

### **11.1 Recording Feature**

**User Flow:**
1. User clicks "Record New Meeting"
2. (Optional) User enters meeting title
3. User clicks "Start Recording"
4. Live transcription appears in real-time
5. User clicks "Stop Recording"
6. Meeting is saved and processing begins

**Technical Requirements:**
- Record audio at 16kHz, mono, WAV format
- Display waveform visualization
- Show recording timer
- Support pause/resume
- Handle microphone permissions

**Edge Cases:**
- No microphone access → Show error with instructions
- Disk space full → Show warning before recording
- Recording too short (< 10 seconds) → Warn user

---

### **11.2 Transcription Feature**

**User Flow:**
1. After recording stops, transcription begins automatically
2. Progress indicator shows status
3. When complete, transcript appears in meeting detail

**Technical Requirements:**
- Use OpenAI Whisper API
- Handle long audio files (split into chunks if > 25MB)
- Identify speakers using diarization
- Store timestamps for each segment

**API Integration:**

```python
import openai

def transcribe(audio_file_path: str) -> dict:
    """Transcribe audio using Whisper"""
    
    with open(audio_file_path, 'rb') as audio_file:
        transcript = openai.Audio.transcribe(
            model="whisper-1",
            file=audio_file,
            response_format="verbose_json"
        )
    
    return {
        "text": transcript.text,
        "segments": transcript.segments,
        "language": transcript.language
    }
```

---

### **11.3 AI Analysis Feature**

**User Flow:**
1. After transcription, AI analysis begins automatically
2. Generates: Summary, Action Items, Decisions, Quotes
3. Results appear in meeting detail page

**Technical Requirements:**

**Summary Generation:**
```python
def summarize(transcript: str) -> dict:
    """Generate executive summary"""
    
    prompt = f"""
    Summarize this meeting transcript in 2-3 sentences.
    Then list 5 key points discussed.
    
    Transcript:
    {transcript}
    
    Format:
    Summary: [2-3 sentence summary]
    
    Key Points:
    1. [Point 1]
    2. [Point 2]
    ...
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    # Parse response
    # ...
```

**Action Item Extraction:**
```python
def extract_action_items(transcript: str) -> list:
    """Extract action items"""
    
    prompt = f"""
    Extract all action items from this meeting transcript.
    For each action item, identify:
    - What needs to be done
    - Who is responsible (if mentioned)
    - When it's due (if mentioned)
    
    Transcript:
    {transcript}
    
    Return as JSON array.
    """
    
    # ...
```

---

### **11.4 Search Feature**

**User Flow:**
1. User enters search query
2. Results show matching meetings with highlights
3. User can filter by date, speaker, tags
4. User clicks result to open meeting

**Technical Requirements:**

**Full-Text Search (SQLite FTS5):**
```python
def full_text_search(query: str, limit: int = 10) -> list:
    """Search using SQLite FTS"""
    
    sql = """
    SELECT 
        m.id,
        m.title,
        m.date,
        snippet(transcripts_fts, -1, '<mark>', '</mark>', '...', 64) as snippet
    FROM transcripts_fts
    JOIN meetings m ON m.id = transcripts_fts.meeting_id
    WHERE transcripts_fts MATCH ?
    ORDER BY rank
    LIMIT ?
    """
    
    results = db.execute(sql, (query, limit)).fetchall()
    return results
```

**Semantic Search (ChromaDB):**
```python
def semantic_search(query: str, top_k: int = 5) -> list:
    """Search using vector similarity"""
    
    # Embed query
    query_embedding = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=query
    )["data"][0]["embedding"]
    
    # Search vector DB
    results = chroma_collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    
    return results
```

---

### **11.5 Export Feature**

**User Flow:**
1. User opens meeting detail
2. User clicks "Export" button
3. User selects format (PDF, Email, Markdown)
4. File is generated and saved/sent

**Technical Requirements:**

**PDF Export:**
```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def export_pdf(meeting: dict, file_path: str):
    """Generate PDF summary"""
    
    doc = SimpleDocTemplate(file_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    story.append(Paragraph(meeting["title"], styles['Title']))
    story.append(Spacer(1, 12))
    
    # Summary
    story.append(Paragraph("Executive Summary", styles['Heading2']))
    story.append(Paragraph(meeting["summary"], styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Action Items
    story.append(Paragraph("Action Items", styles['Heading2']))
    for item in meeting["action_items"]:
        story.append(Paragraph(f"• {item['description']}", styles['Normal']))
    
    # Build PDF
    doc.build(story)
```

---

## **IMPLEMENTATION CHECKLIST**

Use this checklist when building:

### **Phase 1: Core Infrastructure (Week 1)**
- [ ] Set up project structure
- [ ] Initialize Tauri app
- [ ] Create database schema
- [ ] Implement executor pattern
- [ ] Build license system integration

### **Phase 2: Recording & Storage (Week 1-2)**
- [ ] Implement audio_recorder prefab
- [ ] Implement meeting_store prefab
- [ ] Build recording UI
- [ ] Test audio capture on all platforms

### **Phase 3: Transcription (Week 2)**
- [ ] Implement transcriber prefab
- [ ] Integrate Whisper API
- [ ] Add speaker diarization
- [ ] Build transcript UI

### **Phase 4: AI Analysis (Week 2-3)**
- [ ] Implement ai_processor prefab
- [ ] Build summary generation
- [ ] Build action item extraction
- [ ] Build decision/quote extraction
- [ ] Display analysis in UI

### **Phase 5: Search (Week 3)**
- [ ] Implement search_engine prefab
- [ ] Build FTS integration
- [ ] Build vector search
- [ ] Create search UI

### **Phase 6: Export & Polish (Week 3-4)**
- [ ] Implement export_manager prefab
- [ ] Build PDF generation
- [ ] Build email integration
- [ ] Polish all UI components
- [ ] Add error handling
- [ ] Add loading states

### **Phase 7: Testing & Launch (Week 4)**
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test on all platforms
- [ ] Create installer
- [ ] Write documentation
- [ ] Launch!

---

## **DEVELOPMENT TIPS**

1. **Start Simple:** Build MVP with basic recording + transcription first
2. **Test Early:** Test audio capture on target platforms ASAP
3. **Mock AI Calls:** Use mock responses during development to save API costs
4. **Incremental Development:** Build one prefab at a time
5. **Use .g Files as Docs:** Keep .g files updated as you build

---

## **COMMON PITFALLS TO AVOID**

1. **Audio Permissions:** Always handle microphone permission errors gracefully
2. **File Paths:** Use Path objects, handle Windows/Mac/Linux differences
3. **API Costs:** OpenAI Whisper + GPT-4 can get expensive, implement caching
4. **Large Files:** Split long audio files before sending to Whisper
5. **Memory Management:** Clean up audio buffers, don't leak memory
6. **Error Handling:** Every API call can fail, handle gracefully

---

## **ADDITIONAL RESOURCES**

**Documentation:**
- Tauri Docs: https://tauri.app/
- OpenAI API: https://platform.openai.com/docs
- SQLite FTS5: https://www.sqlite.org/fts5.html
- ChromaDB: https://docs.trychroma.com/

**Example Code:**
- PyAudio examples: https://people.csail.mit.edu/hubert/pyaudio/
- Whisper API examples: https://platform.openai.com/docs/guides/speech-to-text

---

## **END OF SPECIFICATION**

This document provides everything needed to build the AI Meeting Assistant. When starting a new conversation with Claude, provide this entire document as context and Claude will have all the information needed to help build the application.

**Version:** 1.0  
**Last Updated:** 2025-01-18  
**Status:** Ready for Implementation
