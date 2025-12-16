

// 1. Select the elements
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('nav ul');
const links = document.querySelectorAll('nav ul a'); // Select all links inside the menu

// 2. Toggle the menu when the button is clicked
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
    navToggle.classList.toggle('nav-open');
});

// 3. Close the menu when a link is clicked (New Feature)
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        navToggle.classList.remove('nav-open');
    });

    // --- Lightbox Functionality ---

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if(lightbox && lightboxImg) {
        // Set the lightbox image source to the clicked image source
        lightboxImg.src = element.src;
        
        // Show the lightbox
        lightbox.classList.add('active');
        
        // Prevent scrolling on the body while lightbox is open
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if(lightbox) {
        lightbox.classList.remove('active');
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    }
}
});