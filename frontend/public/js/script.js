
// Theme toggle functionality
var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Khởi tạo mặc định là light mode (không tự động dựa trên hệ thống)
themeToggleLightIcon.classList.remove("hidden");
document.documentElement.classList.remove("dark");

var themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", function () {
    themeToggleDarkIcon.classList.toggle("hidden");
    themeToggleLightIcon.classList.toggle("hidden");

    if (localStorage.getItem("color-theme")) {
        if ("light" === localStorage.getItem("color-theme")) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        }
    } else {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("color-theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("color-theme", "dark");
        }
    }
});

// Mobile menu functionality
const btn = document.querySelector("button.mobile-menu-button");
const menu = document.querySelector(".mobile-menu");
const btnClose = document.querySelector(".navbar-toggle-close");

btn.addEventListener("click", () => {
    menu.classList.remove("hidden");
    menu.classList.add("open");
});

btnClose.addEventListener("click", () => {
    menu.classList.add("hidden");
    menu.classList.remove("open");
});

// Update current year
const date = new Date();
let year = date.getFullYear();
if (document.getElementById("date")) {
    document.getElementById("date").innerHTML = year;
}

// Sticky navigation bar on scroll


// Marquee content duplication
if (document.querySelector("#clients")) {
    const root = document.documentElement;
    const displayedElements = parseInt(getComputedStyle(root).getPropertyValue("--marquee-elements-displayed"));
    const marqueeContent = document.querySelector(".marquee-content");
    root.style.setProperty("--marquee-elements", marqueeContent.children.length);

    for (let i = 0; i < displayedElements; i++) {
        marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
    }
}

// Counter animation
let sectionCounter = document.querySelector("#counter");
let counters = document.querySelectorAll(".counter");

if (sectionCounter) {
    let observer = new IntersectionObserver(
        (entries, observer) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                counters.forEach((counter, index) => {
                    counter.innerHTML = "0";
                    const updateCounter = () => {
                        const target = +counter.getAttribute("data-value");
                        const current = +counter.innerHTML;
                        if (current < target) {
                            counter.innerHTML = `${Math.ceil(current + target / 5000)}`;
                            setTimeout(updateCounter, 1);
                        } else {
                            counter.innerHTML = target;
                        }
                    };
                    updateCounter();
                    if (counter.parentElement.style.animation) {
                        counter.parentElement.style.animation = "";
                    } else {
                        counter.parentElement.style.animation = `slide-up 0.3s ease forwards ${index / counters.length + 1.5}s`;
                    }
                });
                observer.unobserve(sectionCounter);
            }
        },
        { root: null, threshold: 1 }
    );
    observer.observe(sectionCounter);
}

// Trusted counter animation
let trustedCounter = document.querySelector("#counter_trusted");
let trustedCounters = document.querySelectorAll(".counterTrusted");

if (trustedCounter) {
    let observer = new IntersectionObserver(
        (entries, observer) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                trustedCounters.forEach((counter, index) => {
                    counter.innerHTML = "0";
                    const updateCounter = () => {
                        const target = +counter.getAttribute("data-value");
                        const current = +counter.innerHTML;
                        if (current < target) {
                            counter.innerHTML = `${Math.ceil(current + target / 5000)}`;
                            setTimeout(updateCounter, 1);
                        } else {
                            counter.innerHTML = target;
                        }
                    };
                    updateCounter();
                    if (counter.parentElement.style.animation) {
                        counter.parentElement.style.animation = "";
                    } else {
                        counter.parentElement.style.animation = `slide-up 0.3s ease forwards ${index / trustedCounters.length + 1.5}s`;
                    }
                });
                observer.unobserve(trustedCounter);
            }
        },
        { root: null, threshold: 1 }
    );
    observer.observe(trustedCounter);
}

// Company bar counter animation
let companyBar = document.querySelector("#company_bar");
let companyBarItem = document.querySelectorAll(".companyBar");

if (companyBar) {
    let observer = new IntersectionObserver(
        (entries, observer) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                companyBarItem.forEach((counter, index) => {
                    counter.innerHTML = "0";
                    const updateCounter = () => {
                        const target = +counter.getAttribute("data-value");
                        const current = +counter.innerHTML;
                        if (current < target) {
                            counter.innerHTML = `${Math.ceil(current + target / 5000)}`;
                            setTimeout(updateCounter, 1);
                        } else {
                            counter.innerHTML = target;
                        }
                    };
                    updateCounter();
                    if (counter.parentElement.style.animation) {
                        counter.parentElement.style.animation = "";
                    } else {
                        counter.parentElement.style.animation = `slide-up 0.3s ease forwards ${index / companyBarItem.length + 1.5}s`;
                    }
                });
                observer.unobserve(companyBar);
            }
        },
        { root: null, threshold: 1 }
    );
    observer.observe(companyBar);
}

// FAQ accordion functionality
document.querySelectorAll(".faq-header").forEach(header => {
    header.addEventListener("click", () => {
        document.querySelectorAll(".faq-header").forEach(otherHeader => {
            if (otherHeader !== header && otherHeader.classList.contains("open")) {
                let body = otherHeader.nextElementSibling;
                body.classList = "faq-body collapsing";
                setTimeout(() => {
                    body.style.height = "0px";
                }, 1);
                setTimeout(() => {
                    body.classList = "faq-body close";
                    body.style.height = "";
                }, 300);
                otherHeader.classList.remove("open");
            }
        });

        let body = header.nextElementSibling;
        if (!header.classList.contains("collapsing")) {
            if (header.classList.contains("open")) {
                body.classList = "faq-body collapsing";
                setTimeout(() => {
                    body.style.height = "0px";
                }, 1);
                setTimeout(() => {
                    body.classList = "faq-body close";
                    body.style.height = "";
                }, 300);
            } else {
                body.style.display = "block";
                let height = body.clientHeight;
                setTimeout(() => {
                    body.style.height = height + "px";
                    body.style.display = "";
                }, 1);
                body.classList = "faq-body collapsing";
                setTimeout(() => {
                    body.classList = "faq-body close open";
                }, 300);
            }
            header.classList.toggle("open");
        }
    });
});

// Price toggle functionality
var checkBox = document.getElementById("priceCheck");
function check() {
    var monthlyPrices = document.getElementsByClassName("price-month");
    var yearlyPrices = document.getElementsByClassName("price-year");
    for (var i = 0; i < monthlyPrices.length; i++) {
        if (checkBox.checked === false) {
            monthlyPrices[i].style.display = "block";
            yearlyPrices[i].style.display = "none";
        } else {
            monthlyPrices[i].style.display = "none";
            yearlyPrices[i].style.display = "block";
        }
    }
}
check();
if (checkBox) {
    checkBox.addEventListener("click", check);
}

// Swiper sliders
const testimonial = new Swiper("#testionial", {
    loop: true,
    spaceBetween: 45,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },
    breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 0 },
        768: { slidesPerView: 2, spaceBetween: 45 },
        1024: { slidesPerView: 3, spaceBetween: 45 }
    }
});

const blogFeature = new Swiper("#blog-feature", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 45,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    }
});

const integration = new Swiper("#integration", {
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false
    },
    breakpoints: {
        640: { slidesPerView: 3 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 9 }
    }
});

const timeline = new Swiper("#timeline", {
    loop: true,
    direction: "vertical",
    spaceBetween: 45,
    slidesPerView: 3
});

// FAQ tabs functionality
let faqTabs = document.querySelectorAll("ul.faq-tabs > li");
function myTabClicks(tab) {
    for (let i = 0; i < faqTabs.length; i++) {
        faqTabs[i].classList.remove("tabActive");
    }
    let currentTab = tab.currentTarget;
    currentTab.classList.add("tabActive");
    tab.preventDefault();

    let tabPanes = document.querySelectorAll(".tab-pane");
    for (let i = 0; i < tabPanes.length; i++) {
        tabPanes[i].classList.remove("tabActive");
    }

    let target = tab.target;
    let targetId = target.getAttribute("href");
    let targetPane = document.querySelector(targetId);
    targetPane.classList.add("tabActive");
}
for (let i = 0; i < faqTabs.length; i++) {
    faqTabs[i].addEventListener("click", myTabClicks);
}

// Fancybox and GSAP animations
Fancybox.bind("[data-fancybox]", {});
gsap.registerPlugin(MotionPathPlugin);
gsap.set("#rect, #rect-2, #rect-3, #rect-4, #rect-5, #rect-6", { opacity: 1 });

gsap.from("#rect", {
    motionPath: {
        path: "#path",
        autoRotate: true,
        align: "#path",
        alignOrigin: [0.5, 0.5]
    },
    duration: 2,
    ease: "none",
    repeat: -1,
    repeatDelay: 0
});

gsap.from("#rect-2", {
    motionPath: {
        path: "#path-2",
        autoRotate: true,
        align: "#path-2",
        alignOrigin: [0.5, 0.5]
    },
    duration: 2,
    ease: "none",
    repeat: -1,
    repeatDelay: 0
});

gsap.from("#rect-3", {
    motionPath: {
        path: "#path-3",
        autoRotate: true,
        align: "#path-3",
        alignOrigin: [0.5, 0.5]
    },
    duration: 2,
    ease: "none",
    repeat: -1,
    repeatDelay: 0
});

gsap.from("#rect-4", {
    motionPath: {
        path: "#path-4",
        autoRotate: true,
        align: "#path-4",
        alignOrigin: [0.5, 0.5]
    },
    duration: 2,
    ease: "none",
    repeat: -1,
    repeatDelay: 0
});

gsap.from("#rect-5", {
    motionPath: {
        path: "#path-5",
        autoRotate: true,
        align: "#path-5",
        alignOrigin: [0.5, 0.5]
    },
    duration: 2,
    ease: "none",
    repeat: -1,
    repeatDelay: 0
});

gsap.from("#rect-6", {
    motionPath: {
        path: "#path-6",
        autoRotate: true,
        align: "#path-6",
        alignOrigin: [0.5, 0.5]
    },
    duration: 2,
    ease: "none",
    repeat: -1,
    repeatDelay: 0
});

// Modal functionality
let modal = document.getElementById("modal");
let modalOpenBtn = document.getElementById("open-btn");
let modalCloseBtn = document.getElementById("ok-btn");

if (modalOpenBtn) {
    modalOpenBtn.onclick = function () {
        modal.style.display = "flex";
    };
}

if (modalCloseBtn) {
    modalCloseBtn.onclick = function () {
        modal.style.display = "none";
    };
}

if (modal) {
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// AOS animation initialization
AOS.init({
    disable: function () {
        return window.innerWidth < 768;
    }
});

// Parallax effect
if (document.querySelector("#scene")) {
    let scene = document.getElementById("scene");
    function parallax(event) {
        this.querySelectorAll(".parallax-effect").forEach(element => {
            var parallaxValue = element.getAttribute("parallax-value");
            var x = (element.offsetWidth - event.pageX * parallaxValue) / 90;
            var y = (element.offsetWidth - event.pageY * parallaxValue) / 90;
            element.style.cssText = `transform: translateX(${x}px) translateY(${y}px); transition-duration: 0.1s;`;
        });
    }
    scene.addEventListener("mousemove", parallax);
}

// Tab functionality
const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach(content => {
            content.classList.remove("tab-items-active");
        });
        tabs.forEach(t => {
            t.classList.remove("tab-active");
        });
        tab.classList.add("tab-active");
        target.classList.add("tab-items-active");
    });
});

// Countdown timer
const countdownElement = document.getElementById("countdown");
if (countdownElement) {
    const targetDate = new Date(countdownElement.getAttribute("data-date")).getTime();

    function formatNumber(num) {
        return num < 10 ? `0${num}` : num;
    }

    const countdownInterval = setInterval(function () {
        var now = new Date().getTime();
        var distance = targetDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        days = formatNumber(days);
        hours = formatNumber(hours);
        minutes = formatNumber(minutes);
        seconds = formatNumber(seconds);

        countdownElement.innerHTML = `${days} : ${hours} : ${minutes} : ${seconds}`;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "Countdown finished!";
        }
    }, 1000);
}