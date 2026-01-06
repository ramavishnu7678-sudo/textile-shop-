// ===== TEXTILE WEBSITE JAVASCRIPT FUNCTIONALITY =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== GLOBAL VARIABLES =====
    let cart = JSON.parse(localStorage.getItem('textileCart')) || [];
    let currentFilter = 'all';
    
    // ===== UTILITY FUNCTIONS =====
    
    // Smooth scrolling for anchor links
    function smoothScroll(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Add to cart functionality
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('textileCart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('Product added to cart!', 'success');
    }
    
    // Update cart display
    function updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = cartTotal;
            cartCount.style.display = cartTotal > 0 ? 'block' : 'none';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // ===== ANIMATION FUNCTIONS =====
    
    // Intersection Observer for scroll animations
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.fabric-card, .section-title, .cta-section');
        animateElements.forEach(el => observer.observe(el));
    }
    
    // Parallax effect for hero section
    function setupParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // ===== NAVIGATION FUNCTIONALITY =====
    
    // Mobile navigation toggle
    function setupMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // Close mobile nav when clicking on a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }
    
    // Active navigation highlighting
    function setupActiveNav() {
        const navLinks = document.querySelectorAll('.nav a');
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    // ===== PRODUCT FILTERING =====
    
    function setupProductFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products
                productCards.forEach(card => {
                    const fabricType = card.getAttribute('data-fabric');
                    
                    if (filter === 'all' || fabricType === filter) {
                        card.style.display = 'block';
                        card.classList.add('animate-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('animate-in');
                    }
                });
                
                currentFilter = filter;
            });
        });
    }
    
    // ===== SEARCH FUNCTIONALITY =====
    
    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // ===== SHOPPING CART FUNCTIONALITY =====
    
    function setupCart() {
        const cartIcon = document.getElementById('cart-icon');
        const cartModal = document.getElementById('cart-modal');
        const cartClose = document.querySelector('.cart-close');
        
        if (cartIcon && cartModal) {
            cartIcon.addEventListener('click', () => {
                cartModal.classList.add('active');
                renderCart();
            });
            
            if (cartClose) {
                cartClose.addEventListener('click', () => {
                    cartModal.classList.remove('active');
                });
            }
            
            // Close cart when clicking outside
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.classList.remove('active');
                }
            });
        }
    }
    
    function renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            return;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Make cart functions global
    window.updateQuantity = function(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                localStorage.setItem('textileCart', JSON.stringify(cart));
                updateCartDisplay();
                renderCart();
            }
        }
    };
    
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('textileCart', JSON.stringify(cart));
        updateCartDisplay();
        renderCart();
    };
    
    // ===== FORM VALIDATION =====
    
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Basic validation
                let isValid = true;
                const errors = [];
                
                if (data.email && !isValidEmail(data.email)) {
                    errors.push('Please enter a valid email address');
                    isValid = false;
                }
                
                if (data.phone && !isValidPhone(data.phone)) {
                    errors.push('Please enter a valid phone number');
                    isValid = false;
                }
                
                if (!isValid) {
                    showNotification(errors.join(', '), 'error');
                    return;
                }
                
                // Simulate form submission
                showNotification('Thank you! Your message has been sent.', 'success');
                form.reset();
            });
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // ===== LAZY LOADING =====
    
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ===== THEME TOGGLE =====
    
    function setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.body.setAttribute('data-theme', currentTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                
                showNotification(`Switched to ${newTheme} theme`, 'info');
            });
        }
    }
    
    // ===== PERFORMANCE OPTIMIZATION =====
    
    // Debounce function for scroll events
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
    
    // Throttle scroll events
    const throttledScroll = debounce(() => {
        // Handle scroll-based animations here
    }, 16);
    
    window.addEventListener('scroll', throttledScroll);
    
    // ===== INITIALIZATION =====
    
    function init() {
        // Initialize all functionality
        setupScrollAnimations();
        setupParallax();
        setupMobileNav();
        setupActiveNav();
        setupProductFiltering();
        setupSearch();
        setupCart();
        setupFormValidation();
        setupLazyLoading();
        setupThemeToggle();
        
        // Update cart display on page load
        updateCartDisplay();
        
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                smoothScroll(this.getAttribute('href'));
            });
        });
        
        // Add loading animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
        
        console.log('Textile website JavaScript initialized successfully!');
    }
    
    // Initialize everything
    init();
    
});

// ===== ADDITIONAL GLOBAL FUNCTIONS =====

// Product data (you can expand this)
const products = [
    {
        id: 1,
        name: 'Cotton Summer Dress',
        price: 89.99,
        fabric: 'cotton',
        image: 'path/to/cotton-dress.jpg',
        description: 'Comfortable and breathable cotton dress perfect for summer days.'
    },
    {
        id: 2,
        name: 'Silk Evening Gown',
        price: 299.99,
        fabric: 'silk',
        image: 'path/to/silk-gown.jpg',
        description: 'Elegant silk gown for special occasions.'
    },
    {
        id: 3,
        name: 'Linen Casual Shirt',
        price: 69.99,
        fabric: 'linen',
        image: 'path/to/linen-shirt.jpg',
        description: 'Sustainable linen shirt with natural texture.'
    }
];

// Global function to add products to cart
function addProductToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product);
    }
}
