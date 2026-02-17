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
// 3. APP-STYLE SCROLL LIGHTBOX LOGIC
// =========================================

window.openSliderLightbox = function(element) {
    const lightbox = document.getElementById('lightbox');
    const track = document.getElementById('lightbox-track');
    
    // 1. Clear the track every time we open it
    track.innerHTML = ''; 

    // 2. Find all images in the masonry grid
    const galleryImages = Array.from(document.querySelectorAll('.masonry-wrapper img'));
    
    // 3. Find which image the user clicked
    const startIndex = galleryImages.indexOf(element);

    // 4. Build the vertical feed dynamically
    galleryImages.forEach((img) => {
        const editSrc = img.getAttribute('src');
        const rawSrc = img.getAttribute('data-raw-src') || editSrc;

        // Create a new slide container
        const slide = document.createElement('div');
        slide.className = 'lightbox-slide';

        // Inject the image and slider HTML
        slide.innerHTML = `
            <div class="slide-content">
                <img class="lb-img-layer lb-img-after" src="${editSrc}" alt="Edited Version">
                <img class="lb-img-layer lb-img-before" src="${rawSrc}" alt="Raw Version" style="clip-path: inset(0 50% 0 0);">
                <span class="lb-label lb-label-before">RAW</span>
                <span class="lb-label lb-label-after">EDIT</span>
                <input type="range" min="0" max="100" value="50" class="lb-comparison-range">
            </div>
        `;

        // 5. Add the Before/After slider logic for THIS specific slide
        const range = slide.querySelector('.lb-comparison-range');
        const imgBefore = slide.querySelector('.lb-img-before');

        range.addEventListener('input', (e) => {
            imgBefore.style.clipPath = `inset(0 ${100 - e.target.value}% 0 0)`;
        });

        // Touch support for mobile swiping on the slider
        range.addEventListener('touchmove', (e) => {
            const rect = range.getBoundingClientRect();
            const touchX = e.touches[0].clientX;
            let percent = ((touchX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            imgBefore.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            range.value = percent;
        });

        // Add the finished slide to the track
        track.appendChild(slide);
    });

    // 6. Show the Lightbox and lock the background
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

// 7. Instantly center the feed on the picture the user clicked
    setTimeout(() => {
        // Find the specific slide we want
        const targetSlide = track.children[startIndex];
        if (targetSlide) {
            // Tell the browser to center it instantly
            targetSlide.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    }, 10);
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    const track = document.getElementById('lightbox-track');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Unlock background scroll
        
        // Wait for fade out, then clear memory
        setTimeout(() => { track.innerHTML = ''; }, 300);
    }
};

// Close when clicking the dark background (outside the image)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox-slide') || e.target.id === 'lightbox') {
        window.closeLightbox();
    }
});

// Close with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        window.closeLightbox();
    }
});