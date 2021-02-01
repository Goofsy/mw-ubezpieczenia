import 'core-js';
import 'regenerator-runtime/runtime';
import $ from 'jquery';

class Navbar {
  sidebar = document.querySelector('.sidebar');
  navbar = document.querySelector('.navbar');
  overlay = document.querySelector('.overlay');
  hamburger = document.querySelector('.hamburger');
  offer = document.querySelector('#offer');
  constructor() {
    this.openSidebarHandler();
    this.closeSidebarByOverlayHandler();
    this.closeSidebarByLink();
    this.stickyNavbar();
    this.addClassOnScrollHandler();
  }

  addClassOnScroll = function () {
    const windowTop = $(window).scrollTop();
    $('[id]').each(function (index, elem) {
      const offsetTop = $(elem).offset().top;
      const outerHeight = $(this).outerHeight(true);
      if (windowTop > offsetTop - 500 && windowTop < offsetTop + outerHeight) {
        const elemId = $(elem).attr('id');
        $('nav ul li a.active').removeClass('active');
        $("nav ul li a[href='#" + elemId + "']").addClass('active');
      }
    });
  };

  addClassOnScrollHandler = () => {
    $(window).on('scroll', () => {
      this.addClassOnScroll();
    });
  };

  smoothBar = $(document).on('click', 'a[href^="#"]', function (e) {
    e.preventDefault();
    $('html, body').animate(
      {
        scrollTop: $($.attr(this, 'href')).offset().top,
      },
      500
    );
  });

  // Sticky navbar
  stickyNavbar = () => {
    window.addEventListener('scroll', () => {
      const offerTopPosition = this.offer.getBoundingClientRect().top;
      console.log(offerTopPosition, window.scrollY);
      this.navbar.classList.toggle('sticky', offerTopPosition < 80);
    });
  };

  // Sidebar
  closeSidebar() {
    this.overlay.style.display = 'none';
    this.sidebar.classList.add('hidden');
  }

  openSidebar() {
    this.overlay.style.display = 'block';
    this.sidebar.classList.remove('hidden');
  }

  closeSidebarByLink = () => {
    this.sidebar.addEventListener('click', e => {
      const link = e.target.closest('.nav__item');
      if (!link) return;
      this.closeSidebar();
    });
  };

  closeSidebarByOverlayHandler() {
    this.overlay.addEventListener('click', this.closeSidebar.bind(this));
  }

  openSidebarHandler() {
    this.hamburger.addEventListener('click', this.openSidebar.bind(this));
  }
}
new Navbar();
