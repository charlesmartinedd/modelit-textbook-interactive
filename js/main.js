/**
 * Connected: Interactive Science Textbook
 * Main JavaScript - Navigation, Animations, and Interactions
 */

// ============================================
// Navigation Scroll Effect
// ============================================

const nav = document.getElementById('mainNav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Add scrolled class when user scrolls down
    if (currentScrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
});

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navHeight = nav.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Intersection Observer for Fade-In Animations
// ============================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInElements = document.querySelectorAll('.feature-card, .chapter-card, .showcase-item');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 50);

                fadeInObserver.unobserve(entry.target);
            }, index * 100);
        }
    });
}, observerOptions);

fadeInElements.forEach(el => {
    fadeInObserver.observe(el);
});

// ============================================
// Chapter Card Hover Effects
// ============================================

const chapterCards = document.querySelectorAll('.chapter-card');

chapterCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Add subtle scale animation
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// Stats Counter Animation
// ============================================

const statsNumbers = document.querySelectorAll('.stat-number');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = target.textContent;

            // Only animate if it's a number
            if (!isNaN(parseInt(finalValue))) {
                const duration = 2000;
                const startValue = 0;
                const increment = parseInt(finalValue) / (duration / 16);
                let currentValue = startValue;

                target.textContent = '0';

                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= parseInt(finalValue)) {
                        target.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(currentValue);
                    }
                }, 16);
            }

            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

statsNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// Preview Card Interactive Demo
// ============================================

const simulationNodes = document.querySelectorAll('.node');

simulationNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
        // Add click animation
        node.style.transform = 'scale(1.3)';
        node.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

        setTimeout(() => {
            node.style.transform = 'scale(1)';
        }, 300);

        // Ripple effect on connectors
        const connectors = document.querySelectorAll('.connector');
        connectors.forEach(connector => {
            connector.style.animation = 'none';
            setTimeout(() => {
                connector.style.animation = 'flow 1.5s ease-in-out';
            }, 10);
        });
    });
});

// ============================================
// Feature Cards Tilt Effect (Advanced)
// ============================================

const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ============================================
// Scroll Progress Indicator (Optional)
// ============================================

function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;

    // You can use this to create a progress bar if desired
    // document.getElementById('progressBar').style.width = scrollProgress + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// Enhanced Button Hover Effects
// ============================================

const buttons = document.querySelectorAll('.btn-hero, .btn-secondary, .btn-preview, .btn-cta');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.05)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });

    button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-4px) scale(1.05)';
    });
});

// ============================================
// Chapter Badge Glow Effect
// ============================================

const availableBadges = document.querySelectorAll('.chapter-badge.available');

availableBadges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 20px rgba(72, 210, 252, 0.5)';
    });

    badge.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// ============================================
// Lazy Load Background Animations
// ============================================

function initBackgroundAnimations() {
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        // Add performance-friendly particle effect
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: radial-gradient(circle, rgba(72, 210, 252, 0.4), transparent);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 15}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            heroBackground.appendChild(particle);
        }
    }
}

// Initialize on load
window.addEventListener('load', () => {
    initBackgroundAnimations();
});

// ============================================
// Mobile Menu Toggle (Placeholder)
// ============================================

// Add mobile menu functionality here if needed
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        // Mobile menu logic
        console.log('Mobile menu should be implemented here');
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// ============================================
// Console Welcome Message
// ============================================

console.log('%c🌍 Connected: The Systems Behind Our World', 'color: #0F6ACE; font-size: 24px; font-weight: bold;');
console.log('%c✨ Interactive Science Textbook by ModelIt K12', 'color: #48d2fc; font-size: 16px;');
console.log('%cExplore 12 chapters of systems thinking!', 'color: #5a6c7d; font-size: 14px;');

// ============================================
// Performance Monitoring (Optional)
// ============================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// ============================================
// Keyboard Navigation Accessibility
// ============================================

document.addEventListener('keydown', (e) => {
    // Add keyboard shortcuts
    if (e.key === 'Escape') {
        // Close any open modals or menus
    }

    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Future: Search functionality
        console.log('Search feature coming soon!');
    }
});

// ============================================
// Save Progress (Placeholder for Future)
// ============================================

const saveProgress = (chapterNumber, sectionId) => {
    localStorage.setItem('lastVisited', JSON.stringify({
        chapter: chapterNumber,
        section: sectionId,
        timestamp: new Date().toISOString()
    }));
};

const loadProgress = () => {
    const saved = localStorage.getItem('lastVisited');
    return saved ? JSON.parse(saved) : null;
};

// Check for saved progress on load
const savedProgress = loadProgress();
if (savedProgress) {
    console.log(`📚 Last visited: Chapter ${savedProgress.chapter}, Section ${savedProgress.section}`);
}

// ============================================
// Analytics Tracking (Placeholder)
// ============================================

const trackPageView = (pageName) => {
    // Future: Add analytics tracking
    console.log(`📊 Page view: ${pageName}`);
};

const trackEvent = (category, action, label) => {
    // Future: Add event tracking
    console.log(`🎯 Event: ${category} - ${action} - ${label}`);
};

// Track initial page load
trackPageView('Landing Page');

// ============================================
// Easter Egg: Konami Code
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiSequence.length);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 3s ease-in-out';
        console.log('🎮 KONAMI CODE ACTIVATED! You found the secret!');

        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
});

// ============================================
// Export Functions for Future Use
// ============================================

window.ConnectedTextbook = {
    saveProgress,
    loadProgress,
    trackPageView,
    trackEvent
};

console.log('✅ Connected Textbook JavaScript initialized successfully!');