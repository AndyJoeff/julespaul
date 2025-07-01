/*!
 * About Section Animations
 * Standalone script for Paul's portfolio about section
 */

(function() {
    'use strict';
    
    // About section animations class
    class AboutAnimations {
        constructor() {
            this.aboutSection = document.querySelector('.about');
            this.isInitialized = false;
            this.init();
        }
        
        init() {
            if (!this.aboutSection) {
                console.warn('About section not found');
                return;
            }
            
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setup();
                });
            } else {
                this.setup();
            }
        }
        
        setup() {
            this.prepareSkills();
            this.observeElements();
            this.isInitialized = true;
            console.log('About animations initialized');
        }
        
        prepareSkills() {
            const skillBars = document.querySelectorAll('.skill__progress');
            skillBars.forEach(bar => {
                const targetWidth = bar.style.width; // Get the width from HTML
                bar.dataset.targetWidth = targetWidth; // Store it
                bar.style.width = '0%'; // Reset to 0
                bar.style.transition = 'width 1.5s ease-out';
            });
        }
        
        observeElements() {
            // Check if IntersectionObserver is supported
            if (!('IntersectionObserver' in window)) {
                // Fallback for older browsers
                this.fallbackAnimations();
                return;
            }
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        
                        // Trigger skill animations when about text comes into view
                        if (entry.target.classList.contains('about__text')) {
                            this.triggerSkillAnimations();
                        }
                        
                        // Trigger feature stagger animations
                        if (entry.target.classList.contains('about__features')) {
                            this.triggerFeatureAnimations();
                        }
                        
                        // Stop observing once animated
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            });
            
            // Elements to observe
            const elementsToObserve = document.querySelectorAll([
                '.about__text',
                '.about__profile', 
                '.about__features',
                '.feature'
            ].join(', '));
            
            elementsToObserve.forEach(el => {
                if (el) observer.observe(el);
            });
        }
        
        triggerSkillAnimations() {
            const skills = document.querySelectorAll('.skill__progress');
            skills.forEach((skill, index) => {
                setTimeout(() => {
                    const targetWidth = skill.dataset.targetWidth;
                    if (targetWidth) {
                        skill.style.width = targetWidth;
                    }
                }, index * 200);
            });
        }
        
        triggerFeatureAnimations() {
            const features = document.querySelectorAll('.feature');
            features.forEach((feature, index) => {
                setTimeout(() => {
                    feature.classList.add('animate-in');
                }, index * 150);
            });
        }
        
        fallbackAnimations() {
            // Immediate animations for browsers without IntersectionObserver
            const allElements = document.querySelectorAll([
                '.about__text',
                '.about__profile',
                '.about__features',
                '.feature'
            ].join(', '));
            
            allElements.forEach(el => {
                if (el) el.classList.add('animate-in');
            });
            
            // Trigger skills immediately
            setTimeout(() => {
                this.triggerSkillAnimations();
            }, 500);
        }
        
        // Public method to reset animations (useful for SPA or dynamic content)
        reset() {
            const elementsToReset = document.querySelectorAll([
                '.about__text',
                '.about__profile',
                '.about__features',
                '.feature'
            ].join(', '));
            
            elementsToReset.forEach(el => {
                if (el) el.classList.remove('animate-in');
            });
            
            this.prepareSkills();
        }
        
        // Public method to trigger animations manually
        trigger() {
            if (!this.isInitialized) {
                console.warn('About animations not initialized yet');
                return;
            }
            
            const elementsToAnimate = document.querySelectorAll([
                '.about__text',
                '.about__profile',
                '.about__features'
            ].join(', '));
            
            elementsToAnimate.forEach(el => {
                if (el) el.classList.add('animate-in');
            });
            
            this.triggerSkillAnimations();
            this.triggerFeatureAnimations();
        }
    }
    
    // Utility functions
    const Utils = {
        // Debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Check if element is in viewport
        isInViewport: function(element) {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };
    
    // Initialize when DOM is ready
    let aboutAnimations;
    
    function initAboutAnimations() {
        aboutAnimations = new AboutAnimations();
    }
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAboutAnimations);
    } else {
        initAboutAnimations();
    }
    
    // Handle page visibility changes (for performance)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.style.setProperty('--animation-play-state', 'paused');
        } else {
            // Resume animations when tab becomes visible
            document.body.style.setProperty('--animation-play-state', 'running');
        }
    });
    
    // Expose to global scope for manual control (optional)
    window.AboutAnimations = {
        reset: () => aboutAnimations?.reset(),
        trigger: () => aboutAnimations?.trigger(),
        instance: () => aboutAnimations
    };
    
    // Performance optimization: reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        document.documentElement.style.setProperty('--reduced-motion', '1');
    }
    
})();