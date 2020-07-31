$(function () {
$('.icon-menu').click(function (e) {
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
				if (a.breakpoint > b.breakpoint) { return -1; } else { return 1; }
			});
			arr.sort(function(a, b) {
				if (a.place > b.place) { return 1; } else { return -1; }
			});
		}
		//Дополнительные сценарии адаптации
		function customAdapt() {
			//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		}
	}());

});

const menuParents = document.querySelectorAll('.menu-page__parent');
const menuPageBurger = document.querySelector('.menu-page__burger');
const menuPageBody = document.querySelector('.menu-page__body');

const searchSelect = document.querySelector('.search-page__title');
const categoriesSearch = document.querySelector('.categories-search');

for (let index = 0; index < menuParents.length; index++) {
	const menuParent = menuParents[index];
	menuParent.addEventListener('mouseenter', (e) => {
		menuParent.classList.add('active');
	});
	menuParent.addEventListener('mouseleave', (e) => {
		menuParent.classList.remove('active');
	});

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
	console.log(checkboxCategory[index]);

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
