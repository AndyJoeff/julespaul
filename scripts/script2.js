// Navigation functionality
class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setActiveSection();
        this.handleScroll();
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Handle scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Handle smooth scrolling for anchor links
        this.handleSmoothScrolling();
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('nav__menu--active');
        this.navToggle.classList.toggle('nav__toggle--active');
        document.body.classList.toggle('nav-open');
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('nav__menu--active');
        this.navToggle.classList.remove('nav__toggle--active');
        document.body.classList.remove('nav-open');
    }
    
    handleOutsideClick(e) {
        if (!e.target.closest('.nav') && this.navMenu.classList.contains('nav__menu--active')) {
            this.closeMobileMenu();
        }
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add/remove header background on scroll
        if (scrollY > 50) {
            this.header.classList.add('header--scrolled');
        } else {
            this.header.classList.remove('header--scrolled');
        }
        
        // Update active navigation link
        this.updateActiveLink();
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('nav__link--active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('nav__link--active');
                }
            }
        });
    }
    
    handleSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setActiveSection() {
        // Set initial active section based on current page load
        this.updateActiveLink();
    }
}

// Hero section animations and interactions
class HeroAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.animateOnLoad();
        this.handleServiceTags();
    }
    
    animateOnLoad() {
        // Add loading animation class to trigger CSS animations
        const heroElements = document.querySelectorAll('.hero__greeting, .hero__title, .hero__description, .hero__actions, .hero__stats, .hero__image');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 100);
        });
    }
    
    handleServiceTags() {
        const serviceTags = document.querySelectorAll('.service-tag');
        
        serviceTags.forEach(tag => {
            // Add hover effects and random float animations
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-10px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
            });
        });
        
        // Add floating animation
        this.addFloatingAnimation();
    }
    
    addFloatingAnimation() {
        const serviceTags = document.querySelectorAll('.service-tag');
        
        serviceTags.forEach((tag, index) => {
            const delay = index * 0.5;
            const duration = 3 + (index * 0.5);
            
            tag.style.animationDelay = `${delay}s`;
            tag.style.animationDuration = `${duration}s`;
            tag.classList.add('floating');
        });
    }
}

// Stats counter animation
class StatsCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat__number');
        this.init();
    }
    
    init() {
        this.observeStats();
    }
    
    observeStats() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });
        
        this.stats.forEach(stat => observer.observe(stat));
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d\s]/g, '');
        const duration = 2000;
        const increment = number / (duration / 16);
        
        let currentNumber = 0;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            
            if (currentNumber >= number) {
                currentNumber = number;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(currentNumber) + suffix;
        }, 16);
    }
}

// Utility functions
class Utils {
    static debounce(func, wait) {
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
    
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add this to your script.js for dynamic background particles
class BackgroundAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        const heroSection = document.querySelector('.hero');
        heroSection.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }
    
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 15 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.1 + 0.05
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(44, 90, 160, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
}

// Initialize background animation
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure hero section is rendered
    setTimeout(() => {
        new BackgroundAnimation();
    }, 100);
});

// About section animations
class AboutAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.observeElements();
        this.prepareSkills();
    }
    
    observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger skill animations when section-description comes into view
                if (
                    entry.target.classList.contains('about__text') || 
                    entry.target.classList.contains('about__story-text')
                ) {
                    this.triggerSkillAnimations();
                }
            }
        });
    }, { threshold: 0.3 });

    const elementsToObserve = document.querySelectorAll(
        '.about__text, .about__features, .feature, .about__story-text'
    );
    elementsToObserve.forEach(el => observer.observe(el));
}

    
    prepareSkills() {
        const skillBars = document.querySelectorAll('.skill__progress');
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width; // Get the width from HTML
            bar.dataset.targetWidth = targetWidth; // Store it
            bar.style.width = '0%'; // Reset to 0
        });
    }
    
    triggerSkillAnimations() {
        const skills = document.querySelectorAll('.skill__progress');
        skills.forEach((skill, index) => {
            setTimeout(() => {
                const targetWidth = skill.dataset.targetWidth;
                skill.style.width = targetWidth; // Set to actual target width
            }, index * 200);
        });
    }
}

// Services CTA Interactive Features
class ServicesCTA {
    constructor() {
        this.ctaSection = document.querySelector('.services__cta');
        this.ctaStats = document.querySelectorAll('.cta-stat');
        this.ctaNumbers = document.querySelectorAll('.cta-stat__number');
        this.ctaButtons = document.querySelectorAll('.services__cta-actions .btn');
        
        this.init();
    }
    
    init() {
        if (!this.ctaSection) return;
        
        this.setupIntersectionObserver();
        this.setupStatsHover();
        this.setupParticleEffect();
        this.setupButtonAnimations();
        this.setupCounterAnimation();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSection();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(this.ctaSection);
    }
    
    animateSection() {
        // Trigger counter animations
        this.animateCounters();
        
        // Add staggered animation to stats
        this.ctaStats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.animation = `slideInRight 0.6s ease-out forwards`;
            }, index * 150);
        });
        
        // Start particle effect
        this.startParticleEffect();
    }
    
    setupStatsHover() {
        this.ctaStats.forEach(stat => {
            const number = stat.querySelector('.cta-stat__number');
            const originalText = number.textContent;
            
            // Set data attribute for hover effect
            number.setAttribute('data-number', originalText);
            
            stat.addEventListener('mouseenter', () => {
                this.addHoverParticles(stat);
            });
            
            stat.addEventListener('mouseleave', () => {
                this.removeHoverParticles(stat);
            });
        });
    }
    
    animateCounters() {
        this.ctaNumbers.forEach(numberElement => {
            const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
            const suffix = numberElement.textContent.replace(/[\d\s]/g, '');
            const duration = 2000;
            const increment = finalNumber / (duration / 16);
            
            let currentNumber = 0;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                
                if (currentNumber >= finalNumber) {
                    currentNumber = finalNumber;
                    clearInterval(timer);
                }
                
                numberElement.textContent = Math.floor(currentNumber) + suffix;
            }, 16);
        });
    }
    
    setupCounterAnimation() {
        // Add counter reset on hover
        this.ctaStats.forEach(stat => {
            const number = stat.querySelector('.cta-stat__number');
            const originalText = number.textContent;
            
            stat.addEventListener('mouseenter', () => {
                number.style.transform = 'scale(1.1)';
                number.style.transition = 'transform 0.3s ease';
            });
            
            stat.addEventListener('mouseleave', () => {
                number.style.transform = 'scale(1)';
            });
        });
    }
    
    setupParticleEffect() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        this.ctaSection.appendChild(this.particleContainer);
    }
    
    startParticleEffect() {
        setInterval(() => {
            this.createParticle();
        }, 3000);
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'services__cta-particle';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        particle.style.cssText = `
            left: ${startX}%;
            top: ${startY}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        this.particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000);
    }
    
    addHoverParticles(stat) {
        const rect = stat.getBoundingClientRect();
        const sectionRect = this.ctaSection.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'services__cta-particle';
                
                const x = ((rect.left - sectionRect.left) / sectionRect.width) * 100;
                const y = ((rect.top - sectionRect.top) / sectionRect.height) * 100;
                
                particle.style.cssText = `
                    left: ${x + Math.random() * 10}%;
                    top: ${y + Math.random() * 10}%;
                    background: var(--color-accent-light);
                `;
                
                this.particleContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 6000);
            }, i * 200);
        }
    }
    
    removeHoverParticles(stat) {
        // Particles will remove themselves via timeout
    }
    
    setupButtonAnimations() {
        this.ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createButtonRipple(e);
            });
            
            button.addEventListener('click', (e) => {
                this.createButtonRipple(e, true);
            });
        });
    }
    
    createButtonRipple(e, isClick = false) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: ${isClick ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'};
            transform: scale(0);
            animation: ripple ${isClick ? '0.6s' : '0.4s'} linear;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, isClick ? 600 : 400);
    }
}

// Scroll-triggered animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.init();
    }
    
    init() {
        this.setupObserver();
    }
    
    setupObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Add ripple effect keyframes to CSS dynamically
const rippleStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        }
    }
`;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple styles
    const style = document.createElement('style');
    style.textContent = rippleStyles;
    document.head.appendChild(style);
    
    // Initialize classes
    new ServicesCTA();
    new ScrollAnimations();
});

// Performance optimization for scroll events
let ticking = false;

function updateScrollAnimations() {
    // Add any scroll-based animations here
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
    }
});

// Process Timeline Interaction
class ProcessTimeline {
    constructor() {
        this.steps = document.querySelectorAll('.step');
        this.progressBar = document.getElementById('timeline-progress');
        this.currentStep = 1;
        this.autoPlayInterval = null;
        this.isAutoPlaying = true;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.observeSection();
    }
    
    bindEvents() {
        this.steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.stopAutoPlay();
                this.setActiveStep(index + 1);
                this.startAutoPlay();
            });
            
            step.addEventListener('mouseenter', () => {
                if (!this.isAutoPlaying) return;
                this.stopAutoPlay();
            });
            
            step.addEventListener('mouseleave', () => {
                if (!this.isAutoPlaying) return;
                this.startAutoPlay();
            });
        });
    }
    
    setActiveStep(stepNumber) {
        this.currentStep = stepNumber;
        
        // Update active class
        this.steps.forEach((step, index) => {
            step.classList.toggle('step--active', index + 1 === stepNumber);
        });
        
        // Update progress bar
        if (this.progressBar) {
            const progress = (stepNumber / this.steps.length) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }
    
    startAutoPlay() {
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.currentStep = this.currentStep >= this.steps.length ? 1 : this.currentStep + 1;
            this.setActiveStep(this.currentStep);
        }, 3000);
    }
    
    stopAutoPlay() {
        this.isAutoPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    observeSection() {
        const processSection = document.getElementById('process');
        if (!processSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAutoPlay();
                } else {
                    this.stopAutoPlay();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(processSection);
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact__form');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        this.inputs = this.form?.querySelectorAll('.form__input');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Handle input validation on blur
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        
        // Handle textarea auto-resize
        const textarea = this.form.querySelector('.form__textarea');
        if (textarea) {
            textarea.addEventListener('input', () => this.autoResize(textarea));
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = this.validateForm();
        
        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Simulate API call (replace with your actual endpoint)
            await this.submitForm(data);
            
            // Show success message
            this.showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            this.form.reset();
            this.clearAllLabels();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async submitForm(data) {
        // Simulate API call - replace with your actual form submission logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
        
        // Example actual implementation:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
        */
    }
    
    validateForm() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        
        // Clear previous errors
        this.clearError(input);
        
        // Required field validation
        if (input.required && !value) {
            this.showFieldError(input, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Name validation
        if (name === 'name' && value) {
            if (value.length < 2) {
                this.showFieldError(input, 'Name must be at least 2 characters long');
                return false;
            }
        }
        
        // Message validation
        if (name === 'message' && value) {
            if (value.length < 10) {
                this.showFieldError(input, 'Message must be at least 10 characters long');
                return false;
            }
        }
        
        return true;
    }
    
    showFieldError(input, message) {
        input.classList.add('form__input--error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.form__error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'form__error';
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
    }
    
    clearError(input) {
        input.classList.remove('form__input--error');
        const errorElement = input.parentNode.querySelector('.form__error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.classList.add('btn--loading');
            this.submitBtn.disabled = true;
            this.inputs.forEach(input => input.disabled = true);
        } else {
            this.submitBtn.classList.remove('btn--loading');
            this.submitBtn.disabled = false;
            this.inputs.forEach(input => input.disabled = false);
        }
    }
    
    clearAllLabels() {
        const labels = this.form.querySelectorAll('.form__label');
        labels.forEach(label => {
            label.style.transform = '';
            label.style.color = '';
            label.style.backgroundColor = '';
            label.style.padding = '';
        });
    }
    
    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="Close notification">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Handle close button
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => this.hideNotification(notification));
        
        // Show notification
        setTimeout(() => notification.classList.add('notification--show'), 100);
        
        // Auto hide after 5 seconds
        setTimeout(() => this.hideNotification(notification), 5000);
    }
    
    hideNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    setupValidation() {
        // Add custom validation styles
        const style = document.createElement('style');
        style.textContent = `
            .form__input--error {
                border-color: #ef4444 !important;
                background-color: #fef2f2 !important;
            }
            
            .form__error {
                display: block;
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                font-weight: 500;
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 0.75rem;
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                border-left: 4px solid #10b981;
            }
            
            .notification--error {
                border-left-color: #ef4444;
            }
            
            .notification--show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification__content {
                padding: 1rem;
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
            }
            
            .notification__message {
                flex: 1;
                font-size: 0.875rem;
                line-height: 1.5;
                color: #374151;
            }
            
            .notification__close {
                background: none;
                border: none;
                cursor: pointer;
                color: #6b7280;
                padding: 0.25rem;
                border-radius: 0.375rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.15s ease;
            }
            
            .notification__close:hover {
                background-color: #f3f4f6;
                color: #374151;
            }
        `;
        document.head.appendChild(style);
    }

}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    new HeroAnimations();
    new StatsCounter();
    new AboutAnimations();
    new ProcessTimeline();
    new ContactForm();
    
    // Add performance optimizations
    const debouncedResize = Utils.debounce(() => {
        window.dispatchEvent(new Event('optimizedResize'));
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
});

