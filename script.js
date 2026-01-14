'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button Scrolling Event

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log('section 1 >>>', s1coords);

  // console.log(e.target.getBoundingClientRect());

  // window.scrollTo({
  //   top: top + s1coords,
  //   left: left + s1coords,
  // });

  // It will give current scroll position from viewport top to document top position
  // console.log('current scroll X/Y', window.scrollX, window.scrollY);

  // It will give current viewport height and width from the selection
  // console.log(
  //   'Viewport height and width',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // Old way
  //  window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  // New way of scrolling
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

///////////////////////////////////////
// Page navigation

/* document.querySelectorAll('.nav__link').forEach(el => {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  });
}); */

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

//////////////////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // if (clicked) {
  //   clicked.classList.add('operations__tab--active');
  // }

  //  or

  // Guard clause
  if (!clicked) return;

  // Remove previous active class from both tab and content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Ativate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
      /* if (el !== link) el.style.opacity = opacity;
      logo.style.opacity = opacity; */
    });
  }
};

// Passing argumnet into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Also we can use these
/* nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
}); */

//////////////////////////////////////////////////
// Sticky navigation

// Old way bad performant

/* const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', function (e) {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}); */

// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  /*   entries.forEach(entry => {
    console.log(entry);
  }); */
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//////////////////////////////////////////////////
// Section reveal

const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    // After observe the target unobserve now
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//////////////////////////////////////////////////
// Lazy loading Image

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace img src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(entry => imgObserver.observe(entry));

//////////////////////////////////////////////////
// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  let maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    // Initially move the element to the right side
    goToSlide(0);
  };
  init();

  // Events
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDot(curSlide);
    }
  });
};
slider();

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// const header = document.querySelector('.header');

// Creating and inserting dom elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.textContent = `We use cookied for improved functionality and analytics.`;
// message.innerHTML = `We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));
// header.after(message);
// header.before(message);

// Deleting elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // Old ways to remove elements
//     // message.parentElement.removeChild(message);
//   });

// Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

/* console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color) */
// message.style.height = Number.parseFloat(getComputedStyle(message).height) + 10 + 'px';
// console.log(getComputedStyle(message).height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// Not standard
/* console.log(logo.designer);
console.log(logo.src);
console.log(logo.getAttribute('src'));
console.log(logo.getAttribute('designer'));
console.log(logo.setAttribute('company', 'Bankist')); */

/* const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href')); */

// Data attributes
// console.log(logo.dataset.versionNumber);

// Classes
/* logo.classList.add('a', 'b');
logo.classList.remove('a', 'b');
logo.classList.toggle('a');
logo.classList.contains('b');

// Don't use it
logo.className = 'Rana'; */

/////////////////////////////

/* const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener:: happened');

  // For once show this alert
  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter:: I am onmouseenter event');
// };

// Certain time it will vanish
// setTimeout(function (e) {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 3000);
 */

/////////////////////////////

// rgb(255, 255, 255)
/* 
const randInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randColor = () =>
  `rgb(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
//   console.log(e.target, e.currentTarget);

//   console.log(e.currentTarget === this);

//   // Don't use this
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
//   console.log(e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
//   console.log('target>>', e.target);
//   console.log('current>>', e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
// });
 */
/* 
const h1 = document.querySelector('h1');

// Going downwards: Child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
console.log((h1.firstElementChild.style.color = 'white'));
console.log((h1.lastElementChild.style.color = 'orangered'));

// Going upwards: Parent
console.log(h1.parentElement);
console.log(h1.parentNode);

h1.closest('.header').style.backgroundColor = 'orangered';
h1.closest('h1').style.backgroundColor = 'green';

// Going sideways: Siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// Selection all sibling
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(el => {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});
 */

/* document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('After page fully loaded', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = true;
}); */
