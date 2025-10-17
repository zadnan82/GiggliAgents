#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use pyo3::prelude::*;
use pyo3::types::PyDict;
use std::sync::Once;
use tauri::State;
use serde_json::Value;

// ============================================
// PYTHON INITIALIZATION (Once per app)
// ============================================

static INIT: Once = Once::new();

fn init_python() {
    INIT.call_once(|| {
        pyo3::prepare_freethreaded_python();
        
        Python::with_gil(|py| {
            // Add embedded directory to Python path
            let sys = py.import("sys").unwrap();
            let path = sys.getattr("path").unwrap();
            
            let embedded_path = std::env::current_dir()
                .unwrap()
                .join("embedded");
            path.call_method1("insert", (0, embedded_path.to_str().unwrap())).unwrap();
            
            // CLEAR MODULE CACHE
            let modules = sys.getattr("modules").unwrap();
            let _ = modules.call_method1("pop", ("embedded.executor",));
            let _ = modules.call_method1("pop", ("embedded",));
            
            println!("✅ Python runtime initialized");
        });
    });
}
// ============================================
// HELPER FUNCTIONS
// ============================================

fn execute_python_command(command: &str, params: Option<Value>) -> Result<String, String> {
    println!("🔵 BACKEND CALLED: command={}", command);
    
    Python::with_gil(|py| {
        // DEBUG: Print Python path
        let sys = py.import("sys").unwrap();
        let path = sys.getattr("path").unwrap();
        println!("🐍 Python sys.path: {:?}", path);
        
        // DEBUG: Try to import and print what happens
        println!("🔍 Attempting to import: agent_runtime.executor");
        
        let runtime = py.import("agent_runtime.executor")
            .map_err(|e| {
                // Print the full Python traceback
                println!("❌ FULL PYTHON ERROR:");
                e.print(py);
                format!("Failed to import executor: {}", e)
            })?;
        
        println!("✅ Imported executor successfully");
        
        let executor_class = runtime.getattr("Executor")
            .map_err(|e| {
                let err = format!("Failed to get Executor class: {}", e);
                println!("❌ CLASS ERROR: {}", err);
                err
            })?;
        
        println!("✅ Got Executor class");
        
        let executor = executor_class.call0()
            .map_err(|e| {
                let err = format!("Failed to create executor: {}", e);
                println!("❌ INSTANTIATION ERROR: {}", err);
                err
            })?;
        
        println!("✅ Created executor instance");
        
        let params_str = match params {
            Some(p) => p.to_string(),
            None => "{}".to_string()
        };
        
        let result = executor.call_method1("execute", (command, params_str))
            .map_err(|e| {
                let err = format!("Python execution error: {}", e);
                println!("❌ EXECUTION ERROR: {}", err);
                err
            })?;
        
        println!("✅ Executed command successfully");
        
        let json_module = py.import("json")
            .map_err(|e| format!("Failed to import json: {}", e))?;
        
        let json_str: String = json_module
            .getattr("dumps")
            .and_then(|dumps| dumps.call1((result,)))
            .and_then(|s| s.extract())
            .map_err(|e| {
                let err = format!("JSON conversion error: {}", e);
                println!("❌ JSON ERROR: {}", err);
                err
            })?;
        
        println!("✅ Result: {}", json_str);
        
        Ok(json_str)
    })
}

// ============================================
// LICENSE COMMANDS
// ============================================

#[tauri::command]
fn get_license_info() -> Result<String, String> {
    // TODO: Implement real license check
    Ok(r#"{"valid": true, "email": "user@example.com", "tier": "pro"}"#.to_string())
}

#[tauri::command]
fn remove_license() -> Result<(), String> {
    // TODO: Implement license removal
    Ok(())
}

// ============================================
// DOCUMENT MANAGEMENT
// ============================================

#[tauri::command]
async fn upload_document(file_path: String) -> Result<String, String> {
    let params = serde_json::json!({
        "file_path": file_path
    });
    execute_python_command("process_document", Some(params))
}

#[tauri::command]
fn get_documents() -> Result<String, String> {
    execute_python_command("get_all_documents", None)
}

#[tauri::command]
fn delete_document(doc_id: String) -> Result<String, String> {
    let params = serde_json::json!({
        "doc_id": doc_id
    });
    execute_python_command("delete_document", Some(params))
}

#[tauri::command]
fn get_document_stats() -> Result<String, String> {
    execute_python_command("get_document_stats", None)
}

// ============================================
// CHAT / QUERY
// ============================================

#[tauri::command]
async fn ask_question(question: String) -> Result<String, String> {
    let params = serde_json::json!({
        "question": question
    });
    execute_python_command("answer_question", Some(params))
}

#[tauri::command]
fn get_chat_history(limit: Option<i32>) -> Result<String, String> {
    let params = serde_json::json!({
        "limit": limit.unwrap_or(50)
    });
    execute_python_command("get_chat_history", Some(params))
}

#[tauri::command]
fn clear_chat_history() -> Result<String, String> {
    execute_python_command("clear_chat_history", None)
}

// ============================================
// SETTINGS
// ============================================

#[tauri::command]
fn get_ai_settings() -> Result<String, String> {
    execute_python_command("get_ai_settings", None)
}

#[tauri::command]
fn save_ai_settings(settings: String) -> Result<String, String> {
    let params = serde_json::json!({
        "settings": settings
    });
    execute_python_command("save_ai_settings", Some(params))
}

#[tauri::command]
fn check_ollama_installed() -> Result<String, String> {
    execute_python_command("check_ollama_installed", None)
}

#[tauri::command]
fn get_ollama_models() -> Result<String, String> {
    execute_python_command("get_ollama_models", None)
}

#[tauri::command]
async fn install_ollama_model(model_name: String) -> Result<String, String> {
    let params = serde_json::json!({
        "model_name": model_name
    });
    execute_python_command("install_ollama_model", Some(params))
}

// ============================================
// VECTOR STORE
// ============================================

#[tauri::command]
fn get_vector_stats() -> Result<String, String> {
    execute_python_command("get_vector_stats", None)
}

#[tauri::command]
fn reset_vector_store() -> Result<String, String> {
    execute_python_command("reset_vector_store", None)
}

// ============================================
// MAIN
// ============================================

fn main() {
    // Initialize Python once
    init_python();
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // License
            get_license_info,
            remove_license,
            
            // Documents
            upload_document,
            get_documents,
            delete_document,
            get_document_stats,
            
            // Chat
            ask_question,
            get_chat_history,
            clear_chat_history,
            
            // Settings
            get_ai_settings,
            save_ai_settings,
            check_ollama_installed,
            get_ollama_models,
            install_ollama_model,
            
            // Vector Store
            get_vector_stats,
            reset_vector_store,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}