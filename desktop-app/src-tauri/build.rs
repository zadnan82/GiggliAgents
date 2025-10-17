use std::fs;
use std::path::Path;

fn main() {
    // Tell Cargo to re-run if embedded folder changes
    println!("cargo:rerun-if-changed=embedded");
    
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    let profile = std::env::var("PROFILE").unwrap();
    
    let source = Path::new(&manifest_dir).join("embedded");
    let target = Path::new(&manifest_dir)
        .join("target")
        .join(&profile)
        .join("embedded");
    
    if source.exists() {
        // Remove old target
        if target.exists() {
            let _ = fs::remove_dir_all(&target);
        }
        
        // Copy entire embedded folder
        copy_dir_all(&source, &target).expect("Failed to copy embedded folder");
        
        println!("cargo:warning=Copied embedded/ to {:?}", target);
    }
}

fn copy_dir_all(src: &Path, dst: &Path) -> std::io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());
        
        if ty.is_dir() {
            copy_dir_all(&src_path, &dst_path)?;
        } else {
            fs::copy(&src_path, &dst_path)?;
        }
    }
    Ok(())
}