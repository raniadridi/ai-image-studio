// Enhanced JavaScript for AI Image Studio

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark theme and AI effects
    initializeAITheme();
    
    // Auto-hide flash messages after 5 seconds with smooth animation
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 5000);
    });

    // Add smooth scrolling to all anchor links
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

    // Enhanced loading states for buttons with AI styling
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                this.disabled = true;
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-robot fa-spin me-2"></i>AI Processing...';
                this.classList.add('btn-glow');
                
                // Re-enable button after 10 seconds as fallback
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = originalText;
                    this.classList.remove('btn-glow');
                }, 10000);
            }
        });
    });

    // Enhanced image lazy loading with fade-in effect
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.src = img.dataset.src;
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Enhanced ripple effect for buttons
    const rippleButtons = document.querySelectorAll('.btn, .card');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Ensure parent has position relative
            if (getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add floating animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-float');
    });

    // AI-themed typing effect for headings
    const headings = document.querySelectorAll('h1, h2');
    headings.forEach(heading => {
        if (heading.textContent.includes('AI') || heading.textContent.includes('Studio')) {
            addTypingEffect(heading);
        }
    });
});

// Initialize AI theme effects
function initializeAITheme() {
    // Add particle effect to navbar
    createParticleEffect();
    
    // Add glow effect to primary buttons
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(btn => {
        btn.classList.add('btn-glow');
    });
    
    // Add AI branding to favicon (if exists)
    updateFavicon();
}

// Create subtle particle effect
function createParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#8b5cf6';
        
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Enhanced notification system with AI styling
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `position-fixed top-0 end-0 m-3 p-3 rounded shadow-lg`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.style.backdropFilter = 'blur(16px)';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';
    
    // Set colors based on type
    switch(type) {
        case 'error':
            notification.style.background = 'rgba(239, 68, 68, 0.9)';
            notification.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            notification.style.color = '#fca5a5';
            break;
        case 'success':
            notification.style.background = 'rgba(16, 185, 129, 0.9)';
            notification.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            notification.style.color = '#86efac';
            break;
        case 'warning':
            notification.style.background = 'rgba(245, 158, 11, 0.9)';
            notification.style.border = '1px solid rgba(245, 158, 11, 0.3)';
            notification.style.color = '#fde047';
            break;
        default:
            notification.style.background = 'rgba(139, 92, 246, 0.9)';
            notification.style.border = '1px solid rgba(139, 92, 246, 0.3)';
            notification.style.color = '#c4b5fd';
    }
    
    const icon = type === 'error' ? 'fa-exclamation-triangle' : 
                 type === 'success' ? 'fa-check-circle' : 
                 type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} me-2"></i>
            <span>${message}</span>
            <button class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Enhanced copy to clipboard with AI feedback
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('🤖 Copied to clipboard successfully!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('📋 Copied to clipboard!', 'success');
    } catch (err) {
        showNotification('❌ Failed to copy', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Format file size with AI theme
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// AI-themed typing effect
function addTypingEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid #8b5cf6';
    
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 500);
        }
    }, 100);
}

// Update favicon with AI theme
function updateFavicon() {
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🤖</text></svg>';
        document.head.appendChild(newFavicon);
    }
}

// Enhanced loading indicator for image generation
function showAILoadingIndicator(container) {
    const loader = document.createElement('div');
    loader.className = 'text-center p-4';
    loader.innerHTML = `
        <div class="position-relative d-inline-block">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="position-absolute top-50 start-50 translate-middle">
                <i class="fas fa-robot text-primary"></i>
            </div>
        </div>
        <p class="mt-3 text-primary loading">🤖 AI is creating your masterpiece...</p>
        <small class="text-muted">This usually takes 20-60 seconds</small>
    `;
    container.appendChild(loader);
    return loader;
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', initializeAITheme);