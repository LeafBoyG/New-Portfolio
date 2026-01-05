// =========================================
// MODERN PORTFOLIO JAVASCRIPT
// =========================================

// --- 1. Navigation Toggle (Mobile Hamburger) ---
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('nav ul');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
        navToggle.classList.toggle('nav-open');
    });
}

// --- 2. Modern Scroll Animations (IntersectionObserver) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Stop observing once revealed for performance
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
});


// --- 3. Advanced Slider Lightbox Logic (Clip-Path Fix) ---

const lightbox = document.getElementById('lightbox');
const lbImgBefore = document.getElementById('lb-img-before');
const lbImgAfter = document.getElementById('lb-img-after');
const lbRangeInput = document.getElementById('lb-comparison-range');

function openSliderLightbox(element) {
    const editSrc = element.getAttribute('src');
    const rawSrc = element.getAttribute('data-raw-src') || editSrc;

    if(lightbox && lbImgBefore && lbImgAfter) {
        lbImgBefore.src = rawSrc;
        lbImgAfter.src = editSrc;
        
        // Reset to center
        lbRangeInput.value = 50;
        // Use clip-path instead of width!
        lbImgBefore.style.clipPath = "inset(0 50% 0 0)";

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

if (lbRangeInput && lbImgBefore) {
    lbRangeInput.addEventListener('input', (e) => {
        const val = e.target.value;
        // Calculate the inset: if value is 40%, we hide the right 60%
        const insetAmount = 100 - val;
        
        requestAnimationFrame(() => {
            // Update the mask
            lbImgBefore.style.clipPath = `inset(0 ${insetAmount}% 0 0)`;
        });
    });
}

function closeLightbox() {
    if(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

if(lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}