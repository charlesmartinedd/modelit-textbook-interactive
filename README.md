# Connected: The Systems Behind Our World

**An Interactive Science Textbook for Middle School (Grades 5-8)**

![Status](https://img.shields.io/badge/status-in_development-yellow)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌍 Overview

**Connected** is a modern, interactive web-based science textbook that teaches middle school students about systems thinking through engaging, hands-on content. Built from scratch with beautiful design, smooth animations, and accessibility in mind.

### Why Connected?

- **Interactive Learning**: Click, explore, and interact with concepts
- **Modern Design**: Apple-inspired aesthetics with ModelIt branding
- **Free Forever**: Open educational resource for all students
- **NGSS Aligned**: Meets national science education standards
- **Responsive**: Works on phones, tablets, and computers

---

## 🎨 Design Philosophy

**Design Inspiration:**
- Apple's clean, modern aesthetic
- Kurzgesagt's vibrant, engaging visuals
- Khan Academy's educational clarity

**Brand Colors:**
- Primary Blue: `#0F6ACE`
- Bright Cyan: `#48d2fc`
- Accent Coral: `#FF6B6B`

**Typography:**
- Headers: Inter (weights: 400, 600, 800)
- Body: Lora (weights: 400, 600)

---

## 📚 Content Structure

### 12 Chapters Across 4 Units:

**Unit 1: Foundations of Systems**
1. Welcome to Systems Thinking
2. Patterns in Nature
3. Energy Flows Through Everything

**Unit 2: Living Systems**
4. Ecosystems - Nature's Networks
5. The Human Body as a System
6. From Cells to Organisms

**Unit 3: Earth Systems**
7. Water's Journey
8. Weather and Climate Systems
9. Rocks, Soil, and Slow Systems

**Unit 4: Human-Designed Systems**
10. Technology Systems
11. Social and Economic Systems
12. Becoming a Systems Thinker

---

## 🚀 Quick Start

### Run Locally

```bash
# Navigate to project directory
cd repos/modelit-textbook-interactive

# Start a local web server (Python 3)
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

### View Online

🔗 **Live Demo**: [Coming Soon]

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5 with semantic markup
- CSS3 with custom animations
- Vanilla JavaScript (no frameworks)

**Design Features:**
- CSS Grid & Flexbox for layouts
- CSS Custom Properties (variables)
- Intersection Observer API for animations
- LocalStorage for progress saving

**Future Integrations:**
- D3.js for data visualizations
- Three.js for 3D models
- GSAP for advanced animations

---

## 📂 Project Structure

```
modelit-textbook-interactive/
├── index.html              # Landing page (350+ lines)
├── css/
│   └── main.css           # Complete styling (1000+ lines)
├── js/
│   └── main.js            # Interactive functionality
├── assets/                # Images, icons, videos
│   ├── images/
│   └── icons/
├── chapters/              # Individual chapter pages
│   ├── chapter-01/
│   ├── chapter-02/
│   └── ...
└── README.md
```

---

## ✨ Key Features

### Landing Page
- ✅ Hero section with gradient animations
- ✅ Interactive stats counter
- ✅ Complete chapter overview (all 12 chapters)
- ✅ Feature showcase
- ✅ Smooth scroll navigation
- ✅ Responsive design

### Interactions
- ✅ Scroll-triggered animations
- ✅ Hover effects on cards
- ✅ Click animations on interactive elements
- ✅ 3D tilt effect on feature cards
- ✅ Smooth page transitions
- ✅ Keyboard navigation support

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation
- High contrast ratios (WCAG AA compliant)
- Focus indicators
- Semantic HTML structure

---

## 🎯 Development Roadmap

### Phase 1: Foundation (Current)
- [x] Landing page design
- [x] CSS styling system
- [x] JavaScript interactions
- [ ] Local testing

### Phase 2: Content Generation
- [ ] CrewAI multi-agent system
- [ ] Chapter 1 content
- [ ] Interactive elements
- [ ] Embedded simulations

### Phase 3: Deployment
- [ ] GitHub Pages setup
- [ ] Custom domain
- [ ] Analytics integration
- [ ] SEO optimization

### Phase 4: Advanced Features
- [ ] Progress tracking
- [ ] Assessments & quizzes
- [ ] Teacher dashboard
- [ ] Student accounts

---

## 🤖 CrewAI Multi-Agent System

**8 Specialized Agents:**

**Squad 1: Content Creation**
- Science Writer Agent
- Interactive Designer Agent
- Visual Content Planner

**Squad 2: Development**
- Frontend Developer Agent
- Interactive Coder Agent
- Accessibility Specialist

**Squad 3: Quality Assurance**
- QA Validator Agent
- SEO Specialist Agent

**Free Models Used:**
- `meta-llama/llama-3.3-70b-instruct` (Content)
- `deepseek/deepseek-chat` (Code)
- `deepseek/deepseek-r1-distill-llama-70b` (Reasoning)

---

## 📊 Performance

**Target Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

**Optimizations:**
- Lazy loading for images
- CSS animations (hardware accelerated)
- Minimal JavaScript bundle
- Efficient DOM manipulation

---

## 🎓 Educational Standards

**NGSS Alignment:**
- MS-LS2-1: Ecosystem interactions
- MS-LS1-3: Organism systems
- MS-ESS2-1: Earth's systems
- MS-ESS3-3: Human impacts

**Skills Developed:**
- Critical thinking
- Systems analysis
- Problem solving
- Scientific reasoning

---

## 🤝 Contributing

We welcome contributions! Areas of interest:
- Interactive simulations
- Accessibility improvements
- Content refinements
- Translation to other languages

---

## 📜 License

MIT License - Open educational resource

© 2025 ModelIt K12 - Education for everyone

---

## 📧 Contact

**ModelIt K12**
- Website: [Coming Soon]
- Email: [Coming Soon]
- GitHub: [@charlesmartinedd](https://github.com/charlesmartinedd)

---

## 🙏 Acknowledgments

- **Design Inspiration**: Apple, Kurzgesagt, Khan Academy
- **Built with**: HTML5, CSS3, JavaScript
- **AI Content**: OpenRouter + CrewAI
- **Fonts**: Google Fonts (Inter, Lora)

---

**🌟 Let's teach the world about systems thinking!**

## Status
Active

## TODO
- [ ] Complete remaining chapters (7-12)
- [ ] Add interactive Canvas simulations
- [ ] Implement assessment quizzes