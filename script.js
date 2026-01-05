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


// --- 3. Advanced Slider Lightbox Logic (Mobile Fixed) ---

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
        lbImgBefore.style.clipPath = "inset(0 50% 0 0)";

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Function to update the mask (Shared by Mouse and Touch)
function updateSlider(val) {
    const insetAmount = 100 - val;
    requestAnimationFrame(() => {
        lbImgBefore.style.clipPath = `inset(0 ${insetAmount}% 0 0)`;
    });
}

if (lbRangeInput && lbImgBefore) {
    // 1. Mouse Interaction (Desktop)
    lbRangeInput.addEventListener('input', (e) => {
        updateSlider(e.target.value);
    });

    // 2. Touch Interaction (Mobile) - NEW!
    lbRangeInput.addEventListener('touchmove', (e) => {
        // We need to calculate where the finger is relative to the slider width
        const sliderRect = lbRangeInput.getBoundingClientRect();
        const touchX = e.touches[0].clientX;
        
        // Calculate percentage (0 to 100)
        let percent = ((touchX - sliderRect.left) / sliderRect.width) * 100;
        
        // Clamp between 0 and 100
        percent = Math.max(0, Math.min(100, percent));
        
        // Update the visual slider
        updateSlider(percent);
        
        // Update the invisible input value (so it stays in sync)
        lbRangeInput.value = percent;
    }, { passive: true }); // 'passive: true' makes scroll performance better
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