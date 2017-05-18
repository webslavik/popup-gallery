'use strict';

(function() {

	let images = document.querySelectorAll('.photo');
	let overlay = document.querySelector('#overlay');
	let slideList = document.querySelector('.slides-list');
	let next = document.querySelector('#next');
	let previous = document.querySelector('#previous');

	let slide;
	let currentSlide = 0;
	let imagesLink = [];


	images.forEach(function(image, index) {
		image.addEventListener('click', function(event) {
			showModal(index);
			createSlide();
		});
	});

	function showModal(index) {
		overlay.classList.toggle('is-show');
	}

	function createSlide() {
		getImagesLink();

		if (imagesLink.length) {
			for (let i = 0; i < imagesLink.length; i++) {
				let li = document.createElement('li');
				let img = document.createElement('img');

				if (i == 0)
					li.classList.add('slide', 'is-show');
				else		
					li.classList.add('slide');

				img.setAttribute('src', imagesLink[i]);

				li.appendChild(img);
				slideList.appendChild(li);
			}
		} else {
				console.error('List is empy (ノ_<。)');
		}

		slide = document.querySelectorAll('.slide');
	}

	function getImagesLink() {
		images.forEach(function(el) {
			let children = el.childNodes;
			for (let i = 0; i < children.length; i++) {
				if (children[i].tagName == 'IMG')
					imagesLink.push(children[i].getAttribute('src'));
			}
		});
	}


	overlay.addEventListener('click', function(evet) {
		// let children = overlay.querySelectorAll('*');
		this.classList.toggle('is-show');
		imagesLink = [];

		removeslideChildren();
		// console.log(evet);
	});

	function removeslideChildren() {
		while (slideList.firstChild)
			slideList.removeChild(slideList.firstChild);
	}



	// Navigation
	function nextSlide() {
		goToSlide(currentSlide + 1);
	}

	function previousSlide() {
		goToSlide(currentSlide - 1);
	}

	function goToSlide(n) {
		slide[currentSlide].classList.remove('is-show');
		currentSlide = (n + slide.length) % slide.length;
		slide[currentSlide].classList.add('is-show');

		console.log(currentSlide);
	}

	next.addEventListener('click', function() {
		nextSlide();
	});

	previous.addEventListener('click', function() {
		previousSlide();
	});



})();
