"""
Connected Textbook - Comprehensive Chapter Generation
Uses CrewAI multi-agent system to generate all 12 chapters with interactive HTML

8 Specialized Agents:
- Science Writer Agent (Content)
- Interactive Designer Agent (UX/UI)
- Visual Content Planner (Graphics)
- Frontend Developer Agent (HTML/CSS)
- Interactive Coder Agent (JavaScript)
- Accessibility Specialist (WCAG)
- QA Validator Agent (Testing)
- SEO Specialist Agent (Optimization)
"""

import os
import json
from pathlib import Path
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Project paths
BASE_DIR = Path(__file__).parent.parent
CHAPTERS_DIR = BASE_DIR / "chapters"
CHAPTERS_DIR.mkdir(exist_ok=True)

# OpenAI Models (switching from OpenRouter due to auth issues)
CONTENT_MODEL = "gpt-4o"  # High quality content generation
CODE_MODEL = "gpt-4o-mini"  # Cost-effective code generation
REASONING_MODEL = "gpt-4o"  # Strong reasoning for QA

# Chapter metadata
CHAPTERS = [
    {
        "number": 1,
        "unit": 1,
        "unit_name": "Foundations of Systems",
        "title": "Welcome to Systems Thinking",
        "subtitle": "Discover how everything connects",
        "hook": "Why did changing one traffic light in Los Angeles cause a massive citywide traffic jam?",
        "ngss": ["MS-ESS3-3", "MS-ETS1-1"],
    },
    {
        "number": 2,
        "unit": 1,
        "unit_name": "Foundations of Systems",
        "title": "Patterns in Nature",
        "subtitle": "Fractals, Fibonacci, and universal patterns",
        "hook": "The same pattern appears in galaxies, hurricanes, and your fingerprint. What is it?",
        "ngss": ["MS-LS2-1", "MS-PS1-1"],
    },
    {
        "number": 3,
        "unit": 1,
        "unit_name": "Foundations of Systems",
        "title": "Energy Flows Through Everything",
        "subtitle": "From sun to you: tracking energy",
        "hook": "You ate a salad for lunch. Where did that energy come from—and where did it really start?",
        "ngss": ["MS-PS3-1", "MS-LS2-3"],
    },
    {
        "number": 4,
        "unit": 2,
        "unit_name": "Living Systems",
        "title": "Ecosystems - Nature's Networks",
        "subtitle": "How wolves changed rivers",
        "hook": "When wolves returned to Yellowstone, the rivers physically changed shape. How?",
        "ngss": ["MS-LS2-1", "MS-LS2-2", "MS-LS2-4"],
    },
    {
        "number": 5,
        "unit": 2,
        "unit_name": "Living Systems",
        "title": "The Human Body as a System",
        "subtitle": "37 trillion cells working together",
        "hook": "Every 7 years, you have an almost completely new body. How does 'you' stay you?",
        "ngss": ["MS-LS1-3", "MS-LS1-8"],
    },
    {
        "number": 6,
        "unit": 2,
        "unit_name": "Living Systems",
        "title": "From Cells to Organisms",
        "subtitle": "One cell becomes a whole person",
        "hook": "You started as one single cell. How did it know to become a brain, a heart, and a toe?",
        "ngss": ["MS-LS1-1", "MS-LS1-2"],
    },
    {
        "number": 7,
        "unit": 3,
        "unit_name": "Earth Systems",
        "title": "Water's Journey",
        "subtitle": "The hydrologic cycle revealed",
        "hook": "The water in your glass today might have been inside a dinosaur 65 million years ago.",
        "ngss": ["MS-ESS2-4", "MS-ESS3-1"],
    },
    {
        "number": 8,
        "unit": 3,
        "unit_name": "Earth Systems",
        "title": "Weather and Climate Systems",
        "subtitle": "Why it snows in Texas",
        "hook": "A butterfly in Brazil can actually affect the weather in Texas. Here's how.",
        "ngss": ["MS-ESS2-5", "MS-ESS2-6", "MS-ESS3-5"],
    },
    {
        "number": 9,
        "unit": 3,
        "unit_name": "Earth Systems",
        "title": "Rocks, Soil, and Slow Systems",
        "subtitle": "Mountains were once ocean floors",
        "hook": "The top of Mount Everest has fossils of sea creatures. How did they get there?",
        "ngss": ["MS-ESS2-1", "MS-ESS2-2", "MS-ESS2-3"],
    },
    {
        "number": 10,
        "unit": 4,
        "unit_name": "Human-Designed Systems",
        "title": "Technology Systems",
        "subtitle": "Your phone from 6 continents",
        "hook": "Your smartphone contains materials from 6 continents and required 1000+ people to make.",
        "ngss": ["MS-ETS1-1", "MS-ETS1-2"],
    },
    {
        "number": 11,
        "unit": 4,
        "unit_name": "Human-Designed Systems",
        "title": "Social and Economic Systems",
        "subtitle": "Why toilet paper disappeared",
        "hook": "In 2020, toilet paper vanished from stores. It wasn't a supply problem—it was psychology.",
        "ngss": ["MS-ESS3-4", "MS-ETS1-1"],
    },
    {
        "number": 12,
        "unit": 4,
        "unit_name": "Human-Designed Systems",
        "title": "Becoming a Systems Thinker",
        "subtitle": "You see the world differently now",
        "hook": "You can't unsee it now. Everything is connected. What will you do with this knowledge?",
        "ngss": ["MS-ESS3-3", "MS-ETS1-3"],
    },
]

# ModelIt brand colors
BRAND_COLORS = {
    "primary_blue": "#0F6ACE",
    "bright_cyan": "#48d2fc",
    "accent_coral": "#FF6B6B",
    "dark_text": "#2c3e50",
}

# Initialize LLMs
def create_llm(model_name: str):
    """Create OpenAI LLM instance"""
    return ChatOpenAI(
        model=model_name,
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        temperature=0.7,
    )

# Define Agents
def create_agents():
    """Create the 8-agent CrewAI team"""

    science_writer = Agent(
        role="Science Content Writer",
        goal="Create engaging, accurate middle school science content that teaches systems thinking",
        backstory="""You are an award-winning science educator with 15 years of experience
        writing for grades 5-8. You make complex concepts accessible and exciting. You understand
        NGSS standards deeply and know how to hook students with compelling questions.""",
        llm=create_llm(CONTENT_MODEL),
        verbose=True,
    )

    interactive_designer = Agent(
        role="Interactive Learning Designer",
        goal="Design interactive elements that maximize engagement and learning retention",
        backstory="""You design educational experiences for Khan Academy and Kurzgesagt.
        You know exactly which interactive elements work best for different learning objectives.
        You balance engagement with educational value.""",
        llm=create_llm(REASONING_MODEL),
        verbose=True,
    )

    visual_planner = Agent(
        role="Visual Content Planner",
        goal="Plan compelling visual elements that enhance understanding",
        backstory="""You are a visual learning specialist who plans diagrams, animations,
        and interactive visuals for science education. You know which visuals clarify concepts
        and which just look pretty but don't teach.""",
        llm=create_llm(CONTENT_MODEL),
        verbose=True,
    )

    frontend_dev = Agent(
        role="Frontend Developer",
        goal="Create beautiful, responsive HTML/CSS that matches the ModelIt design system",
        backstory="""You are a frontend expert who builds education websites. You know HTML5,
        CSS3, and can create Apple-level polish. You follow the ModelIt brand guidelines perfectly
        (colors: #0F6ACE, #48d2fc, #FF6B6B). You write semantic, clean code.""",
        llm=create_llm(CODE_MODEL),
        verbose=True,
    )

    interactive_coder = Agent(
        role="Interactive JavaScript Developer",
        goal="Build engaging, performant interactive elements with vanilla JavaScript",
        backstory="""You specialize in educational interactives. You build simulations, quizzes,
        drag-and-drop activities using vanilla JavaScript. Your code is efficient, accessible,
        and delightful to use.""",
        llm=create_llm(CODE_MODEL),
        verbose=True,
    )

    accessibility_specialist = Agent(
        role="Accessibility Specialist",
        goal="Ensure WCAG AA compliance and screen reader compatibility",
        backstory="""You audit educational websites for accessibility. You know ARIA labels,
        keyboard navigation, and screen reader patterns. You ensure every student can access
        the content regardless of ability.""",
        llm=create_llm(REASONING_MODEL),
        verbose=True,
    )

    qa_validator = Agent(
        role="QA Validator",
        goal="Verify content accuracy, code quality, and educational effectiveness",
        backstory="""You test educational software and review science content for accuracy.
        You catch errors, verify NGSS alignment, and ensure interactive elements work correctly.""",
        llm=create_llm(REASONING_MODEL),
        verbose=True,
    )

    seo_specialist = Agent(
        role="SEO Specialist",
        goal="Optimize content for search engines and educational discovery",
        backstory="""You optimize educational content for Google. You know how teachers search
        for resources and how to structure content for maximum discoverability.""",
        llm=create_llm(CONTENT_MODEL),
        verbose=True,
    )

    return {
        "science_writer": science_writer,
        "interactive_designer": interactive_designer,
        "visual_planner": visual_planner,
        "frontend_dev": frontend_dev,
        "interactive_coder": interactive_coder,
        "accessibility_specialist": accessibility_specialist,
        "qa_validator": qa_validator,
        "seo_specialist": seo_specialist,
    }

def create_chapter_tasks(chapter_data: dict, agents: dict):
    """Create tasks for generating one chapter"""

    # Task 1: Content Creation
    content_task = Task(
        description=f"""Create engaging educational content for Chapter {chapter_data['number']}: {chapter_data['title']}.

        Requirements:
        - Start with the hook: {chapter_data['hook']}
        - 3-4 main sections (each 300-400 words)
        - Real-world examples students can relate to
        - Clear explanations of systems thinking concepts
        - Grade 5-8 reading level
        - NGSS alignment: {', '.join(chapter_data['ngss'])}

        Include:
        - Opening story/scenario
        - Key concepts with definitions
        - Step-by-step explanations
        - Connections to other chapters
        - Summary and reflection questions

        Write in an engaging, conversational tone.""",
        agent=agents["science_writer"],
        expected_output="Complete chapter content with sections, examples, and explanations"
    )

    # Task 2: Interactive Element Design
    interactive_task = Task(
        description=f"""Design 3-5 interactive elements for Chapter {chapter_data['number']}: {chapter_data['title']}.

        Design:
        1. A simulation or drag-and-drop activity for the main concept
        2. An interactive quiz (5-7 questions) with instant feedback
        3. A system mapping activity where students connect components
        4. Optional: A data visualization or animation

        For each element, specify:
        - Learning objective
        - User interaction flow
        - Feedback mechanism
        - Visual design notes
        - JavaScript functionality needed""",
        agent=agents["interactive_designer"],
        expected_output="Detailed specifications for 3-5 interactive elements"
    )

    # Task 3: Visual Planning
    visual_task = Task(
        description=f"""Plan visual elements for Chapter {chapter_data['number']}: {chapter_data['title']}.

        Create specifications for:
        - Chapter header image/illustration
        - 3-4 diagrams explaining key concepts
        - Icons for interactive elements
        - Color schemes for different sections
        - Animation concepts

        Use ModelIt brand colors: {json.dumps(BRAND_COLORS)}
        Style: Clean, modern, educational (Apple + Kurzgesagt aesthetic)""",
        agent=agents["visual_planner"],
        expected_output="Visual content plan with descriptions and specifications"
    )

    # Task 4: HTML/CSS Development
    html_task = Task(
        description=f"""Create complete HTML/CSS for Chapter {chapter_data['number']}: {chapter_data['title']}.

        Requirements:
        - Full HTML5 page with semantic markup
        - CSS matching the ModelIt design system
        - Responsive layout (mobile, tablet, desktop)
        - Smooth animations and transitions
        - Include navigation back to main page

        Use the content from the Science Writer and visual plan from Visual Planner.

        Brand colors:
        - Primary Blue: #0F6ACE
        - Bright Cyan: #48d2fc
        - Accent Coral: #FF6B6B

        Fonts:
        - Headers: Inter (400, 600, 800)
        - Body: Lora (400, 600)

        Output complete, production-ready HTML with embedded CSS.""",
        agent=agents["frontend_dev"],
        expected_output="Complete HTML file with embedded CSS, ready to deploy",
        context=[content_task, visual_task]
    )

    # Task 5: JavaScript Interactivity
    js_task = Task(
        description=f"""Build JavaScript for interactive elements in Chapter {chapter_data['number']}.

        Implement the interactive elements designed by the Interactive Designer:
        - Simulations with click/drag interactions
        - Quiz system with instant feedback
        - System mapping activity
        - Progress tracking

        Requirements:
        - Vanilla JavaScript (no frameworks)
        - Accessible (keyboard navigation, ARIA labels)
        - Performant (smooth animations)
        - LocalStorage for progress saving

        Output complete JavaScript code ready to embed.""",
        agent=agents["interactive_coder"],
        expected_output="Complete JavaScript code for all interactive elements",
        context=[interactive_task]
    )

    # Task 6: Accessibility Audit
    accessibility_task = Task(
        description=f"""Audit Chapter {chapter_data['number']} for accessibility compliance.

        Check:
        - ARIA labels on all interactive elements
        - Keyboard navigation support
        - Color contrast ratios (WCAG AA)
        - Screen reader compatibility
        - Focus indicators
        - Alt text for images

        Provide specific fixes for any issues found.""",
        agent=agents["accessibility_specialist"],
        expected_output="Accessibility audit report with fixes",
        context=[html_task, js_task]
    )

    # Task 7: QA Validation
    qa_task = Task(
        description=f"""Validate Chapter {chapter_data['number']} for quality and accuracy.

        Verify:
        - Science content accuracy
        - NGSS standards alignment
        - Interactive elements work correctly
        - No broken links or missing assets
        - Consistent styling with brand guidelines
        - Grade-appropriate language

        Provide a quality score (1-10) and list any issues.""",
        agent=agents["qa_validator"],
        expected_output="QA report with quality score and issue list",
        context=[content_task, html_task, js_task, accessibility_task]
    )

    # Task 8: SEO Optimization
    seo_task = Task(
        description=f"""Optimize Chapter {chapter_data['number']} for search and discovery.

        Add:
        - Meta description (150-160 chars)
        - Title tag optimization
        - Header hierarchy (H1, H2, H3)
        - Image alt text
        - Internal linking suggestions
        - Keywords for teachers searching

        Focus: Middle school science, systems thinking, NGSS standards""",
        agent=agents["seo_specialist"],
        expected_output="SEO optimization recommendations and meta tags",
        context=[content_task, html_task]
    )

    return [
        content_task,
        interactive_task,
        visual_task,
        html_task,
        js_task,
        accessibility_task,
        qa_task,
        seo_task,
    ]

def generate_chapter(chapter_data: dict, agents: dict):
    """Generate one complete chapter using CrewAI"""

    print(f"\n{'='*80}")
    print(f"GENERATING CHAPTER {chapter_data['number']}: {chapter_data['title']}")
    print(f"{'='*80}\n")

    # Create tasks
    tasks = create_chapter_tasks(chapter_data, agents)

    # Create crew
    crew = Crew(
        agents=list(agents.values()),
        tasks=tasks,
        process=Process.sequential,  # Run tasks in order
        verbose=True,
    )

    # Execute
    try:
        result = crew.kickoff()

        # Save results
        chapter_dir = CHAPTERS_DIR / f"chapter-{chapter_data['number']:02d}"
        chapter_dir.mkdir(exist_ok=True)

        # Save outputs
        output_file = chapter_dir / "index.html"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(str(result))

        # Save metadata
        metadata_file = chapter_dir / "metadata.json"
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(chapter_data, f, indent=2)

        print(f"\n[SUCCESS] Chapter {chapter_data['number']} generated successfully!")
        print(f"   Saved to: {chapter_dir}")

        return True

    except Exception as e:
        print(f"\n[ERROR] Error generating Chapter {chapter_data['number']}: {e}")
        return False

def main():
    """Generate all 12 chapters"""

    print("\n" + "="*80)
    print("CONNECTED TEXTBOOK - COMPREHENSIVE CHAPTER GENERATION")
    print("="*80)
    print(f"Generating {len(CHAPTERS)} chapters using CrewAI multi-agent system")
    print(f"Output directory: {CHAPTERS_DIR}")
    print("="*80 + "\n")

    # Create agents once (reuse for all chapters)
    print("Initializing 8-agent CrewAI team...")
    agents = create_agents()
    print("[SUCCESS] Agents initialized\n")

    # Track results
    results = []

    # Generate each chapter
    for chapter_data in CHAPTERS:
        success = generate_chapter(chapter_data, agents)
        results.append({
            "chapter": chapter_data['number'],
            "title": chapter_data['title'],
            "success": success
        })

    # Summary
    print("\n" + "="*80)
    print("GENERATION COMPLETE")
    print("="*80)

    successful = sum(1 for r in results if r['success'])
    failed = len(results) - successful

    print(f"\n[SUCCESS] Successful: {successful}/{len(CHAPTERS)}")
    print(f"[FAILED] Failed: {failed}/{len(CHAPTERS)}")

    if failed > 0:
        print("\nFailed chapters:")
        for r in results:
            if not r['success']:
                print(f"  - Chapter {r['chapter']}: {r['title']}")

    print("\n" + "="*80)

if __name__ == "__main__":
    main()
