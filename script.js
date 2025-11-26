

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
});