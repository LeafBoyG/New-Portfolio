// Welcome message
console.log("Welcome to my portfolio! JavaScript is linked.");

// --- Mobile Navigation ---

// 1. Find the button and the nav list in the HTML
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('nav ul');

// 2. Add an "event listener" to the button
navToggle.addEventListener('click', () => {
    // When the button is clicked, add/remove a class
    
    // For the <ul> list (to slide it in)
    navLinks.classList.toggle('nav-open');
    
    // For the <button> (to animate the hamburger to an "X")
    navToggle.classList.toggle('nav-open');
});