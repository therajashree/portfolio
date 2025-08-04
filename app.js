// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initBackToTop();
    initCounterAnimation();
    initIntersectionObserver();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
            navToggle.querySelector('i').className = 'fas fa-bars';
            
            // Smooth scroll to target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.98)';
            header.style.boxShadow = 'var(--shadow-sm)';
        } else {
            header.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Update active navigation link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on current section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.getElementById('header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll animations using Intersection Observer
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation when hero section is visible
                if (entry.target.id === 'home') {
                    animateCounter('experience-counter', 8, '+');
                }
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe cards and other elements
    const animatedElements = document.querySelectorAll('.card, .skill-item, .blog-card, .contact-item, .reference-card');
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });

    // Observe timeline items with different animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        if (index % 2 === 0) {
            item.classList.add('slide-in-left');
        } else {
            item.classList.add('slide-in-right');
        }
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
}

// Smooth scroll animations
function initScrollAnimations() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .blog-card, .skill-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Counter animation
function initCounterAnimation() {
    // This will be triggered by the intersection observer
}

function animateCounter(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = targetValue / 30;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue) + suffix;
        element.classList.add('counter-animate');
    }, 50);
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Reset form
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        }, 1500);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'var(--color-success)';
            break;
        case 'error':
            notification.style.background = 'var(--color-error)';
            break;
        case 'warning':
            notification.style.background = 'var(--color-warning)';
            break;
        default:
            notification.style.background = 'var(--color-info)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Back to top button
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add typing animation to hero title
function initTypingAnimation() {
    const heroTitle = document.getElementById('hero-title');
    const text = 'Rajashree';
    let index = 0;
    
    heroTitle.textContent = '';
    
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 150);
        } else {
            heroTitle.style.borderRight = 'none';
        }
    }
    
    // Start typing animation after a short delay
    setTimeout(typeWriter, 1000);
}

// Initialize skill animations
function initSkillAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag, .tech-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-content');
        const speed = 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
}

// Add random floating animation to profile placeholder
function initProfileAnimation() {
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    
    if (profilePlaceholder) {
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            
            profilePlaceholder.style.transform = `translate(${randomX}px, ${randomY}px) scale(1.02)`;
            
            setTimeout(() => {
                profilePlaceholder.style.transform = 'translate(0, 0) scale(1)';
            }, 2000);
        }, 5000);
    }
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', function() {
    initSkillAnimations();
    initProfileAnimation();
    
    // Add stagger animation to social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
        link.classList.add('fade-in');
    });
    
    // Add stagger animation to hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((button, index) => {
        button.style.animationDelay = `${index * 0.2}s`;
        button.classList.add('slide-in-left');
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.querySelector('i').className = 'fas fa-bars';
    }
});

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedUpdateActiveNavLink = debounce(updateActiveNavLink, 10);
window.removeEventListener('scroll', updateActiveNavLink);
window.addEventListener('scroll', debouncedUpdateActiveNavLink);

// Add loading animation
function showPageLoading() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading Portfolio...</p>
        </div>
    `;
    
    // Add loader styles
    Object.assign(loader.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'var(--color-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '10000',
        transition: 'opacity 0.5s ease'
    });
    
    document.body.appendChild(loader);
    
    // Hide loader after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 1000);
    });
}

// Initialize page loader
showPageLoading();

// Add CSS for loader spinner
const loaderStyles = document.createElement('style');
loaderStyles.textContent = `
    .loader-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid var(--color-border);
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loader-content {
        text-align: center;
        color: var(--color-text);
    }
    
    .loader-content p {
        margin: 0;
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
    }
`;
document.head.appendChild(loaderStyles);