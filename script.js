// script.js (Fixed Mobile Navigation Version)
// Global Variables
let stories = JSON.parse(localStorage.getItem('stories')) || [];
let currentRating = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadStories();
});

// Initialize Application
function initializeApp() {
    // Initialize carousel if exists
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        initializeCarousel();
    }
    
    // Initialize gallery scroll if exists
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (galleryScroll) {
        initializeGalleryScroll();
    }
    
    // Initialize reading progress if exists
    const storyContent = document.querySelector('.story-content');
    if (storyContent) {
        initializeReadingProgress();
    }
    
    // Initialize star rating if exists
    const stars = document.querySelectorAll('.star');
    if (stars.length > 0) {
        initializeStarRating();
    }
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup Event Listeners - FIXED MOBILE NAVIGATION
function setupEventListeners() {
    // Mobile menu toggle - FIXED VERSION
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            navLinks.classList.toggle('active');
            
            // Toggle menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking on links - FIXED
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const icon = mobileMenuBtn?.querySelector('i');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside - FIXED
    document.addEventListener('click', (e) => {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks && mobileMenuBtn && 
            !navLinks.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) &&
            navLinks.classList.contains('active')) {
            
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Close mobile menu on window resize (if resizing to larger screen)
    window.addEventListener('resize', () => {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Character counter for textarea
        const textarea = contactForm.querySelector('textarea');
        const charCounter = contactForm.querySelector('.char-counter');
        if (textarea && charCounter) {
            textarea.addEventListener('input', function() {
                const length = this.value.length;
                charCounter.textContent = `${length}/1000`;
                
                if (length > 900) {
                    charCounter.style.color = '#ff6b6b';
                } else if (length > 700) {
                    charCounter.style.color = '#ffa726';
                } else {
                    charCounter.style.color = '#ccc';
                }
            });
        }
    }
}

// Story Management
function loadStories() {
    const galleryScroll = document.querySelector('.gallery-scroll');
    
    // Initialize default stories if none exist
    if (stories.length === 0) {
        stories = [
            {
                id: 1,
                title: "Emotional Story",
                description: "A touching story about love and loss",
                facebookUrl: "https://facebook.com/yourpage/posts/123456789",
                image: "assets/DP.jpg"
            },
            {
                id: 2,
                title: "Inspirational Journey",
                description: "Finding strength in difficult times",
                facebookUrl: "https://facebook.com/yourpage/posts/987654321",
                image: "assets/DP.jpg"
            },
            {
                id: 3,
                title: "Love in Silence",
                description: "Sometimes the loudest love speaks in whispers",
                facebookUrl: "https://facebook.com/yourpage/posts/456789123",
                image: "assets/DP.jpg"
            }
        ];
        localStorage.setItem('stories', JSON.stringify(stories));
    }
    
    // Load stories in gallery
    if (galleryScroll) {
        renderStoryGallery();
    }
}

function renderStoryGallery() {
    const galleryScroll = document.querySelector('.gallery-scroll');
    if (!galleryScroll) return;

    if (stories.length === 0) {
        galleryScroll.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>No Stories Yet</h3>
                <p>Check back soon for amazing stories!</p>
            </div>
        `;
        return;
    }

    galleryScroll.innerHTML = stories.map(story => `
        <div class="story-card">
            <div class="story-image" onclick="openFacebookStory('${story.facebookUrl}')">
                <img src="${story.image || 'assets/default-story.jpg'}" alt="${story.title}" onerror="this.src='assets/DP.jpg'">
                <div class="story-overlay">
                    <div class="sinhala-text">${story.title}</div>
                    <div class="english-text">${story.description}</div>
                </div>
                <div class="facebook-badge">
                    <i class="fab fa-facebook-f"></i>
                    <span>Read on Facebook</span>
                </div>
            </div>
            <button class="story-button" onclick="openFacebookStory('${story.facebookUrl}')">
                <i class="fab fa-facebook"></i>
                Read Full Story on Facebook
            </button>
            <div class="engagement-stats">
                <div class="stat">
                    <i class="fas fa-eye"></i>
                    <span>Join the conversation</span>
                </div>
                <div class="stat">
                    <i class="fas fa-heart"></i>
                    <span>Like & Comment</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Open Facebook Story
function openFacebookStory(facebookUrl) {
    // Track click (optional - for analytics)
    trackStoryClick(facebookUrl);
    
    // Open Facebook post in new tab
    window.open(facebookUrl, '_blank');
    
    // Show notification
    showNotification('Opening story on Facebook...', 'facebook');
}

// Track story engagement (optional)
function trackStoryClick(facebookUrl) {
    // You can add analytics here
    console.log('Story clicked:', facebookUrl);
    
    // Example: Increment click count in localStorage
    let storyClicks = JSON.parse(localStorage.getItem('storyClicks')) || {};
    const storyId = facebookUrl.split('/').pop();
    storyClicks[storyId] = (storyClicks[storyId] || 0) + 1;
    localStorage.setItem('storyClicks', JSON.stringify(storyClicks));
}

// Carousel Functionality
function initializeCarousel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    function showSlide(index) {
        const carousel = document.querySelector('.carousel');
        if (!carousel || slides.length === 0) return;
        
        currentSlide = (index + slides.length) % slides.length;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Auto-advance carousel
    const carouselInterval = setInterval(() => {
        if (slides.length > 0) {
            showSlide(currentSlide + 1);
        }
    }, 5000);
    
    // Dot click events
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });
    
    // Pause carousel on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            clearInterval(carouselInterval);
            setInterval(() => {
                if (slides.length > 0) {
                    showSlide(currentSlide + 1);
                }
            }, 5000);
        });
    }
}

// Gallery Scroll Functionality
function initializeGalleryScroll() {
    const galleryScroll = document.querySelector('.gallery-scroll');
    const scrollLeft = document.querySelector('.scroll-left');
    const scrollRight = document.querySelector('.scroll-right');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    if (!galleryScroll) return;
    
    function updateScrollProgress() {
        const scrollable = galleryScroll.scrollWidth - galleryScroll.clientWidth;
        const scrolled = galleryScroll.scrollLeft;
        const progress = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }
    }
    
    if (scrollLeft) {
        scrollLeft.addEventListener('click', () => {
            galleryScroll.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }
    
    if (scrollRight) {
        scrollRight.addEventListener('click', () => {
            galleryScroll.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
    
    galleryScroll.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();
}

// Reading Progress Functionality
function initializeReadingProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const storyContent = document.querySelector('.story-content');
    
    if (!progressBar || !storyContent) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    });
}

// Star Rating Functionality
function initializeStarRating() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            currentRating = index + 1;
            updateStars();
            sendRatingToWhatsApp(currentRating);
        });
        
        star.addEventListener('mouseover', () => {
            highlightStars(index);
        });
    });
    
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', () => {
            updateStars();
        });
    }
}

function highlightStars(index) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, i) => {
        star.classList.toggle('active', i <= index);
    });
}

function updateStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, i) => {
        star.classList.toggle('active', i < currentRating);
    });
}

function sendRatingToWhatsApp(rating) {
    const phoneNumber = '+94781689772';
    const message = `I rate your stories ${rating} stars! 🌟`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    showNotification(`Thank you for your ${rating}-star rating!`, 'success');
}

// Social Media Functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/share/1Bi9KiT2jk/`, '_blank');
}

function shareOnTikTok() {
    window.open('https://www.tiktok.com/@lucy_official44?_t=ZS-90YkAiy2Kw6&_r=1', '_blank');
}

function contactOnWhatsApp() {
    const phoneNumber = '+94781689772';
    const message = 'Hello! I would like to get in touch with you about StoryTeller.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    showNotification('Opening WhatsApp...', 'whatsapp');
}

// Contact Form Handling - WhatsApp Integration
function handleContactSubmit(e) {
    e.preventDefault();
    const messageInput = document.getElementById('feedbackMessage');
    const message = messageInput ? messageInput.value : '';
    
    if (!message.trim()) {
        showNotification('Please enter your message', 'error');
        return;
    }
    
    // Send message via WhatsApp
    sendMessageToWhatsApp(message);
}

function sendMessageToWhatsApp(message) {
    const phoneNumber = '+94781689772';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success notification
    showNotification('Opening WhatsApp to send your message...', 'success');
    
    // Clear the form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.reset();
    }
    
    // Reset character counter
    const charCounter = document.querySelector('.char-counter');
    if (charCounter) {
        charCounter.textContent = '0/1000';
        charCounter.style.color = '#ccc';
    }
}

// WhatsApp Integration Functions
function quickWhatsAppMessage(predefinedMessage) {
    const phoneNumber = '+94781689772';
    const encodedMessage = encodeURIComponent(predefinedMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Opening WhatsApp with your message...', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = '';
    if (type === 'facebook') {
        icon = '<i class="fab fa-facebook" style="margin-right: 8px;"></i>';
        notification.style.background = 'linear-gradient(135deg, #1877F2, #0D5CB6)';
    } else if (type === 'whatsapp') {
        icon = '<i class="fab fa-whatsapp" style="margin-right: 8px;"></i>';
        notification.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
    } else if (type === 'success') {
        icon = '<i class="fas fa-check" style="margin-right: 8px;"></i>';
        notification.style.background = 'linear-gradient(135deg, #00b894, #00a085)';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>';
        notification.style.background = 'linear-gradient(135deg, #ff7675, #e84393)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #0033FF, #0066FF)';
    }

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${icon}${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Add close event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
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

// Export functions for global access
window.openFacebookStory = openFacebookStory;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTikTok = shareOnTikTok;
window.contactOnWhatsApp = contactOnWhatsApp;
window.quickWhatsAppMessage = quickWhatsAppMessage;
