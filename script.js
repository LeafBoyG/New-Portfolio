// =========================================
// ORGANIC MOTION ENGINE & LIGHTBOX (FIXED)
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE NAV TOGGLE ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('nav ul');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
            // Optional: Lock body scroll when menu is open
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- 2. SCROLL REVEAL ENGINE ---
    const observerOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-img').forEach((el) => {
        observer.observe(el);
    });

    // --- 3. MAGNETIC BUTTONS ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
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

    // --- 4. 3D CARD TILT ---
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
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
});


// =========================================
// LIGHTBOX LOGIC (ROBUST VERSION)
// =========================================

// We attach these to 'window' to ensure the HTML onclick="" can see them
window.openSliderLightbox = function(element) {
    const lightbox = document.getElementById('lightbox');
    const lbImgBefore = document.getElementById('lb-img-before');
    const lbImgAfter = document.getElementById('lb-img-after');
    const lbRangeInput = document.getElementById('lb-comparison-range');

    // Safety check: Do elements exist?
    if (!lightbox || !lbImgBefore || !lbImgAfter) {
        console.error("Lightbox elements not found! Check your HTML.");
        return;
    }

    // Get image sources
    const editSrc = element.getAttribute('src');
    const rawSrc = element.getAttribute('data-raw-src');

    // Set images
    lbImgAfter.src = editSrc;
    lbImgBefore.src = rawSrc ? rawSrc : editSrc; // Fallback if no Raw provided

    // Reset slider
    if (lbRangeInput) {
        lbRangeInput.value = 50;
        // Re-attach listener here to ensure it finds the element
        lbRangeInput.oninput = (e) => {
            lbImgBefore.style.clipPath = `inset(0 ${100 - e.target.value}% 0 0)`;
        };
        // Mobile Touch Support
        lbRangeInput.ontouchmove = (e) => {
            e.preventDefault(); // Stop page scrolling
            const rect = lbRangeInput.getBoundingClientRect();
            const touchX = e.touches[0].clientX;
            let percent = ((touchX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            
            lbImgBefore.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            lbRangeInput.value = percent;
        };
    }

    // Reset visual cut
    lbImgBefore.style.clipPath = "inset(0 50% 0 0)";

    // Show Lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock scroll
    }
};

// Close on background click
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && e.target === lightbox) {
        window.closeLightbox();
    }
});