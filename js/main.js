const images = [
    "asset/image/hero1.webp",
    "asset/image/hero2.webp",
    "asset/image/hero3.webp",
    "asset/image/hero4.webp",
    "asset/image/hero5.webp",
    "asset/image/hero6.webp"
];

let index = 0;
const heroImg = document.getElementById("hero-img");

setInterval(() => {

    // 🔥 STEP 1: fade out
    heroImg.style.opacity = 0;

    setTimeout(() => {

        const nextIndex = (index + 1) % images.length;

        // 🔥 preload
        const img = new Image();
        img.src = images[nextIndex];

        img.onload = () => {
            index = nextIndex;
            heroImg.src = images[index];

            // 🔥 STEP 2: fade in
            heroImg.style.opacity = 1;
        };

    }, 500); // ⏱ harus sama dengan transition CSS

}, 3000);

// FADE UP ABOUT US
const elements = document.querySelectorAll(".fade-up, .fade-scale");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // 🔥 biar ga trigger lagi
        }
    });
}, {
    threshold: 0.2
});

elements.forEach(el => observer.observe(el));

// SCROLL NAVBAR
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(!target) return;

        const offset = 90;
        const top = target.offsetTop - offset;

        window.scrollTo({
            top: top,
            behavior: "smooth"
        });
    });
});

// NAVBAR
const navbar = document.querySelector(".navbar");
const hero = document.querySelector("#home");

window.addEventListener("scroll", () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;

    if (window.scrollY >= heroBottom - 80) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});


// REVIEW
const cards = document.querySelectorAll(".card");

let current = 0;

setInterval(() => {
    cards.forEach(c => c.classList.remove("active","next","prev"));

    current = (current + 1) % cards.length;

    let prev = (current - 1 + cards.length) % cards.length;
    let next = (current + 1) % cards.length;

    cards[current].classList.add("active");
    cards[next].classList.add("next");
    cards[prev].classList.add("prev");

}, 3000);

document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".gallery-card");
    const wrapper = document.querySelector(".gallery-wrapper");

    let current = 0;
    let interval;

    function updateGallery() {
        const total = cards.length;

        cards.forEach(c => {
            c.classList.remove("active", "next", "prev", "far-next", "far-prev");
        });

        const prev = (current - 1 + total) % total;
        const next = (current + 1) % total;
        const farPrev = (current - 2 + total) % total;
        const farNext = (current + 2) % total;

        cards[current].classList.add("active");
        cards[next].classList.add("next");
        cards[prev].classList.add("prev");
        cards[farNext].classList.add("far-next");
        cards[farPrev].classList.add("far-prev");
    }

    function nextSlide() {
        current = (current + 1) % cards.length;
        updateGallery();
    }

    function startSlider() {
        interval = setInterval(nextSlide, 1500);
    }

    function stopSlider() {
        clearInterval(interval);
    }

    updateGallery();
    startSlider();

    wrapper.addEventListener("mouseenter", stopSlider);
    wrapper.addEventListener("mouseleave", startSlider);

});

document.addEventListener("DOMContentLoaded", function () {

    const wrapper = document.querySelector(".services-wrapper");
    const cards = document.querySelectorAll(".service-card");
    const dots = document.querySelectorAll(".service-dots .dot");

    if (!wrapper || !cards.length || !dots.length) return;

    let index = 0;
    let direction = 1;
    let interval;

    function getCardWidth() {
        const style = window.getComputedStyle(wrapper);
        const gap = parseInt(style.columnGap || style.gap) || 20;
        return cards[0].offsetWidth + gap;
    }

    function scrollToIndex(i) {
        wrapper.scrollTo({
            left: i * getCardWidth(),
            behavior: "smooth"
        });

        updateDots(i);
    }

    function updateDots(i) {
        dots.forEach(d => d.classList.remove("active"));
        if (dots[i]) dots[i].classList.add("active");
    }

    function isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    function getMaxIndex() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            return cards.length - 1; // mobile
        } else if (window.matchMedia("(max-width: 992px)").matches) {
            return cards.length - 2; // tablet
        } else {
            return cards.length - 1;
        }
    }

    // 🔥 AUTO SLIDE
    function startAuto() {
        interval = setInterval(() => {

            const maxIndex = getMaxIndex();

            index += direction;

            if (index >= maxIndex || index <= 0) {
                direction *= -1; // 🔥 balik arah
            }

            // safety biar ga lewat batas
            if (index > maxIndex) index = maxIndex;
            if (index < 0) index = 0;

            scrollToIndex(index);

        }, 3000);
    }

    startAuto();

    // 🔥 CLICK DOT
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            const maxIndex = getMaxIndex();
            index = Math.min(i, maxIndex);  
            scrollToIndex(index);
        });
    });

    // 🔥 PAUSE HOVER (desktop/tablet only)
    wrapper.addEventListener("mouseenter", stopAuto);
    wrapper.addEventListener("mouseleave", startAuto);

    // 🔥 SYNC DOT SAAT SCROLL MANUAL
    wrapper.addEventListener("scroll", () => {
        const scrollLeft = wrapper.scrollLeft;
        const cardWidth = getCardWidth();

        let newIndex = Math.round(scrollLeft / cardWidth);
        const maxIndex = getMaxIndex();

        newIndex = Math.min(newIndex, maxIndex);

        if (newIndex !== index) {
            index = newIndex;
            updateDots(index);
        }
    });

});

document.addEventListener("DOMContentLoaded", function () {

    const wrapper = document.querySelector(".menu-wrapper");
    const cards = document.querySelectorAll(".menu-card");
    const dots = document.querySelectorAll(".menu-dots .dot");

    if (!wrapper || !cards.length || !dots.length) return;

    let index = 0;
    let direction = 1;
    let interval;

    function getCardWidth() {
        return cards[0].offsetWidth + 20;
    }

    function scrollToIndex(i) {
        wrapper.scrollTo({
            left: i * getCardWidth(),
            behavior: "smooth"
        });

        updateDots(i);
    }

    function updateDots(i) {
        const maxIndex = getMaxIndex();

        dots.forEach((d, idx) => {
            d.classList.remove("active");

            // 🔥 hanya aktifkan dot yang valid
            if (idx === i && idx <= maxIndex) {
                d.classList.add("active");
            }
        });
    }

    function getMaxIndex() {
        if (window.matchMedia("(max-width: 768px)").matches) {
            return cards.length - 1; // 🔥 mobile (0–3)
        } else if (window.matchMedia("(max-width: 992px)").matches) {
            return cards.length - 2; // 🔥 tablet (0–2)
        } else {
            return cards.length - 1;
        }
    }

    function startAuto() {
        interval = setInterval(() => {

            const maxIndex = getMaxIndex();

            index += direction;

            if (index >= maxIndex || index <= 0) {
                direction *= -1;
            }

            scrollToIndex(index);

        }, 3000);
    }

    function stopAuto() {
        clearInterval(interval);
    }

    startAuto();

    // CLICK DOT
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {

            const maxIndex = getMaxIndex();

            if (i > maxIndex) return; // 🔥 limit sesuai device

            index = i;
            scrollToIndex(index);
        });
    });

    // PAUSE HOVER
    wrapper.addEventListener("mouseenter", stopAuto);
    wrapper.addEventListener("mouseleave", startAuto);

    // SYNC DOT
    wrapper.addEventListener("scroll", () => {
        const scrollLeft = wrapper.scrollLeft;
        const cardWidth = getCardWidth();

        let newIndex = Math.round(scrollLeft / cardWidth);
        const maxIndex = getMaxIndex();

        newIndex = Math.min(newIndex, maxIndex);

        newIndex = Math.min(newIndex, getMaxIndex());

        if (newIndex !== index) {
            index = newIndex;
            updateDots(index);
        }
    });

});


const toggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

toggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

const mobileNavLinks = document.querySelectorAll(".nav-menu a");

mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        toggle.classList.remove("open");
    });
});


const menuBtn = document.querySelector(".menu-btn");
const modal = document.getElementById("menuModal");
const closeBtn = document.querySelector(".close");
const panels = document.querySelectorAll(".panel");

// 🔥 buka modal
menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("show");
});

// 🔥 function close (biar rapi)
function closeModal() {
    modal.classList.remove("show");
}

// 🔥 tombol X
closeBtn.addEventListener("click", closeModal);

// 🔥 klik luar
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

// 🔥 ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
    }
});

// expanding panel
panels.forEach(panel => {
    panel.addEventListener("click", () => {

        panels.forEach(p => {
            p.classList.remove("active");
            p.scrollTop = 0; // reset scroll
        });

        panel.classList.add("active");

        // 🔥 auto scroll hint
        setTimeout(() => {
            panel.scrollTo({
                top: 60,
                behavior: "smooth"
            });

            // balik lagi dikit (biar keliatan "hint")
            setTimeout(() => {
                panel.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }, 400);

        }, 300);
    });
});


