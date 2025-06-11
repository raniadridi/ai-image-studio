// JavaScript for AI Image Studio

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

    // loading states for buttons with AI styling
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

    // ripple effect for buttons
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

// Format file size with AI theme
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


// loading indicator for image generation
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
// Image Generation Loading Handler
function initializeImageGeneration() {
    const form = document.getElementById('imageGenerationForm');
    if (form) {
        form.addEventListener('submit', function() {
            showLoadingIndicator();
            disableGenerateButton();
        });
    }
}

function showLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const generateBtn = document.getElementById('generateBtn');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
        loadingIndicator.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function disableGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-robot fa-spin me-2"></i>AI Processing...';
        generateBtn.classList.add('btn-glow');
    }
}

// Fullscreen Image Viewer
function viewFullscreen(imageUrl, prompt, username) {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-overlay';
    
    overlay.innerHTML = `
        <div class="text-white text-center mb-3">
            <h5 class="gradient-text">${username}</h5>
            <p class="text-muted fst-italic">"${prompt}"</p>
        </div>
        <div class="fullscreen-image-container">
            <img src="${imageUrl}" alt="Generated Image" class="fullscreen-image">
            <button class="fullscreen-close-btn" onclick="closeFullscreen()">&times;</button>
        </div>
        <div class="mt-3">
            <button onclick="shareImage('${imageUrl}', '${prompt}')" class="btn btn-outline-light me-2 btn-glow">
                <i class="fas fa-share"></i> Share
            </button>
            <a href="${imageUrl}" download class="btn btn-outline-success btn-glow">
                <i class="fas fa-download"></i> Download
            </a>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeFullscreen();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeFullscreen();
        }
    });
}

function closeFullscreen() {
    const overlay = document.querySelector('.fullscreen-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = 'auto';
    }
}

function shareImage(imageUrl, prompt) {
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    
    const currentUrl = window.location.origin;
    
    shareModal.innerHTML = `
        <div class="text-center">
            <h5 class="mb-3 gradient-text"><i class="fas fa-share"></i> Share Options</h5>
            <div class="d-grid gap-2">
                <button onclick="copyImageLink('${imageUrl}')" class="btn btn-outline-primary btn-glow">
                    <i class="fas fa-copy"></i> Copy Image Link
                </button>
                <button onclick="openTwitter()" class="btn btn-outline-primary btn-glow">
                    <i class="fab fa-twitter"></i> Share to Twitter
                </button>
                <button onclick="openFacebook()" class="btn btn-outline-primary btn-glow">
                    <i class="fab fa-facebook"></i> Share to Facebook
                </button>
                <button onclick="openWhatsApp()" class="btn btn-outline-success btn-glow">
                    <i class="fab fa-whatsapp"></i> Share to WhatsApp
                </button>
            </div>
            <button onclick="closeShareModal()" class="btn btn-sm btn-outline-secondary mt-3">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Store data globally for the buttons
    window.shareData = {
        prompt: prompt,
        imageUrl: imageUrl,
        siteUrl: currentUrl
    };
    
    // Auto remove after 15 seconds
    setTimeout(() => {
        closeShareModal();
    }, 15000);
}

function closeShareModal() {
    const shareModal = document.querySelector('.share-modal');
    if (shareModal) {
        shareModal.remove();
    }
}

// Copy to Clipboard
function copyToClipboard(text, message = 'Copied to clipboard!') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(`📋 ${message}`, 'success');
            closeShareModal();
        }).catch(() => {
            fallbackCopyTextToClipboard(text, message);
        });
    } else {
        fallbackCopyTextToClipboard(text, message);
    }
}

function fallbackCopyTextToClipboard(text, message = 'Copied to clipboard!') {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.cssText = 'position: fixed; top: -9999px; left: -9999px;';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification(`📋 ${message}`, 'success');
        closeShareModal();
    } catch (err) {
        showNotification('❌ Failed to copy', 'error');
    }
    
    document.body.removeChild(textArea);
}


function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'error' ? 'fa-exclamation-triangle' : 
                 type === 'success' ? 'fa-check-circle' : 
                 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} me-2"></i>
            <span class="flex-grow-1">${message}</span>
            <button class="btn-close btn-close-white ms-2" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Download Image Function
function downloadImage() {
    const img = document.querySelector('img[src^="data:image/png;base64"]');
    if (img) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'ai_generated_image.png';
        link.click();
        showNotification('🎨 Image downloaded successfully!', 'success');
    } else {
        showNotification('❌ No image found to download', 'error');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImageGeneration();
    
    // Add click handlers for existing eye buttons
    const eyeButtons = document.querySelectorAll('[onclick*="viewFullscreen"]');
    eyeButtons.forEach(btn => {
        btn.classList.add('btn-gallery');
    });
});
function copyImageLink(imageUrl) {
    copyToClipboard(imageUrl, 'Image link copied!');
}

function openTwitter() {
    console.log("Twitter clicked");
    const data = window.shareData;
    const text = `Check out this AI-generated image: "${data.prompt}" Created with AI Image Studio!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.siteUrl)}`;
    window.open(url, '_blank');
    closeShareModal();
}

function openFacebook() {
    console.log("Facebook clicked");
    const data = window.shareData;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.siteUrl)}`;
    window.open(url, '_blank');
    closeShareModal();
}

function openWhatsApp() {
    console.log("WhatsApp clicked");
    const data = window.shareData;
    const text = `Check out this AI-generated image: "${data.prompt}" - ${data.siteUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    closeShareModal();
}
// Initialize theme on load
document.addEventListener('DOMContentLoaded', initializeAITheme);