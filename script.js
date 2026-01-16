// =========================================
// ORGANIC MOTION ENGINE
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE NAVIGATION TOGGLE ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('nav ul');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
        });
    }

    // --- 2. SCROLL REVEAL ENGINE ---
    // This finds any element with class .reveal or .reveal-img and triggers it when visible
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it enters screen
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-img').forEach((el) => {
        observer.observe(el);
    });

    // --- 3. MAGNETIC BUTTONS ---
    // Buttons move slightly towards the mouse for a tactile feel
    const magneticBtns = document.querySelectorAll('.cta-button, .btn-submit, .cta-link');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button (divided by 5 to dampen the movement)
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            // Snap back to center
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- 4. 3D CARD TILT EFFECT ---
    // Project cards tilt based on mouse position
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation (center is 0)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit rotation to +/- 10 degrees
            const rotateX = ((y - centerY) / centerY) * -5; // Negative to tilt away
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

});

// =========================================
// LIGHTBOX LOGIC (Global Scope)
// =========================================
const lightbox = document.getElementById('lightbox');
const lbImgBefore = document.getElementById('lb-img-before');
const lbImgAfter = document.getElementById('lb-img-after');
const lbRangeInput = document.getElementById('lb-comparison-range');

function openSliderLightbox(element) {
    // Get image sources
    const editSrc = element.getAttribute('src');
    // If no raw src defined, use the same image (fallback)
    const rawSrc = element.getAttribute('data-raw-src') || editSrc;

    if(lightbox && lbImgBefore && lbImgAfter) {
        lbImgBefore.src = rawSrc;
        lbImgAfter.src = editSrc;
        
        // Reset slider to center
        if(lbRangeInput) lbRangeInput.value = 50;
        lbImgBefore.style.clipPath = "inset(0 50% 0 0)";

        // Show Lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop background scroll
    }
}

function updateSliderPosition(percentage) {
    percentage = Math.max(0, Math.min(100, percentage));
    
    // Update the clip-path
    requestAnimationFrame(() => {
        if(lbImgBefore) lbImgBefore.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    });
    
    // Sync Input
    if(lbRangeInput) lbRangeInput.value = percentage;
}

// Event Listeners for Lightbox
if (lbRangeInput) {
    lbRangeInput.addEventListener('input', (e) => updateSliderPosition(e.target.value));
    
    // Mobile Drag Support
    lbRangeInput.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = lbRangeInput.getBoundingClientRect();
        const touchX = e.touches[0].clientX;
        let percent = ((touchX - rect.left) / rect.width) * 100;
        updateSliderPosition(percent);
    }, { passive: false });
}

// Close Functions
function closeLightbox() {
    if(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

if(lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('close-btn')) {
            closeLightbox();
        }
    });
}