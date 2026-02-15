/**
 * Main JavaScript for Futuristic Space Travel Website
 * 
 * Features:
 * - GSAP scroll animations and reveals
 * - Smooth scroll navigation
 * - Interactive form handling
 * - Lazy image loading
 * - Mobile menu functionality
 * - Performance optimizations
 */

class SpaceTravelApp {
    constructor() {
        this.isInitialized = false;
        this.intersectionObserver = null;
        this.lazyImages = [];
        this.galleryImages = [
            'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop&auto=format', // Milky Way galaxy
            'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&h=400&fit=crop&auto=format', // Nebula in space
            'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=400&fit=crop&auto=format', // Earth from space
            'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&h=400&fit=crop&auto=format', // Spiral galaxy
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop&auto=format', // Astronaut in space
            'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&h=400&fit=crop&auto=format'  // Cosmic nebula
        ];
        
        this.init();
    }
    
    init() {
        this.waitForDependencies(() => {
            this.setupGSAP();
            this.setupScrollAnimations();
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupGallery();
            this.setupContactForm();
            this.setupLazyLoading();
            this.setupInteractiveElements();
            this.setupPerformanceOptimizations();
            
            console.log('🚀 SpaceTravelApp initialized successfully!');
            this.isInitialized = true;
        });
    }
    
    waitForDependencies(callback, attempts = 0) {
        const maxAttempts = 50; // 5 seconds max wait
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            callback();
        } else if (attempts < maxAttempts) {
            setTimeout(() => this.waitForDependencies(callback, attempts + 1), 100);
        } else {
            console.error('❌ GSAP dependencies not loaded within timeout period');
        }
    }
    
    setupGSAP() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Set default ease
        gsap.defaults({
            ease: "power2.inOut",
            duration: 1
        });
        
        console.log('✅ GSAP initialized');
    }
    
    setupScrollAnimations() {
        // Hero title animation
        gsap.fromTo('.hero-title', 
            { 
                opacity: 0, 
                y: 100,
                scale: 0.8
            },
            { 
                opacity: 1, 
                y: 0,
                scale: 1,
                duration: 1.5,
                ease: "back.out(1.7)"
            }
        );
        
        // Hero subtitle animation
        gsap.fromTo('.hero-subtitle', 
            { 
                opacity: 0, 
                y: 50 
            },
            { 
                opacity: 1, 
                y: 0,
                duration: 1,
                delay: 0.5
            }
        );
        
        // CTA button animation
        gsap.fromTo('.cta-button', 
            { 
                opacity: 0, 
                scale: 0.8 
            },
            { 
                opacity: 1, 
                scale: 1,
                duration: 0.8,
                delay: 1,
                ease: "back.out(1.7)"
            }
        );
        
        // About section animations
        gsap.fromTo('.about-image', 
            { 
                opacity: 0, 
                x: -100,
                rotation: -5
            },
            {
                opacity: 1,
                x: 0,
                rotation: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: '.about-image',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        gsap.fromTo('.about-content', 
            { 
                opacity: 0, 
                x: 100 
            },
            {
                opacity: 1,
                x: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: '.about-content',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Statistics counter animation
        this.animateCounters();
        
        // Destination cards stagger animation
        gsap.fromTo('.destination-card', 
            { 
                opacity: 0, 
                y: 80,
                scale: 0.8
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: '#destinations',
                    start: 'top 70%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Gallery reveal animation
        gsap.fromTo('.gallery-item', 
            { 
                opacity: 0, 
                scale: 0.8,
                rotation: 5
            },
            {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '#gallery',
                    start: 'top 70%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        // Contact form animation
        gsap.fromTo('#contact-form', 
            { 
                opacity: 0, 
                y: 50 
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: '#contact-form',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
        
        console.log('✨ Scroll animations set up');
    }
    
    animateCounters() {
        const stats = [
            { element: '.stat-item:nth-child(1) .text-2xl', target: 500, suffix: '+' },
            { element: '.stat-item:nth-child(2) .text-2xl', target: 99.9, suffix: '%' },
            { element: '.stat-item:nth-child(3) .text-2xl', target: 24, suffix: '/7' }
        ];
        
        stats.forEach(stat => {
            ScrollTrigger.create({
                trigger: stat.element,
                start: 'top 80%',
                onEnter: () => {
                    const element = document.querySelector(stat.element);
                    if (element) {
                        gsap.fromTo({ value: 0 }, 
                            { 
                                value: stat.target,
                                duration: 2,
                                ease: "power2.out",
                                onUpdate: function() {
                                    const value = this.targets()[0].value;
                                    element.textContent = Math.round(value * 10) / 10 + stat.suffix;
                                }
                            }
                        );
                    }
                }
            });
        });
    }
    
    setupNavigation() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        });
        
        // Navigation background opacity on scroll
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: {
                className: 'scrolled',
                targets: 'nav'
            }
        });
        
        console.log('🧭 Navigation set up');
    }
    
    setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = menuBtn.querySelector('i');
        
        let isMenuOpen = false;
        
        menuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // Open menu
                gsap.fromTo(mobileMenu, 
                    { height: 0, opacity: 0 },
                    { 
                        height: 'auto', 
                        opacity: 1, 
                        duration: 0.3, 
                        ease: "power2.out",
                        onStart: () => mobileMenu.classList.remove('hidden')
                    }
                );
                menuIcon.className = 'fas fa-times';
            } else {
                // Close menu
                gsap.to(mobileMenu, {
                    height: 0, 
                    opacity: 0, 
                    duration: 0.3, 
                    ease: "power2.in",
                    onComplete: () => mobileMenu.classList.add('hidden')
                });
                menuIcon.className = 'fas fa-bars';
            }
        });
        
        // Close menu when clicking on links
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                setTimeout(() => {
                    isMenuOpen = false;
                    gsap.to(mobileMenu, {
                        height: 0, 
                        opacity: 0, 
                        duration: 0.3,
                        onComplete: () => mobileMenu.classList.add('hidden')
                    });
                    menuIcon.className = 'fas fa-bars';
                }, 500);
            }
        });
        
        console.log('📱 Mobile menu set up');
    }
    
    setupGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        
        this.galleryImages.forEach((imageUrl, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item relative overflow-hidden rounded-xl group cursor-pointer';
            galleryItem.innerHTML = `
                <img src="${imageUrl}" 
                     alt="Space Gallery Image ${index + 1}" 
                     class="w-full h-64 object-cover rounded-2xl shadow-2xl hover:scale-105 transform transition-transform duration-500 lazy-image"
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=400&fit=crop&auto=format'">
                <div class="gallery-overlay absolute inset-0 bg-gradient-to-t from-cosmic-purple/80 via-transparent to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                    <i class="fas fa-expand text-white text-2xl drop-shadow-lg"></i>
                </div>
            `;
            
            // Add click handler for lightbox effect
            galleryItem.addEventListener('click', () => this.openLightbox(imageUrl, index));
            
            galleryGrid.appendChild(galleryItem);
        });
        
        console.log('🖼️ Gallery set up with', this.galleryImages.length, 'images');
    }
    
    openLightbox(imageUrl, index) {
        const lightbox = document.createElement('div');
        lightbox.className = 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4';
        // Use Andromeda galaxy image for lightbox
        const andromedaUrl = 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1200&h=800&fit=crop&auto=format';
        lightbox.innerHTML = `
            <div class="relative max-w-4xl max-h-full">
                <img src="${andromedaUrl}" 
                     alt="Andromeda Galaxy" 
                     class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                     onerror="this.src='https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=800&fit=crop&auto=format'">
                <button class="absolute top-4 right-4 text-white text-2xl hover:text-neon-cyan transition-colors bg-black/50 rounded-full p-2">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Animation
        gsap.fromTo(lightbox, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );
        
        // Close lightbox
        const closeBtn = lightbox.querySelector('button');
        const closeLightbox = () => {
            gsap.to(lightbox, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => document.body.removeChild(lightbox)
            });
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // ESC key to close
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    setupContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // Validate form
            if (!this.validateForm(data)) {
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<div class="loading-spinner"></div>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                this.showSuccessMessage();
                form.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 2000);
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        console.log('📧 Contact form set up');
    }
    
    validateForm(data) {
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'Please enter a valid name');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        switch (field.name) {
            case 'name':
                if (value.length < 2) {
                    this.showFieldError(field.name, 'Name must be at least 2 characters');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showFieldError(field.name, 'Please enter a valid email');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    this.showFieldError(field.name, 'Message must be at least 10 characters');
                    return false;
                }
                break;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        let errorDiv = field.parentNode.querySelector('.field-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-red-400 text-sm mt-1';
            field.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        field.style.borderColor = '#EF4444';
    }
    
    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }
    
    showSuccessMessage() {
        const form = document.getElementById('contact-form');
        let successDiv = form.querySelector('.success-message');
        
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `
                <i class="fas fa-check-circle mr-2"></i>
                Your message has been sent successfully! We'll get back to you soon.
            `;
            form.appendChild(successDiv);
        }
        
        successDiv.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => successDiv.remove(), 300);
        }, 5000);
    }
    
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src || img.dataset.src;
                    img.classList.remove('lazy-image');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
        
        console.log('🖼️ Lazy loading set up for', lazyImages.length, 'images');
    }
    
    setupInteractiveElements() {
        // Destination cards hover effects
        document.querySelectorAll('.destination-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        // CTA button interactions
        document.querySelectorAll('.cta-button, .destination-card button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        console.log('⚡ Interactive elements set up');
    }
    
    setupPerformanceOptimizations() {
        // Preload critical images
        const criticalImages = [
            'https://images.unsplash.com/photo-1580428180121-22d88b1e6e03',
            'https://images.unsplash.com/photo-1581091012184-5c9afc8d1f3b'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
        
        // Reduce motion for accessibility
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.globalTimeline.timeScale(0.1);
        }
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Page loaded in ${loadTime}ms`);
            });
        }
        
        console.log('🚀 Performance optimizations applied');
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    nav.scrolled {
        background: rgba(11, 20, 38, 0.95) !important;
        backdrop-filter: blur(20px);
    }
`;
document.head.appendChild(style);

// Initialize the application
let spaceApp;

function initSpaceApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            spaceApp = new SpaceTravelApp();
        });
    } else {
        spaceApp = new SpaceTravelApp();
    }
}

// Start the application
initSpaceApp();