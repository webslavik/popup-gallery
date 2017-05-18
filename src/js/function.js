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
			currentSlide = index;
			showModal();
			createSlide();
		});
	});

	function showModal() {
		overlay.classList.add('is-show');
	}

	function createSlide() {
		getImagesLink();

		for (let i = 0; i < imagesLink.length; i++) {
			let li = document.createElement('li');
			let img = document.createElement('img');

			if (i == currentSlide)
				li.classList.add('slide', 'is-show');
			else		
				li.classList.add('slide');

			img.setAttribute('src', imagesLink[i]);

			li.appendChild(img);
			slideList.appendChild(li);
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
		if (!evet.target.classList.contains('overlay'))
			return false;

		this.classList.remove('is-show');
		imagesLink = [];
		removeslideChildren();
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
		// console.log(currentSlide);
	}

	next.addEventListener('click', function() {
		nextSlide();
	});

	previous.addEventListener('click', function() {
		previousSlide();
	});



})();
