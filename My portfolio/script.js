// Theme Toggle
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

const themes = ["light-theme", "dark-theme", "blue-theme"];
let currentTheme = 0;

// Restore saved theme
if (localStorage.getItem("theme")) {
    const savedTheme = localStorage.getItem("theme");
    if (themes.includes(savedTheme)) {
        body.classList.add(savedTheme);
        currentTheme = themes.indexOf(savedTheme);
    } else {
        body.classList.add(themes[currentTheme]);
    }
} else {
    body.classList.add(themes[currentTheme]);
}

function updateIcon() {
    if (themes[currentTheme] === "light-theme") {
        toggleBtn.innerHTML = `<i class="fas fa-sun"></i>`;
    } else if (themes[currentTheme] === "dark-theme") {
        toggleBtn.innerHTML = `<i class="fas fa-moon"></i>`;
    } else {
        toggleBtn.innerHTML = `<i class="fas fa-water"></i>`;
    }
}

toggleBtn.addEventListener("click", () => {
    body.classList.remove(themes[currentTheme]);
    currentTheme = (currentTheme + 1) % themes.length;
    body.classList.add(themes[currentTheme]);
    localStorage.setItem("theme", themes[currentTheme]);
    updateIcon();
});

updateIcon();

// Portfolio Lightbox
const galleryItems = document.querySelectorAll(".gallery-item img");
const lightbox = document.querySelector("#lightbox");
const lightboxImg = lightbox.querySelector(".lightbox-img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".close");

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    const item = galleryItems[currentIndex];
    lightbox.style.display = "flex";
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.alt;
}

function closeLightbox() {
    lightbox.style.display = "none";
}

function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
}

function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
}

galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        openLightbox(index);
    });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            showNext();
        } else if (e.key === "ArrowLeft") {
            showPrev();
        }
    }
});

// Parallax Effect for Hero Image
window.addEventListener("scroll", () => {
    const heroImage = document.querySelector(".hero-image");
    const scrollPosition = window.scrollY;
    heroImage.style.transform = `translateY(${scrollPosition * 0.2}px)`;
});

// Trigger Paper-Cutting Animation for About Section
const aboutSection = document.querySelector(".about");
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.3 }
);
observer.observe(aboutSection);

// Animate Skills Progress Bars
const progressBars = document.querySelectorAll(".progress");
const skillsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                progressBars.forEach((bar) => {
                    const width = bar.getAttribute("data-width");
                    bar.style.width = width;
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);
skillsObserver.observe(document.querySelector(".skills"));

// Form Feedback
const reviewForm = document.getElementById('review-form');
const messageDiv = document.getElementById('form-message');
const messageText = document.getElementById('message-text');

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    button.textContent = 'Sending...';

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        button.textContent = 'Submit Review';
        if (response.ok) {
            messageText.textContent = 'Thanks! Your review was sent—check your email for confirmation!';
            messageDiv.style.background = 'var(--secondary)';
            messageDiv.style.color = '#fff';
            form.reset();
        } else {
            const errorData = await response.json();
            messageText.textContent = `Oops! Failed to send: ${errorData.error || 'Unknown error'}. Try again.`;
            messageDiv.style.background = 'red';
            messageDiv.style.color = '#fff';
        }
    } catch (error) {
        button.textContent = 'Submit Review';
        messageText.textContent = 'Error: Couldn’t connect to Formspree. Check your internet and try again.';
        messageDiv.style.background = 'red';
        messageDiv.style.color = '#fff';
    }
    messageDiv.style.display = 'block';
    setTimeout(() => { messageDiv.style.display = 'none'; }, 5000);
});