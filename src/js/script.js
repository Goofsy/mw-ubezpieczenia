import $ from 'jquery';
import { Loader } from '@googlemaps/js-api-loader';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import Cookies from 'js-cookie';
import dotenv from 'dotenv';
dotenv.config();

class Cards {
  _cards = document.querySelector('.cards');
  _card = document.querySelectorAll('.card');

  constructor() {
    this._rotateCard();
    this._unRotateCard();
  }

  _unRotateCard() {
    document.body.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (card) return;
      this._card.forEach(card => card.classList.remove('rotate'));
    });
  }

  _rotateCard() {
    this._cards.addEventListener('click', e => {
      const card = e.target.closest('.card');
      if (!card) return;
      if (!card.classList.contains('rotate'))
        this._card.forEach(card => card.classList.remove('rotate'));
      card.classList.toggle('rotate');
    });
  }
}
new Cards();

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
    this.smoothScroll();
  }

  addClassOnScroll = function () {
    const windowTop = $(window).scrollTop();

    $('[id]').each(function (_, elem) {
      const offsetTop = $(elem).offset().top;
      const outerHeight = $(this).outerHeight(true);
      if (
        windowTop > offsetTop - 105 &&
        windowTop + 135 < offsetTop + outerHeight
      ) {
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

  smoothScroll = () => {
    $(document).on('click', 'a[href^="#"]', function (e) {
      e.preventDefault();
      const sectionTarget = document.querySelector(
        `#${this.href.split('#')[1]}`
      );
      const sectionIsHidden =
        sectionTarget.classList.contains('section--hidden');
      $('html, body').animate(
        {
          scrollTop:
            $($.attr(this, 'href')).offset().top -
            `${sectionIsHidden ? 207 : 79}`,
        },
        1000
      );
    });
  };

  stickyNavbar = () => {
    window.addEventListener('scroll', () => {
      const offerTopPosition = this.offer.getBoundingClientRect().top;
      this.navbar.classList.toggle('sticky', offerTopPosition <= 80);
    });
  };

  closeSidebar() {
    this.overlay.classList.add('hidden');
    this.sidebar.classList.add('hidden');
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  openSidebar() {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = 'fixed';
    this.overlay.classList.remove('hidden');
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

class SendEmail {
  _form = document.querySelector('.form');
  _formInfo = document.querySelector('.form__info');
  _formSpinner = document.querySelector('.form__spinner');
  _inputName = document.querySelector('#name');
  _inputEmail = document.querySelector('#email');
  _inputPhone = document.querySelector('#phone');
  _inputMessage = document.querySelector('#message');

  constructor() {
    this._handlerForm();
    this._addFilledClass();
    this._removeErrorClassHandler();
  }

  _handlerForm() {
    this._form.addEventListener('submit', this._handleForm.bind(this));
  }

  async _handleForm(e) {
    e.preventDefault();
    try {
      const _inputNameValue = this._inputName.value;
      const _inputEmailValue = this._inputEmail.value;
      const _inputPhoneValue = this._inputPhone.value;
      const _inputMessageValue = this._inputMessage.value;

      if (
        _inputNameValue.trim().length < 1 ||
        _inputNameValue === null ||
        _inputNameValue === ''
      ) {
        this._inputName.classList.add('form__group__input--error');
        throw new Error('Pole nie może być puste!');
      }

      if (!this._validateEmailAddress(_inputEmailValue)) {
        this._inputEmail.classList.add('form__group__input--error');
        throw new Error('Niepoprawny adres e-mail!');
      }

      if (
        _inputPhoneValue.trim().length < 8 ||
        _inputPhoneValue === null ||
        _inputPhoneValue === ''
      ) {
        this._inputPhone.classList.add('form__group__input--error');
        throw new Error('Nr telefonu musi zawierać przynajmniej 8 znaków!');
      }

      if (
        _inputMessageValue.trim().length < 1 ||
        _inputMessageValue === null ||
        _inputMessageValue === ''
      ) {
        this._inputMessage.classList.add('form__group__input--error');
        throw new Error('Pole nie może być puste!');
      }

      this._formSpinner.style.display = 'inline-block';

      const send = await this._sendEmail(
        _inputNameValue,
        _inputEmailValue,
        _inputPhoneValue,
        _inputMessageValue
      );
      this._formSpinner.style.display = 'none';

      if (send !== 'OK') throw new Error('Błąd połączenia');
      this._resetForm();
    } catch (err) {
      this._formInfo.innerHTML = err.message;
      this._formInfo.classList.add('form__info--error');
    }
  }

  _removeErrorClassHandler() {
    this._form.addEventListener('click', this._removeErrorClass.bind(this));
  }

  _removeErrorClass(e) {
    if (!e.target.closest('.form__group__input--error')) return;
    e.target.classList.remove('form__group__input--error');
    this._formInfo.innerHTML = '';
    this._formInfo.classList.remove('form__info--error');
  }

  _addFilledClass() {
    this._form.addEventListener('change', e => {
      if (e.target.value.length === 0 || e.target.value === '')
        e.target.classList.remove('form__group__input--filled');
      else {
        e.target.classList.add('form__group__input--filled');
      }
    });
  }
  _validateEmailAddress(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  _sendEmail(name, email, phone, message) {
    try {
      return Email.send({
        SecureToken: process.env.EMAIL_SECURE_TOKEN,
        To: process.env.EMAIL_TO,
        From: email,
        Subject: 'E-mail ze stronki',
        Body: `${name}, tel: ${phone}, Wiadomość: ${message}`,
      });
    } catch (err) {
      alert(err);
    }
  }

  _resetForm() {
    this._form.reset();
    const [...formInputs] = document.querySelectorAll('.form__group__input');

    formInputs.forEach(input => {
      input.classList.remove('form__group__input--filled');
    });

    this._formInfo.innerHTML = 'Wiadomość została wysłana';

    setTimeout(() => {
      this._formInfo.innerHTML = '';
    }, 4000);
  }
}
new SendEmail();

class InfiniteSlider {
  width = 0;
  oldWidth = 0;
  start = 0;
  refresh = 0;
  _prevStop = false;
  _stop = false;
  _oldTimestamp = 0;
  constructor(
    animTime = '10000',
    selector = '.slider',
    container = '#slider-container'
  ) {
    this.slider = document.querySelector(selector);
    this.container = document.querySelector(container);
    this.duration = parseInt(animTime);
  }

  animate() {
    const imgs = Array.prototype.slice
      .call(this.slider.querySelectorAll('img'))
      .filter(img => {
        return img.naturalWidth === 0;
      });
    if (imgs.length > 0) {
      window.requestAnimationFrame(this.animate.bind(this));
      return;
    }

    this.oldWidth = this.slider.offsetWidth;
    const sliderText =
      '<span class="slider-extra">' + this.slider.innerHTML + '</span>';
    this.slider.innerHTML += sliderText;

    this.width = this.slider.offsetWidth;
    const minWidth = 2 * screen.width;

    while (this.width < minWidth) {
      this.slider.innerHTML += sliderText;
      this.width = this.slider.width;
    }
    this.slider
      .querySelector('.slider-extra:last-child')
      .classList.add('slider-last');

    window.requestAnimationFrame(this.controlAnimation.bind(this));
  }

  halt() {
    this._stop = true;
    this._prevStop = false;
  }

  go() {
    this._stop = false;
    this._prevStop = true;
  }

  stagnate() {
    this.container.style.overflowX = 'scroll';
  }

  controlAnimation(timestamp) {
    if (this._stop === true) {
      if (this._prevStop === false) {
        this.slider.style.marginLeft = getComputedStyle(this.slider).marginLeft;
        this._prevStop = true;
        this._oldTimestamp = timestamp;
      }
    } else if (this._stop === false && this._prevStop === true) {
      this._prevStop = false;
      this.start = this.start + (timestamp - this._oldTimestamp);
    } else {
      if (this.refresh >= 1) {
        this.start = timestamp;
        this.slider.style.marginLeft = 0;
        this.refresh = 0;
        window.requestAnimationFrame(this.controlAnimation.bind(this));
        return;
      }
      if (timestamp - this.start >= this.duration) {
        this.refresh = 1;
      }

      const perc = ((timestamp - this.start) / this.duration) * this.oldWidth;
      this.slider.style.marginLeft = -perc + 'px';
    }
    window.requestAnimationFrame(this.controlAnimation.bind(this));
    return;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const slider = new InfiniteSlider(25000);

  slider.animate();
  document
    .querySelector('#slider-container')
    .addEventListener('mouseenter', slider.halt.bind(slider));
  document
    .querySelector('#slider-container')
    .addEventListener('mouseleave', slider.go.bind(slider));
});

class Map {
  loader = new Loader({
    apiKey: process.env.GOOGLE_MAP_API_KEY,
    version: 'weekly',
  });
  map;
  location = { lat: 49.972862, lng: 20.409 };
  contentString =
    '<div class="map__info">' +
    '<p>ul. Trinitatis 34a</p>' +
    '<p>32-700 Bochnia</p>' +
    '<a class="map__info__link" href="https://www.google.com/maps/dir//Trinitatis+34A,+32-700+Bochnia/@49.9728654,20.4068473,17z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x47163b3fbafab067:0x6e2b3d0ecdaadcca!2m2!1d20.409036!2d49.972862!3e0">Wyznacz trasę</a>' +
    '</div>';

  constructor() {
    this.loadMap();
  }

  loadMap() {
    this.loader.load().then(() => {
      this.map = new google.maps.Map(document.querySelector('.map'), {
        center: this.location,
        zoom: 14,
      });

      const marker = new google.maps.Marker({
        position: this.location,
        map: this.map,
      });

      const infowindow = new google.maps.InfoWindow({
        content: this.contentString,
      });

      marker.addListener('click', () => {
        infowindow.open(this.map, marker);
      });
    });
  }
}
new Map();

class RevealSections {
  _allSections = document.querySelectorAll('.section');
  _windowWidth = window.innerWidth;
  _sectionObserver = new IntersectionObserver(this._revealSection, {
    root: null,
    threshold: `${this._windowWidth > 680 ? 0.15 : 0.02}`,
  });

  constructor() {
    this._observeSection();
  }

  _revealSection(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }

  _observeSection() {
    this._windowWidth = window.innerWidth;
    this._allSections.forEach(section => {
      this._sectionObserver.observe(section);
      section.classList.add('section--hidden');
    });
  }
}

new RevealSections();

// Modal
class Modal {
  _modal = document.querySelector('.modal');
  _modalContent = document.querySelector('.modal__content');
  _modalContentList = document.querySelector('.modal__content__list');
  _modalContentHeader = document.querySelector('.modal__content__header');
  _btnOpen = document.querySelector('.btn__open--modal');
  _btnClose = document.querySelector('.btn__exit--modal');
  _modalOverlay = document.querySelector('.modal--overlay');
  constructor() {
    this._openModalBtnHandler();
    this._closeModalBtnHandler();
    this._closeModalOverlayHandler();
    this._closeModalEscHandler();
  }

  _openModalBtnHandler() {
    this._btnOpen.addEventListener('click', () => {
      this._modal.style.visibility = 'visible';
      this._modalContent.style.height = '323px';
      this._modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this._modalContentList.style.visibility = 'visible';
      this._modalContentHeader.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    });
  }

  _closeModalBtnHandler() {
    this._btnClose.addEventListener('click', () => this._closeModal());
  }

  _closeModalOverlayHandler() {
    this._modalOverlay.addEventListener('click', () => this._closeModal());
  }

  _closeModalEscHandler() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' || e.key === 'Esc') this._closeModal();
    });
  }

  _closeModal() {
    this._modal.style.visibility = 'hidden';
    this._modalContent.style.height = '0px';
    this._modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    this._modalContentList.style.visibility = 'hidden';
    this._modalContentHeader.style.visibility = 'hidden';
    document.body.style.overflow = 'auto';
  }
}
new Modal();

class Popup {
  _popup = document.querySelector('.popup');
  _acceptPopupBtn = document.querySelector('.btn__accept--popup');
  _closePopupBtn = document.querySelector('.btn__close--popup');

  constructor() {
    this._acceptPopupBtnHandler();
    this._checkIfAcceptedCookies();
    this._closePopupBtnHandler();
  }

  _checkIfAcceptedCookies() {
    if (Cookies.get('acceptedCookies') !== 'true') {
      this._popup.style.display = 'flex';
    }
  }

  _acceptPopupBtnHandler() {
    this._acceptPopupBtn.addEventListener('click', () => {
      this._popup.style.display = 'none';
      Cookies.set('acceptedCookies', 'true');
    });
  }

  _closePopupBtnHandler() {
    this._closePopupBtn.addEventListener('click', () => {
      this._popup.style.display = 'none';
      Cookies.set('acceptedCookies', 'true');
    });
  }
}
new Popup();
