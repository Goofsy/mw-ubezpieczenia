import $ from 'jquery';

class View {
  _sidebar = document.querySelector('.sidebar');
  _overlay = document.querySelector('.overlay');
  _hamburger = document.querySelector('.hamburger');
  constructor() {
    this._openSidebarHandler();
    this._closeSidebarByOverlayHandler();
    this._closeSidebarByLink();
  }

  _closeSidebar() {
    this._overlay.style.display = 'none';
    this._sidebar.classList.add('hidden');
  }

  _openSidebar() {
    this._overlay.style.display = 'block';
    this._sidebar.classList.remove('hidden');
  }

  _closeSidebarByLink = () => {
    this._sidebar.addEventListener('click', e => {
      const link = e.target.closest('.nav__item');
      if (!link) return;
      this._closeSidebar();
    });
  };

  _closeSidebarByOverlayHandler() {
    this._overlay.addEventListener('click', this._closeSidebar.bind(this));
  }

  _openSidebarHandler() {
    this._hamburger.addEventListener('click', this._openSidebar.bind(this));
  }
}
export default new View();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  });
});
