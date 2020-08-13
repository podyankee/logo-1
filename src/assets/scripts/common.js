$(function() {
  $('.icon-menu').click(function(e) {
    $('.icon-menu').toggleClass('active');
    $('.menu__body').toggleClass('active');
  });


  // Dynamic Adapt v.1
  // HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
  // e.x. data-da="item,2,992"
  // Andrikanych Yevhen 2020
  // https://www.youtube.com/c/freelancerlifestyle

  "use strict";

  (function() {
    let originalPositions = [];
    let daElements = document.querySelectorAll('[data-da]');
    let daElementsArray = [];
    let daMatchMedia = [];
    //Заполняем массивы
    if (daElements.length > 0) {
      let number = 0;
      for (let index = 0; index < daElements.length; index++) {
        const daElement = daElements[index];
        const daMove = daElement.getAttribute('data-da');
        if (daMove != '') {
          const daArray = daMove.split(',');
          const daPlace = daArray[1] ? daArray[1].trim() : 'last';
          const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
          const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
          const daDestination = document.querySelector('.' + daArray[0].trim());
          if (daArray.length > 0 && daDestination) {
            daElement.setAttribute('data-da-index', number);
            //Заполняем массив первоначальных позиций
            originalPositions[number] = {
              "parent": daElement.parentNode,
              "index": indexInParent(daElement)
            };
            //Заполняем массив элементов
            daElementsArray[number] = {
              "element": daElement,
              "destination": document.querySelector('.' + daArray[0].trim()),
              "place": daPlace,
              "breakpoint": daBreakpoint,
              "type": daType
            };
            number++;
          }
        }
      }
      dynamicAdaptSort(daElementsArray);

      //Создаем события в точке брейкпоинта
      for (let index = 0; index < daElementsArray.length; index++) {
        const el = daElementsArray[index];
        const daBreakpoint = el.breakpoint;
        const daType = el.type;

        daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
        daMatchMedia[index].addListener(dynamicAdapt);
      }
    }
    //Основная функция
    function dynamicAdapt(e) {
      for (let index = 0; index < daElementsArray.length; index++) {
        const el = daElementsArray[index];
        const daElement = el.element;
        const daDestination = el.destination;
        const daPlace = el.place;
        const daBreakpoint = el.breakpoint;
        const daClassname = "_dynamic_adapt_" + daBreakpoint;

        if (daMatchMedia[index].matches) {
          //Перебрасываем элементы
          if (!daElement.classList.contains(daClassname)) {
            let actualIndex = indexOfElements(daDestination)[daPlace];
            if (daPlace === 'first') {
              actualIndex = indexOfElements(daDestination)[0];
            } else if (daPlace === 'last') {
              actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
            }
            daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
            daElement.classList.add(daClassname);
          }
        } else {
          //Возвращаем на место
          if (daElement.classList.contains(daClassname)) {
            dynamicAdaptBack(daElement);
            daElement.classList.remove(daClassname);
          }
        }
      }
      customAdapt();
    }

    //Вызов основной функции
    dynamicAdapt();

    //Функция возврата на место
    function dynamicAdaptBack(el) {
      const daIndex = el.getAttribute('data-da-index');
      const originalPlace = originalPositions[daIndex];
      const parentPlace = originalPlace['parent'];
      const indexPlace = originalPlace['index'];
      const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
      parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
    }
    //Функция получения индекса внутри родителя
    function indexInParent(el) {
      var children = Array.prototype.slice.call(el.parentNode.children);
      return children.indexOf(el);
    }
    //Функция получения массива индексов элементов внутри родителя
    function indexOfElements(parent, back) {
      const children = parent.children;
      const childrenArray = [];
      for (let i = 0; i < children.length; i++) {
        const childrenElement = children[i];
        if (back) {
          childrenArray.push(i);
        } else {
          //Исключая перенесенный элемент
          if (childrenElement.getAttribute('data-da') == null) {
            childrenArray.push(i);
          }
        }
      }
      return childrenArray;
    }
    //Сортировка объекта
    function dynamicAdaptSort(arr) {
      arr.sort(function(a, b) {
        if (a.breakpoint > b.breakpoint) {
          return -1;
        } else {
          return 1;
        }
      });
      arr.sort(function(a, b) {
        if (a.place > b.place) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    //Дополнительные сценарии адаптации
    function customAdapt() {
      //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
  }());

});

let isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

const menuPageBurger = document.querySelector('.menu-page__burger');
const menuPageBody = document.querySelector('.menu-page__body');

const searchSelect = document.querySelector('.search-page__title');
const categoriesSearch = document.querySelector('.categories-search');


if (isMobile.any()) {
  const menuParents = document.querySelectorAll('.menu-page__parent>a');
  for (let index = 0; index < menuParents.length; index++) {
    const menuParent = menuParents[index];
    menuParent.addEventListener('click', (e) => {
      e.preventDefault();
      menuParent.parentElement.classList.toggle('active');
    });
  }
} else {
  const menuParents = document.querySelectorAll('.menu-page__parent');
  for (let index = 0; index < menuParents.length; index++) {
    const menuParent = menuParents[index];
    menuParent.addEventListener('mouseenter', (e) => {
      menuParent.classList.add('active');
    });
    menuParent.addEventListener('mouseleave', (e) => {
      menuParent.classList.remove('active');
    });
  }
}
menuPageBurger.addEventListener('click', (e) => {
  menuPageBurger.classList.toggle('active');
  menuPageBody.classList.toggle('active');
});

searchSelect.addEventListener('click', (e) => {
  searchSelect.classList.toggle('active');
  categoriesSearch.classList.toggle('active');
});


const checkboxCategories = document.querySelectorAll('.categories-search__checkbox');

for (let index = 0; index < checkboxCategories.length; index++) {
  const checkboxCategory = checkboxCategories[index];

  checkboxCategory.addEventListener('change', () => {
    checkboxCategory.classList.toggle('active');

    const checkboxActiveCategories = document.querySelectorAll('.categories-search__checkbox.active');
    if (checkboxActiveCategories.length > 0) {
      searchSelect.classList.add('categories');
      const searchQuantity = searchSelect.querySelector('.search-page__quantity');
      searchQuantity.innerHTML = searchQuantity.getAttribute('data-text') + ' ' + checkboxActiveCategories.length;
    } else {
      searchSelect.classList.remove('categories');
    }
  });

}

import Swiper from 'swiper/swiper-bundle';
import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

// Swiper slider

let sliders = document.querySelectorAll('.swiper-container');
if (sliders) {
  for (let index = 0; index < sliders.length; index++) {
    let slider = sliders[index];
    if (!slider.classList.contains('swiper-build')) {
      let sliderItems = slider.children;
      if (sliderItems) {
        for (let index = 0; index < sliderItems.length; index++) {
          let el = sliderItems[index];
          el.classList.add('swiper-slide');
        }
      }
      let sliderContent = slider.innerHTML;
      let sliderWrapper = document.createElement('div');
      let sliderPagination = document.createElement('div');
      sliderWrapper.classList.add('swiper-wrapper');
      sliderWrapper.innerHTML = sliderContent;
      slider.innerHTML = '';
      slider.appendChild(sliderWrapper);
      slider.appendChild(sliderPagination);
      slider.classList.add('swiper-build');
    }
  }
}


if (document.querySelector('.mainslider')) {
  const sliderWrapper = document.querySelector('.swiper-wrapper');
  const sliderPagination = sliderWrapper.nextElementSibling;
  sliderPagination.classList.add('mainslider__dots');
  let mainslider = new Swiper('.mainslider__body', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    speed: 800,
    pagination: {
      el: '.mainslider__dots',
      clickable: true
    },
    // loop: true
  });

  const mainSliderImages = document.querySelectorAll('.mainslider__image');
  const mainSliderDots = document.querySelectorAll('.mainslider__dots .swiper-pagination-bullet');

  for (let index = 0; index < mainSliderImages.length; index++) {
    const mainSliderImage = mainSliderImages[index].querySelector('img').getAttribute('src');

    mainSliderDots[index].style.backgroundImage = "url('" + mainSliderImage + "')";
  }

}

if (document.querySelector('.products-slider')) {
  let productsSlider = new Swiper('.products-slider__item', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoHeight: true,
    speed: 800,
    pagination: {
      el: '.products-slider__info',
      type: 'fraction'
    },
    navigation: {
      nextEl: '.products-slider__arrow_next',
      prevEl: '.products-slider__arrow_prev',
    }
    // loop: true
  });
}
if (document.querySelector('.brands-slider')) {
  let brandsSlider = new Swiper('.brands-slider__body', {
    observer: true,
    observeParents: true,
    slidesPerView: 5,
    spaceBetween: 0,
    speed: 800,
    navigation: {
      nextEl: '.brands-slider__arrow_next',
      prevEl: '.brands-slider__arrow_prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        autoheight: true
      },
      480: {
        slidesPerView: 2,
      },
      600: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 5,
      },
    }
    // loop: true
  });
}

// Price filter

const priceSlider = document.querySelector('.price-filter__slider');

noUiSlider.create(priceSlider, {
  start: [0, 200000],
  connect: true,
  tooltips: [wNumb({
    decimals: 0
  }), wNumb({
    decimals: 0
  })],
  range: {
    'min': 0,
    'max': 200000
  }
});

const priceStart = document.getElementById('price-start');
const priceEnd = document.getElementById('price-end');

const setPriceValues = () => {
  let priceStartValue;
  let priceEndValue;
  if (priceStart.value != '') {
    priceStartValue = priceStart.value;
  }
  if (priceEnd.value != '') {
    priceEndValue = priceEnd.value;
  }
  priceSlider.noUiSlider.set([priceStartValue, priceEndValue]);
};

priceStart.addEventListener('change', setPriceValues);
priceEnd.addEventListener('change', setPriceValues);


// Filter spoiler


const spoiler = document.querySelectorAll('.spoiler');
spoiler.forEach(item => {
  item.addEventListener('click', () => {

    item.classList.toggle('active');
    item.nextSibling.classList.toggle('none');
  });
});

if (isMobile.any()) {
	const filterTitle = document.querySelector('.filter__title');
	filterTitle.addEventListener('click', () => {
		filterTitle.classList.toggle('active');
		filterTitle.nextElementSibling.classList.toggle('none');
	})
}
