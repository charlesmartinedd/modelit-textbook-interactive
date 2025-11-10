"""
Deploy Connected Textbook to GitHub Pages

This script prepares and deploys the interactive textbook to GitHub Pages.
"""

import os
import subprocess
from pathlib import Path
import shutil

BASE_DIR = Path(__file__).parent.parent
DEPLOY_DIR = BASE_DIR / "gh-pages-build"

def run_command(command, cwd=None):
    """Run a shell command and return output"""
    print(f"Running: {command}")
    result = subprocess.run(
        command,
        shell=True,
        cwd=cwd or BASE_DIR,
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        print(f"[ERROR] Command failed: {result.stderr}")
        return False
    print(f"[SUCCESS] {result.stdout.strip()}")
    return True

def prepare_deployment():
    """Prepare files for deployment"""
    print("\n" + "="*80)
    print("PREPARING DEPLOYMENT")
    print("="*80 + "\n")

    # Create clean deployment directory
    if DEPLOY_DIR.exists():
        print("Removing old deployment directory...")
        shutil.rmtree(DEPLOY_DIR)

    DEPLOY_DIR.mkdir(exist_ok=True)
    print(f"Created deployment directory: {DEPLOY_DIR}")

    # Copy files
    print("\nCopying files...")

    files_to_copy = [
        ("index.html", "index.html"),
        ("css", "css"),
        ("js", "js"),
        ("assets", "assets"),
        ("chapters", "chapters"),
    ]

    for src, dest in files_to_copy:
        src_path = BASE_DIR / src
        dest_path = DEPLOY_DIR / dest

        if not src_path.exists():
            print(f"[SKIP] {src} does not exist")
            continue

        if src_path.is_dir():
            shutil.copytree(src_path, dest_path)
            print(f"[SUCCESS] Copied directory: {src}")
        else:
            shutil.copy2(src_path, dest_path)
            print(f"[SUCCESS] Copied file: {src}")

    # Create .nojekyll file (required for GitHub Pages)
    nojekyll = DEPLOY_DIR / ".nojekyll"
    nojekyll.touch()
    print("[SUCCESS] Created .nojekyll file")

    # Create CNAME file (if custom domain)
    # cname = DEPLOY_DIR / "CNAME"
    # cname.write_text("connected.modelitk12.com")
    # print("[SUCCESS] Created CNAME file")

    print("\n[SUCCESS] Deployment preparation complete!")

def deploy_to_github():
    """Deploy to GitHub Pages"""
    print("\n" + "="*80)
    print("DEPLOYING TO GITHUB PAGES")
    print("="*80 + "\n")

    # Check git status
    print("Checking git status...")
    if not run_command("git status"):
        print("[ERROR] Not a git repository")
        return False

    # Check if gh-pages branch exists
    print("\nChecking for gh-pages branch...")
    result = subprocess.run(
        "git branch --list gh-pages",
        shell=True,
        cwd=BASE_DIR,
        capture_output=True,
        text=True
    )

    if "gh-pages" not in result.stdout:
        print("[INFO] Creating gh-pages branch...")
        if not run_command("git checkout --orphan gh-pages"):
            return False
        if not run_command("git rm -rf ."):
            return False
    else:
        print("[INFO] Switching to gh-pages branch...")
        if not run_command("git checkout gh-pages"):
            return False

    # Copy deployment files
    print("\nCopying deployment files to gh-pages branch...")
    for item in DEPLOY_DIR.iterdir():
        if item.name != ".git":
            dest = BASE_DIR / item.name
            if dest.exists():
                if dest.is_dir():
                    shutil.rmtree(dest)
                else:
                    dest.unlink()

            if item.is_dir():
                shutil.copytree(item, dest)
            else:
                shutil.copy2(item, dest)

    # Add and commit
    print("\nCommitting changes...")
    if not run_command("git add ."):
        return False

    commit_message = "Deploy: Update Connected Textbook"
    if not run_command(f'git commit -m "{commit_message}"'):
        print("[INFO] No changes to commit")

    # Push to GitHub
    print("\nPushing to GitHub...")
    if not run_command("git push origin gh-pages"):
        return False

    # Switch back to main
    print("\nSwitching back to main branch...")
    if not run_command("git checkout main"):
        return False

    print("\n[SUCCESS] Deployment complete!")
    print("\nYour site will be available at:")
    print("https://YOUR_USERNAME.github.io/modelit-textbook-interactive/")

    return True

def verify_chapters():
    """Verify all chapters exist"""
    print("\n" + "="*80)
    print("VERIFYING CHAPTERS")
    print("="*80 + "\n")

    chapters_dir = BASE_DIR / "chapters"
    if not chapters_dir.exists():
        print("[ERROR] Chapters directory does not exist!")
        return False

    required_chapters = 12
    existing_chapters = []

    for i in range(1, required_chapters + 1):
        chapter_dir = chapters_dir / f"chapter-{i:02d}"
        index_file = chapter_dir / "index.html"

        if index_file.exists():
            existing_chapters.append(i)
            print(f"[SUCCESS] Chapter {i}: Found")
        else:
            print(f"[MISSING] Chapter {i}: Not found")

    print(f"\n[INFO] Found {len(existing_chapters)}/{required_chapters} chapters")

    if len(existing_chapters) == 0:
        print("[ERROR] No chapters found! Run generation script first.")
        return False

    return True

def main():
    """Main deployment workflow"""
    print("\n" + "="*80)
    print("CONNECTED TEXTBOOK - GITHUB PAGES DEPLOYMENT")
    print("="*80)

    # Step 1: Verify chapters
    if not verify_chapters():
        print("\n[ERROR] Chapter verification failed. Aborting deployment.")
        return

    # Step 2: Prepare deployment
    prepare_deployment()

    # Step 3: Ask for confirmation
    print("\n" + "="*80)
    print("READY TO DEPLOY")
    print("="*80)
    print("\nThis will:")
    print("  1. Switch to gh-pages branch")
    print("  2. Copy all files")
    print("  3. Commit and push to GitHub")
    print("  4. Make your textbook live on GitHub Pages")

    response = input("\nDeploy now? (yes/no): ").strip().lower()

    if response == "yes":
        # Step 4: Deploy
        deploy_to_github()
    else:
        print("\n[INFO] Deployment cancelled.")
        print(f"[INFO] Deployment files prepared in: {DEPLOY_DIR}")

if __name__ == "__main__":
    main()
