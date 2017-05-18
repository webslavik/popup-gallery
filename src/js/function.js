'use strict';

(function() {

	let images = document.querySelectorAll('.photo');
	let overlay = document.querySelector('.overlay');
	let slides = document.querySelectorAll('.slide');
	let next = document.querySelector('#next');
	let previous = document.querySelector('#previous');
	let controls = document.querySelectorAll('.controls');
	let currentSlide = 0;


	images.forEach(function(image, index) {
		image.addEventListener('click', function(event) {
			showModal(index);
		});
	});

	function showModal(index) {
		overlay.classList.toggle('is-show');
		overlay.stopPropagation();
	}

	// overlay.addEventListener('click', function() {
	// 	this.classList.toggle('is-show');
	// });


	function nextSlide() {
		goToSlide(currentSlide + 1);
	}

	function previousSlide() {
		goToSlide(currentSlide - 1);
	}

	function goToSlide(n) {
		slides[currentSlide].classList.remove('is-show');
		currentSlide = (n + slides.length) % slides.length;
		slides[currentSlide].classList.add('is-show');

		console.log(currentSlide);
	}

	next.addEventListener('click', function() {
		nextSlide();
	});

	previous.addEventListener('click', function() {
		previousSlide();
	});



})();
