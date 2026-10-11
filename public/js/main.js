// Powerpacked UI: hamburger nav, search toggle, Members Corner carousel.
(function () {
  'use strict';

  // Hamburger dropdown
  var hamburger = document.getElementById('hamburgerBtn');
  var dropdown = document.getElementById('navDropdown');
  if (hamburger && dropdown) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      dropdown.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Search toggle
  var searchBtn = document.getElementById('searchBtn');
  var searchBar = document.getElementById('searchBar');
  if (searchBtn && searchBar) {
    searchBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = searchBar.classList.toggle('open');
      searchBar.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        var input = searchBar.querySelector('input[name="q"]');
        if (input) input.focus();
      }
    });
  }

  // Members Corner auto-rotating carousel
  var carousel = document.getElementById('cornerCarousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dotsWrap = document.getElementById('cornerDots');
    var current = 0;
    var timer = null;

    if (slides.length > 1 && dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          goTo(i);
          restart();
        });
        dotsWrap.appendChild(dot);
      });
    }
    var dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];

    function goTo(i) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (slides.length > 1) timer = setInterval(function () { goTo(current + 1); }, 4500);
    }
    restart();
    carousel.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    carousel.addEventListener('mouseleave', restart);
  }
})();
