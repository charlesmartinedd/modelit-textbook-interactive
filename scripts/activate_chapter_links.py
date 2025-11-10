"""
Activate all chapter links in the landing page
Updates "Coming Soon" badges to "Read Now" and adds proper links
"""

def activate_chapters():
    """Update index.html to activate all chapter links"""

    index_path = "C:/Users/MarieLexisDad/repos/modelit-textbook-interactive/index.html"

    # Read the current index.html
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace all "Coming Soon" badges with "Read Now" badges
    content = content.replace(
        '<span class="chapter-badge coming">Coming Soon</span>',
        '<span class="chapter-badge available">Read Now</span>'
    )

    # Update chapter cards to be clickable links
    # We'll wrap each chapter-card div with an <a> tag
    for i in range(1, 13):
        chapter_num = f"{i:02d}"

        # Find the chapter card and make it a link
        old_pattern = f'<div class="chapter-card">\n                    <div class="chapter-number">{chapter_num}</div>'
        new_pattern = f'<a href="chapters/chapter-{chapter_num}/" class="chapter-link">\n                <div class="chapter-card">\n                    <div class="chapter-number">{chapter_num}</div>'

        content = content.replace(old_pattern, new_pattern)

        # Close the anchor tag after the badge
        old_end = '<span class="chapter-badge available">Read Now</span>\n                </div>'
        new_end = '<span class="chapter-badge available">Read Now</span>\n                </div>\n                </a>'

        # Only replace the first occurrence for each chapter
        content = content.replace(old_end, new_end, 1)

    # Write back to index.html
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("[SUCCESS] Landing page updated!")
    print("  - All 12 chapters activated")
    print("  - 'Coming Soon' changed to 'Read Now'")
    print("  - Chapter cards are now clickable links")
    print("\nView at: http://localhost:9000/")

if __name__ == "__main__":
    activate_chapters()
