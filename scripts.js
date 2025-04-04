// DOM Elements
const themeSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const toggleIcon = document.getElementById('toggle-icon');
const currentYear = document.getElementById('year');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

// Dark/Light Mode Toggle - Fixed version
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleIcon.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeSwitch.checked = true;
        toggleIcon.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeSwitch.checked = false;
        toggleIcon.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Event Listeners
themeSwitch.addEventListener('change', switchTheme);

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update URL without page jump
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
        }
    });
});

// Enhanced Contact Form with WebSQL Integration
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validation
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // WebSQL integration
        const db = openDatabase('PortfolioDB', '1.0', 'Portfolio Database', 2 * 1024 * 1024);

        db.transaction(function (tx) {
            // Create table if it doesn't exist
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, name TEXT, email TEXT, subject TEXT, message TEXT, date TEXT)'
            );

            // Insert form data into the table
            tx.executeSql(
                'INSERT INTO messages (name, email, subject, message, date) VALUES (?, ?, ?, ?, ?)',
                [name, email, subject, message, new Date().toISOString()],
                function () {
                    showFormMessage('Message saved successfully! I will get back to you soon.', 'success');
                    contactForm.reset();
                },
                function (tx, error) {
                    console.error('Error:', error);
                    showFormMessage('There was an error saving your message. Please try again later.', 'error');
                }
            );
        });

        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show form message
function showFormMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = type;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Animate elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.timeline-item, .skill-card, .contact-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animated elements
window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.timeline-item, .skill-card, .contact-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger animation once after short delay
    setTimeout(() => {
        animateOnScroll();
    }, 300);
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);