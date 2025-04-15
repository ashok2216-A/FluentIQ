// Main application controller
import { initDiagnosticTest } from './diagnostic-test.js';
import { initSpeakingPractice } from './speaking-practice.js';
import { initWritingAssistant } from './writing-assistant.js';
import { initListeningPractice } from './listening-practice.js';
import { initReadingComprehension } from './reading-comprehension.js';
import { initAdaptiveQuizzes } from './adaptive-quiz.js';
import { initProgressDashboard } from './progress-dashboard.js';

class LanguageTutorApp {
    constructor() {
        this.initEventListeners();
        this.initThemeToggle();
        this.initMobileMenu();
        this.initMobileNavigation();
    }

    initEventListeners() {
        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-item');
        
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');

                // Get module name from data attribute
                const moduleName = button.dataset.module;

                // Close mobile sidebar when a nav item is clicked
                const sidebar = document.querySelector('.app-sidebar');
                if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }

                // Call corresponding module initialization
                this.loadModule(moduleName);
            });
        });

        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                // Start diagnostic test when CTA button is clicked
                const diagnosticButton = document.querySelector('[data-module="diagnostic-test"]');
                if (diagnosticButton) {
                    diagnosticButton.click();
                }
            });
        }
    }

    loadModule(moduleName) {
        // Update active state on mobile navigation
        const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
        mobileNavButtons.forEach(btn => {
            if (btn.dataset.module === moduleName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Call corresponding module initialization
        switch(moduleName) {
            case 'diagnostic-test':
                initDiagnosticTest();
                break;
            case 'speaking-practice':
                initSpeakingPractice();
                break;
            case 'writing-assistant':
                initWritingAssistant();
                break;
            case 'listening-practice':
                initListeningPractice();
                break;
            case 'reading-comprehension':
                initReadingComprehension();
                break;
            case 'adaptive-quiz':
                initAdaptiveQuizzes();
                break;
            case 'progress-dashboard':
                initProgressDashboard();
                break;
            default:
                console.warn('Unknown module:', moduleName);
        }
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        }
        
        // Set initial toggle icons
        themeToggle.innerHTML = `
            <div class="toggle-icon">
                <i class="fas fa-moon"></i>
                <i class="fas fa-sun"></i>
            </div>
        `;
        
        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
            
            // Add animation effect
            themeToggle.classList.add('animate-toggle');
            setTimeout(() => {
                themeToggle.classList.remove('animate-toggle');
            }, 300);
        });
    }

    initMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.querySelector('.app-sidebar');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                
                // Update icon
                if (sidebar.classList.contains('active')) {
                    mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
            
            // Close sidebar when clicking outside of it
            document.addEventListener('click', (event) => {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(event.target) && 
                    !mobileMenuToggle.contains(event.target) && 
                    sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    }

    initMobileNavigation() {
        const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
        const navItems = document.querySelectorAll('.nav-item');
        
        // Set initial active state based on current page
        const currentModule = this.getCurrentModule();
        mobileNavButtons.forEach(btn => {
            if (btn.dataset.module === currentModule) {
                btn.classList.add('active');
            }
        });
        
        mobileNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                mobileNavButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get module name from data attribute
                const moduleName = button.dataset.module;
                
                // Update sidebar nav active state
                navItems.forEach(item => {
                    if (item.dataset.module === moduleName) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                
                // Load the module
                this.loadModule(moduleName);
            });
        });
    }
    
    getCurrentModule() {
        // Try to determine current module from active nav item
        const activeNavItem = document.querySelector('.nav-item.active');
        if (activeNavItem) {
            return activeNavItem.dataset.module;
        }
        
        // Default to dashboard if no active item found
        return 'dashboard';
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageTutorApp();
});
