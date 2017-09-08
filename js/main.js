function initOpenMenu() {
    var openMenu = document.querySelector("#open-menu");
    var header = document.querySelector("#header");

    openMenu.addEventListener("click", function(e) {
        e.preventDefault();
        header.classList.toggle("open");
    });
}

function initIntroParalax() {
    var introText = document.querySelector("#intro-text");
    var scroll = window.pageYOffset;

    function introTextParallax(sign, e) {
        introText.style.marginTop = window.pageYOffset + "px";
    }

    window.addEventListener("scroll", function(e) {
        window.requestAnimationFrame(introTextParallax);
    });
}

function initMap() {
    var mapSection = document.querySelector("#map");
    var location = new google.maps.LatLng(37.9870400,-1.1300400);
    var props = {
        center: location,
        zoom: 16,
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: false
    };
    var map = new google.maps.Map(mapSection, props);

    var marker = new google.maps.Marker({ position: location });
    marker.setMap(map);
}

function initMenuPage() {
    var menuBtns = document.querySelectorAll("#menu .cat-btn");
    var sections = document.querySelectorAll("#menu .cat");
    var currentBtn = document.querySelector("#menu .cat-btn.active");
    var currentSection = document.querySelector("#menu .cat.active");

    function hideSection(e) {
        e.preventDefault();
        currentBtn.classList.remove("active");
        this.classList.add("active");
        currentBtn = this;

        currentSection.classList.remove("active");
    }
    menuBtns.forEach(function(btn) {
        btn.addEventListener("click", hideSection);
    });

    function showSection(e) {
        if ( this != currentSection ) {
            return;
        }
        this.style.display = "none";

        var id = currentBtn.getAttribute("data-section");
        currentSection = document.getElementById(id);

        currentSection.style.display = "block";
        var opacityTimer = setTimeout(function() {
            currentSection.classList.add("active");
        }, 200);
    }
    sections.forEach(function(section) {
        section.addEventListener("transitionend", showSection);
    });

    if (window.screen.availWidth <= 822) {
        var cards = document.querySelectorAll("#card-section .card");

        cards.forEach(function(card) {
            card.addEventListener("click", function() {
                var rotate = this.querySelector(".rotate");
                if (rotate.style.transform == "rotateY(0deg)") {
                    rotate.style.transform = "rotateY(180deg)";
                } else {
                    rotate.style.transform = "rotateY(0deg)";
                }
            });
        });
    }
}

function initAboutParallax() {
    var sections = document.querySelectorAll("#body section");
    var bars = document.querySelectorAll(".progress");
    var currentBar = bars[0];
    var currentSection = sections[0];
    var currentIndex = 0;
    var completedSections = [];


    function animateSections(section, index) {
        var left = section.querySelector(".left");
        var right = section.querySelector(".right");

        if (index <= 1 && !completedSections[index]) {
            left.style.left = 0;
            right.style.right = 0;
        }

        if (index == 2 && !completedSections[index]) {
            left.style.opacity = 1;
            right.style.opacity = 1;
            left.style.bottom = 0;
            right.style.top = 0;
        }

        if (index == 3 && !completedSections[index]) {
            var aboutTitle = section.querySelector(".about-title");
            var title = aboutTitle.querySelector("h2");
            var par = aboutTitle.querySelector(".paragraph");
            var padding = 30;
            var border = 10;

            par.style.display = "block";
            var opacityTimer = setTimeout(function() {
                par.style.opacity = 1;
            }, 200);

            aboutTitle.style.width = "50%";
            aboutTitle.style.borderRadius = "0";
            title.style.marginBottom = "15px";
        }
    }

    animateSections(sections[currentIndex], currentIndex);

    function progress() {
        var heightProp = bars[currentIndex].style.height;
        var heightMatch = /([0-9]+).+/.exec(heightProp);
        var height = heightMatch[1];
        var offsetTop = sections[currentIndex].offsetTop;
        var scrollHeight = window.pageYOffset - offsetTop + 113;
        if (currentIndex > 0) { scrollHeight += 170; }
        bars[currentIndex].style.height = ((scrollHeight / 10) * 2) + '%';
        if (height > 80) {
            currentIndex = (currentIndex > 2)? 2: currentIndex + 1;
            if (completedSections[currentIndex]) {
                if (currentIndex == 3) { currentIndex -= 1; }
                return;
            }
            animateSections(sections[currentIndex], currentIndex);
            var title;
            if (currentIndex == 3) {
                title = sections[currentIndex].querySelector(".about-title");
                completedSections[currentIndex] = true;
                currentIndex -= 1;
            } else {
                title = sections[currentIndex].querySelector(".about-title");
                completedSections[currentIndex] = true;
            }
            title.style.borderColor = "#d9822b";
        }
        if (scrollHeight <= -113) {
            bars[currentIndex].style.height = 0;
            currentIndex = (currentIndex <= 0)? 0: currentIndex - 1;
        }
    }

    window.addEventListener("scroll", function() {
        requestAnimationFrame(progress);
    });
}

(function() {
    var pathname = window.location.pathname;
    initOpenMenu();
    if (pathname == '/menu/') {
        initMenuPage();
    }
    if (pathname == '/' && screen.width > 822) {
        initIntroParalax();
    }
    if (pathname == '/about/' && screen.width > 822) {
        initAboutParallax();
    }
}());
