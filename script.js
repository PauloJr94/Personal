// Configurações e variáveis globais
const CONFIG = {
    ANIMATION_DURATION: 300,
    SCROLL_OFFSET: 100,
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024
};

// Utilitários
const Utils = {
    // Debounce function para otimizar eventos de scroll/resize
    debounce(func, wait) {
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

    // Throttle function para eventos que precisam ser executados regularmente
    throttle(func, limit) {
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
    },

    // Verificar se elemento está visível na viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll para âncoras
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - CONFIG.SCROLL_OFFSET;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },

    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validar telefone brasileiro
    isValidPhone(phone) {
        const phoneRegex = /^(\(\d{2}\)|\d{2})\s?9?\d{4}-?\d{4}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    // Formatar telefone para WhatsApp
    formatPhoneForWhatsApp(phone) {
        return phone.replace(/\D/g, '');
    }
};

// Gerenciador de navegação
class NavigationManager {
    constructor() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleMobileMenu();
        this.handleSmoothScroll();
        this.handleActiveLink();
        
        // Event listeners
        window.addEventListener('scroll', Utils.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', Utils.debounce(this.handleResize.bind(this), 250));
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Header background effect
        if (scrollY > 50) {
            this.header.style.background = 'rgba(255, 255, 255, 0.98)';
            this.header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.header.style.background = 'rgba(255, 255, 255, 0.95)';
            this.header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }

        // Update active navigation link
        this.updateActiveLink();
    }

    handleMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    Utils.smoothScrollTo(href);
                }
            });
        });
    }

    handleActiveLink() {
        this.updateActiveLink();
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + CONFIG.SCROLL_OFFSET;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleResize() {
        if (window.innerWidth > CONFIG.TABLET_BREAKPOINT) {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Gerenciador de animações
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.animateHeroElements();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Observar elementos que devem ser animados
        const animatedElements = document.querySelectorAll(
            '.service-card, .step-card, .contact-card, .section-header'
        );

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            observer.observe(element);
        });
    }

    animateElement(element) {
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    animateCounters() {
        // Implementar animação de contadores se necessário no futuro
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += step;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    animateHeroElements() {
        const heroImg = document.querySelector('.hero-img');
        const heroData = document.querySelector('.hero-data');

        if (heroImg && heroData) {
            setTimeout(() => {
                heroImg.style.opacity = '1';
                heroImg.style.transform = 'translateX(0)';
            }, 200);

            setTimeout(() => {
                heroData.style.opacity = '1';
                heroData.style.transform = 'translateX(0)';
            }, 400);
        }
    }
}

// Gerenciador de formulários
class FormManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.handleFormSubmission();
            this.handleFormValidation();
            this.handleInputFormatting();
        }
    }

    handleFormSubmission() {
        this.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(this.contactForm);
            const data = Object.fromEntries(formData);
            
            if (this.validateForm(data)) {
                await this.submitForm(data);
            }
        });
    }

    validateForm(data) {
        const errors = [];

        // Validar nome
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        // Validar email
        if (!data.email || !Utils.isValidEmail(data.email)) {
            errors.push('Email inválido');
        }

        // Validar telefone
        if (!data.phone || !Utils.isValidPhone(data.phone)) {
            errors.push('Telefone inválido');
        }

        // Validar objetivo
        if (!data.goal) {
            errors.push('Selecione seu objetivo');
        }

        if (errors.length > 0) {
            this.showErrors(errors);
            return false;
        }

        return true;
    }

    async submitForm(data) {
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Mostrar loading
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            // Simular envio - aqui você integraria com seu backend
            await this.simulateFormSubmission(data);
            
            // Redirecionar para WhatsApp com dados pré-preenchidos
            this.redirectToWhatsApp(data);
            
            // Mostrar sucesso
            this.showSuccess();
            this.contactForm.reset();
            
        } catch (error) {
            this.showError('Erro ao enviar formulário. Tente novamente.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    async simulateFormSubmission(data) {
        // Simular delay de rede
        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }

    redirectToWhatsApp(data) {
        const phone = '558781326009'; // Número do personal trainer
        const message = `Olá! Preenchi o formulário no site com os seguintes dados:
        
Nome: ${data.name}
Email: ${data.email}
Telefone: ${data.phone}
Objetivo: ${data.goal}
${data.message ? `Mensagem: ${data.message}` : ''}

Gostaria de saber mais sobre os treinos personalizados!`;

        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    handleFormValidation() {
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                isValid = Utils.isValidEmail(value);
                errorMessage = 'Email inválido';
                break;
            case 'tel':
                isValid = Utils.isValidPhone(value);
                errorMessage = 'Telefone inválido';
                break;
            default:
                if (field.required && !value) {
                    isValid = false;
                    errorMessage = 'Campo obrigatório';
                }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleInputFormatting() {
        const phoneInput = this.contactForm.querySelector('input[name="phone"]');
        
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                
                if (value.length > 6) {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d+)/, '($1) $2');
                }
                
                e.target.value = value;
            });
        }
    }

    showErrors(errors) {
        const errorContainer = this.createErrorContainer();
        errorContainer.innerHTML = `
            <div class="error-message">
                <strong>Corrija os seguintes erros:</strong>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        
        this.contactForm.prepend(errorContainer);
        
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }

    showError(message) {
        const errorContainer = this.createErrorContainer();
        errorContainer.innerHTML = `
            <div class="error-message">
                ${message}
            </div>
        `;
        
        this.contactForm.prepend(errorContainer);
        
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }

    showSuccess() {
        const successContainer = document.createElement('div');
        successContainer.className = 'success-container';
        successContainer.innerHTML = `
            <div class="success-message">
                <strong>✅ Formulário enviado com sucesso!</strong>
                <p>Você será redirecionado para o WhatsApp para continuar a conversa.</p>
            </div>
        `;
        
        successContainer.style.cssText = `
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
        `;
        
        this.contactForm.prepend(successContainer);
        
        setTimeout(() => {
            successContainer.remove();
        }, 5000);
    }

    createErrorContainer() {
        const existingError = this.contactForm.querySelector('.error-container');
        if (existingError) {
            existingError.remove();
        }
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-container';
        errorContainer.style.cssText = `
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        `;
        
        return errorContainer;
    }
}

// Gerenciador de performance
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeScrollPerformance();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    preloadCriticalResources() {
        // Preload fontes críticas
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }

    optimizeScrollPerformance() {
        // Usar passive listeners para melhor performance
        const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
        
        passiveEvents.forEach(event => {
            document.addEventListener(event, () => {}, { passive: true });
        });
    }
}

// Gerenciador de acessibilidade
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.handleKeyboardNavigation();
        this.handleFocusManagement();
        this.handleARIA();
        this.handleReducedMotion();
    }

    handleKeyboardNavigation() {
        // Navegação por teclado para menu mobile
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navToggle.click();
            }
        });

        // Escape para fechar menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.focus();
            }
        });
    }

    handleFocusManagement() {
        // Manter foco dentro do menu quando aberto
        const navMenu = document.getElementById('nav-menu');
        const focusableElements = navMenu.querySelectorAll('a, button, input, select, textarea');
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }

    handleARIA() {
        // Adicionar atributos ARIA necessários
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'nav-menu');
        navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        
        // Atualizar ARIA quando menu abre/fecha
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = navMenu.classList.contains('active');
                    navToggle.setAttribute('aria-expanded', isActive.toString());
                    navToggle.setAttribute('aria-label', isActive ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
                }
            });
        });
        
        observer.observe(navMenu, { attributes: true });
    }

    handleReducedMotion() {
        // Respeitar preferência de movimento reduzido
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
    }
}

// Inicialização da aplicação
class App {
    constructor() {
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeManagers();
            });
        } else {
            this.initializeManagers();
        }
    }

    initializeManagers() {
        // Inicializar todos os gerenciadores
        new NavigationManager();
        new AnimationManager();
        new FormManager();
        new PerformanceManager();
        new AccessibilityManager();
        
        // Adicionar event listeners globais
        this.addGlobalEventListeners();
        
        console.log('🚀 Site Personal Trainer MFIT carregado com sucesso!');
    }

    addGlobalEventListeners() {
        // Service Worker para PWA (se implementado no futuro)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // navigator.serviceWorker.register('/sw.js');
            });
        }

        // Monitorar erros JavaScript
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
        });

        // Monitorar promessas rejeitadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }
}


// Inicializar aplicação
new App();

// ===== SEÇÃO 1: DÚVIDAS E DICAS (FAQ) =====
class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleFAQ(item));
        });

        // Fechar outros FAQs quando um for aberto (accordion behavior)
        this.setupAccordionBehavior();
    }

    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        if (isActive) {
            item.classList.remove('active');
        } else {
            // Fechar outros FAQs abertos
            this.faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Abrir o FAQ clicado
            item.classList.add('active');
        }
    }

    setupAccordionBehavior() {
        // Adicionar suporte para navegação por teclado
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFAQ(item);
                }
            });
            
            // Tornar focável
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
        });
    }
}

// ===== SEÇÃO 2: CARROSSEL DE TRANSFORMAÇÕES =====
class TransformationsCarousel {
    constructor() {
        this.carousel = document.getElementById('transformationsCarousel');
        this.track = this.carousel?.querySelector('.carousel-track');
        this.cards = this.carousel?.querySelectorAll('.transformation-card');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        
        this.currentSlide = 0;
        this.totalSlides = this.cards?.length || 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        
        if (this.carousel) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupTouchEvents();
        this.setupKeyboardNavigation();
        this.startAutoplay();
        this.updateCarousel();
    }

    setupEventListeners() {
        // Botões de navegação
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pausar autoplay no hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoplay();
        });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            isDragging = false;
            this.startAutoplay();
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isCarouselInView()) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
            }
        });
    }

    isCarouselInView() {
        const rect = this.carousel.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    nextSlide() {
        this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        // Atualizar posição do track
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;

        // Atualizar cards ativas
        this.cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentSlide);
        });

        // Atualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// ===== SEÇÃO 3: ANIMAÇÕES DOS DEPOIMENTOS =====
class TestimonialsAnimations {
    constructor() {
        this.testimonialCards = document.querySelectorAll('.testimonial-card');
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Adicionar delay escalonado para efeito cascata
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.testimonialCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    }

    setupHoverEffects() {
        this.testimonialCards.forEach(card => {
            const avatar = card.querySelector('.testimonial-avatar');
            
            card.addEventListener('mouseenter', () => {
                if (avatar) {
                    avatar.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (avatar) {
                    avatar.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
}

// ===== UTILITÁRIOS PARA TODAS AS SEÇÕES =====
class SectionsUtils {
    static smoothScrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    static addScrollRevealAnimation(elements, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                    observer.unobserve(entry.target);
                }
            });
        }, defaultOptions);

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    static formatWhatsAppMessage(baseMessage, additionalInfo = '') {
        const message = `${baseMessage} ${additionalInfo}`.trim();
        return encodeURIComponent(message);
    }
}

// ===== INICIALIZAÇÃO DAS SEÇÕES =====
class NewSectionsManager {
    constructor() {
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Inicializar FAQ
        new FAQManager();
        
        // Inicializar Carrossel de Transformações
        new TransformationsCarousel();
        
        // Inicializar Animações dos Depoimentos
        new TestimonialsAnimations();
        
        // Adicionar animações de scroll reveal para elementos das novas seções
        const elementsToAnimate = document.querySelectorAll(
            '.faq-item, .tip-card, .testimonial-card'
        );
        
        if (elementsToAnimate.length > 0) {
            SectionsUtils.addScrollRevealAnimation(elementsToAnimate);
        }
        
        console.log('✅ Novas seções (FAQ, Transformações e Depoimentos) carregadas com sucesso!');
    }
}

// Inicializar as novas seções
new NewSectionsManager();