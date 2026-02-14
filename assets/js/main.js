document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    const state = {
        lang: localStorage.getItem('svps_lang') || 'en',
        translations: {}
    };

    // --- DOM Elements ---
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const admissionForm = document.getElementById('admission-form');

    // --- Initialization ---
    init();

    async function init() {
        // Load initial language
        await loadLanguage(state.lang);
        updateUI();

        // Setup Event Listeners
        setupEventListeners();

        // Setup Animations
        setupIntersectionObserver();
    }

    // --- Language Logic ---
    async function loadLanguage(lang) {
        try {
            const response = await fetch(`assets/lang/${lang}.json`);
            if (!response.ok) throw new Error('Failed to load language file');
            state.translations = await response.json();
            document.documentElement.lang = lang;
            localStorage.setItem('svps_lang', lang);
            state.lang = lang;
            applyTranslations();
        } catch (error) {
            console.error('Language load error:', error);
        }
    }

    function applyTranslations() {
        // Text Content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (state.translations[key]) {
                // If it's an input with placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    // el.placeholder = state.translations[key]; // Usually labels are better for access, but if placeholders exist
                } else {
                    el.textContent = state.translations[key];
                }
            }
        });

        // Update Toggle Text (Opposite of current)
        langText.textContent = state.lang === 'en' ? 'हिंदी' : 'English';

        // Font Adjustment for Hindi (optional, if needed specifically)
        if (state.lang === 'hi') {
            document.body.classList.add('lang-hi');
        } else {
            document.body.classList.remove('lang-hi');
        }
    }

    function toggleLanguage() {
        const newLang = state.lang === 'en' ? 'hi' : 'en';
        loadLanguage(newLang);
    }

    // --- UI Interactions ---
    function setupEventListeners() {
        // Language Toggle
        langToggleBtn.addEventListener('click', toggleLanguage);

        // Mobile Menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileNav.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when link is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });

        // Sticky Header Check
        window.addEventListener('scroll', () => {
            const header = document.getElementById('main-header');
            if (window.scrollY > 50) {
                header.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
            } else {
                header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            }
        });

        // Form Submission
        admissionForm.addEventListener('submit', handleFormSubmit);
    }

    function updateUI() {
        // Initial specific UI updates if any
    }

    // --- Form Handling ---
    async function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(admissionForm);
        const data = Object.fromEntries(formData.entries());

        // Basic Validation (HTML5 handles most)
        if (!data.child_name || !data.phone || !data.class_apply || !data.consent) {
            showNotification('Please fill in all required fields and accept the terms', 'error');
            return;
        }

        const btn = admissionForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = state.lang === 'en' ? 'Sending...' : 'भेजा जा रहा है...';
        btn.disabled = true;

        // Construct Payload
        const payload = {
            studentName: data.child_name,
            dob: data.dob,
            gender: "Not Specified", // Placeholder for backend compatibility
            parentName: data.parent_name,
            phone: data.phone,
            email: data.email,
            address: "Not Provided", // Placeholder for backend compatibility
            grade: data.class_apply
        };

        // API Endpoint Configuration
        // Update this URL after deploying the backend (e.g., to Vercel)
        const API_URL = 'http://localhost:3000/api/submit-admission';

        try {
            // const response = await fetch(API_URL, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(payload)
            // });

            // const result = await response.json();

            // if (!response.ok) {
            //     throw new Error(result.error || 'Submission failed');
            // }

            // Success
            showNotification(state.translations['success_message'] || 'Application Submitted Successfully!', 'success');
            admissionForm.reset();
            // console.log('Form submission result:', result);

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification(error.message || 'Error submitting form. Please try again.', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    // --- Notification System ---
    function showNotification(message, type = 'default') {
        const snackbar = document.getElementById('snackbar');
        if (!snackbar) return;

        snackbar.textContent = message;
        snackbar.className = 'show ' + type;

        setTimeout(() => {
            snackbar.className = snackbar.className.replace('show', '');
            // keep type until next show
        }, 3000);
    }

    // --- Animations ---
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing once visible? Or keep it? Usually better to stop.
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }
});
