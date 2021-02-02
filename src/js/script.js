import 'core-js';
import 'regenerator-runtime/runtime';
import $ from 'jquery';
import { Loader } from '@googlemaps/js-api-loader';

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
      if (windowTop > offsetTop - 80 && windowTop < offsetTop + outerHeight) {
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
      $('html, body').animate(
        {
          scrollTop: $($.attr(this, 'href')).offset().top - 75,
        },
        500
      );
    });
  };

  stickyNavbar = () => {
    window.addEventListener('scroll', () => {
      const offerTopPosition = this.offer.getBoundingClientRect().top;
      this.navbar.classList.toggle('sticky', offerTopPosition < 80);
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
        throw new Error('Pole nie może byc puste!');
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
        throw new Error('Pole nie może byc puste!');
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
        SecureToken: '1b17ee09-4190-4d7c-bd83-efeb38674305',
        To: 'dawid.stud@gmail.com',
        From: email,
        Subject: 'E-mail ze stronki',
        Body: `${name}, tel: ${phone}, Wiadomość: ${message}`,
      });
    } catch (err) {
      console.log(err);
    }
  }

  _resetForm() {
    this._form.reset();
    const [...formInputs] = document.querySelectorAll('.form__group__input');

    formInputs.forEach(input => {
      input.classList.remove('form__group__input--filled');
    });

    this._formInfo.innerHTML = 'Wiadomośc została wysłana';

    setTimeout(() => {
      this._formInfo.innerHTML = '';
    }, 4000);
  }
}
new SendEmail();

class InfiniteSlider {
  constructor(
    animTime = '14000',
    selector = '.slider',
    container = '#slider-container'
  ) {
    this.slider = document.querySelector(selector);
    this.container = document.querySelector(container);
    this.width = 0;
    this.oldWidth = 0;
    this.duration = parseInt(animTime);
    this.start = 0;
    this.refresh = 0; //0, 1, or 2, as in steps of the animation
    this._prevStop = false;
    this._stop = false;
    this._oldTimestamp = 0;
  }

  animate() {
    /* fix for browsers who like to run JS before images are loaded */
    const imgs = Array.prototype.slice
      .call(this.slider.querySelectorAll('img'))
      .filter(img => {
        return img.naturalWidth === 0;
      });
    if (imgs.length > 0) {
      window.requestAnimationFrame(this.animate.bind(this));
      return;
    }

    /* Add another copy of the slideshow to the end, keep track of original width */
    this.oldWidth = this.slider.offsetWidth;
    const sliderText =
      '<span class="slider-extra">' + this.slider.innerHTML + '</span>';
    this.slider.innerHTML += sliderText;

    /* can have content still when we move past original slider */
    this.width = this.slider.offsetWidth;
    const minWidth = 2 * screen.width;

    /* Add more slideshows if needed to keep a continuous stream of content */
    while (this.width < minWidth) {
      this.slider.innerHTML += sliderText;
      this.width = this.slider.width;
    }
    this.slider
      .querySelector('.slider-extra:last-child')
      .classList.add('slider-last');

    /* loop animation endlesssly (this is pretty cool) */
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
    //console.log('this.stop: ' + this._stop + '\nthis.prevStop: ' + this._prevStop)
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
      //reset animation
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

  getIeWidth() {
    this.slider.style.marginLeft = '-99999px';
  }

  ie11Fix() {
    this.slider.querySelector('.slider-last').style.position = 'absolute';
  }
}

function detectIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');

  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  const slider = new InfiniteSlider(20000);
  const ie = detectIE();

  //Dont animate under IE10, just place the images
  if (ie !== false && ie < 10) {
    slider.stagnate();
    return;
  }
  //IE 11 and lower, fix for width *increasing* as more of the slider is shown
  if (ie !== false && ie < 12) {
    slider.getIeWidth();
  }

  slider.animate();
  document
    .querySelector('#slider-container')
    .addEventListener('mouseenter', slider.halt.bind(slider));
  document
    .querySelector('#slider-container')
    .addEventListener('mouseleave', slider.go.bind(slider));

  if (ie === 11) {
    setTimeout(slider.ie11Fix.bind(slider), 1000);
  }
});

class Map {
  loader = new Loader({
    apiKey: 'AIzaSyBjQKGHd-2F-00gM3vx-ugMwafHitZjzdg',
    version: 'weekly',
  });
  map;
  location = { lat: 49.972862, lng: 20.409 };
  contentString =
    '<div class="map__info">' +
    '<p>ul. Trinitatis 34a</p>' +
    '<p>32-700 Bochnia</p>' +
    '<a class="map__info__link" href="https://www.google.com/maps/dir/Trinitatis+34A,+32-700+Bochnia//@49.9723755,20.4089502,17z/data=!4m9!4m8!1m5!1m1!1s0x47163b3fbafab067:0x6e2b3d0ecdaadcca!2m2!1d20.409036!2d49.972862!1m0!3e0">Wyznacz trasę</a>' +
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

      infowindow.open(this.map, marker);
    });
  }
}
new Map();
