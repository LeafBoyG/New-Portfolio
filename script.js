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


// --- 3. Advanced Slider Lightbox Logic (Mobile Drag Fix) ---

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

// Helper: Visual update logic
function updateSliderPosition(percentage) {
    // 1. Clamp value between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));
    
    // 2. Use requestAnimationFrame for 60fps smoothness
    requestAnimationFrame(() => {
        // Update the mask (Reveal/Hide image)
        // Note: inset(top right bottom left) -> we change 'right'
        lbImgBefore.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    });

    // 3. Keep the invisible input in sync (optional, but good practice)
    if(lbRangeInput) lbRangeInput.value = percentage;
}

if (lbRangeInput && lbImgBefore) {
    
    // --- DESKTOP (Mouse) ---
    lbRangeInput.addEventListener('input', (e) => {
        updateSliderPosition(e.target.value);
    });

    // --- MOBILE (Touch) ---
    // We attach to 'touchmove' to handle the dragging manually
    lbRangeInput.addEventListener('touchmove', (e) => {
        // STOP the page from scrolling while dragging!
        e.preventDefault(); 
        
        const sliderRect = lbRangeInput.getBoundingClientRect();
        const touchX = e.touches[0].clientX;
        
        // Calculate the percentage based on finger position relative to the box
        let percent = ((touchX - sliderRect.left) / sliderRect.width) * 100;
        
        updateSliderPosition(percent);
    }, { passive: false }); // 'passive: false' allows us to use preventDefault()
}

function closeLightbox() {
    if(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

if(lightbox) {
    lightbox.addEventListener('click', (e) => {
        // Close if clicking the background (but not the slider itself)
        if (e.target === lightbox) {
            closeLightbox();
        }
    });


    // --- Navigation Scroll Effect ---
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
}