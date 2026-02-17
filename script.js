// =========================================
// 1. NAVIGATION & UI LOGIC
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- MOBILE NAV TOGGLE ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('nav ul');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            // Toggle classes for menu and button animation
            navLinks.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
            
            // Lock body scroll when menu is open
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                navToggle.classList.remove('nav-open');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- INITIALIZE ANIMATIONS ---
    initAnimations();
});

// =========================================
// 2. VISUAL FX ENGINE (Scroll, Tilt, Magnet)
// =========================================

function initAnimations() {
    
    // --- SCROLL REVEAL (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-img').forEach(el => {
        revealObserver.observe(el);
    });

    // --- MAGNETIC BUTTONS & 3D TILT (Desktop Only) ---
    if (window.innerWidth > 768) {
        // Magnetic Buttons
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });

        // 3D Card Tilt
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; 
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
}

// =========================================
// 3. LIGHTBOX, SLIDER & GALLERY LOGIC 
// =========================================

let currentGalleryImages = [];
let currentImageIndex = 0;

window.openSliderLightbox = function(element) {
    const lightbox = document.getElementById('lightbox');
    
    // Find all images in the gallery so we can scroll through them
    currentGalleryImages = Array.from(document.querySelectorAll('.masonry-wrapper img'));
    
    // Find the number (index) of the image we just clicked
    currentImageIndex = currentGalleryImages.indexOf(element);

    // Load the image into the lightbox
    updateLightboxContent();

    // Show the lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
};

window.changeLightboxImage = function(direction) {
    if (currentGalleryImages.length === 0) return;
    
    // Change the index (+1 for next, -1 for prev)
    currentImageIndex += direction;
    
    // Loop around if we hit the end or beginning
    if (currentImageIndex < 0) {
        currentImageIndex = currentGalleryImages.length - 1;
    } else if (currentImageIndex >= currentGalleryImages.length) {
        currentImageIndex = 0;
    }
    
    updateLightboxContent();
};

function updateLightboxContent() {
    const lbImgBefore = document.getElementById('lb-img-before');
    const lbImgAfter = document.getElementById('lb-img-after');
    const lbRangeInput = document.getElementById('lb-comparison-range');
    
    // Get the new image based on our current index
    const element = currentGalleryImages[currentImageIndex];
    
    // Safety check
    if (!element || !lbImgBefore || !lbImgAfter) return;

    // Get Sources
    const editSrc = element.getAttribute('src');
    const rawSrc = element.getAttribute('data-raw-src');

    // Set Images
    lbImgAfter.src = editSrc;
    lbImgBefore.src = rawSrc ? rawSrc : editSrc;

    // Reset Slider Position to exactly 50%
    if (lbRangeInput) {
        lbRangeInput.value = 50;
        lbImgBefore.style.clipPath = "inset(0 50% 0 0)";
        
        // Desktop Input
        lbRangeInput.oninput = (e) => {
            lbImgBefore.style.clipPath = `inset(0 ${100 - e.target.value}% 0 0)`;
        };
        
        // Touch Input
        lbRangeInput.ontouchmove = (e) => {
            const rect = lbRangeInput.getBoundingClientRect();
            const touchX = e.touches[0].clientX;
            let percent = ((touchX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            
            lbImgBefore.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            lbRangeInput.value = percent;
        };
    }
}

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock background scroll
    }
};

// Close on background click
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    // If we click the dark background (not the image or buttons), close it
    if (lightbox && e.target === lightbox) {
        window.closeLightbox();
    }
});

// Keyboard Controls (Arrows to scroll, Escape to close)
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === "Escape") window.closeLightbox();
        if (e.key === "ArrowLeft") window.changeLightboxImage(-1);
        if (e.key === "ArrowRight") window.changeLightboxImage(1);
    }
});