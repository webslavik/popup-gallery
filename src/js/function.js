'use strict';

(function() {

	let images = document.querySelectorAll('.photo');
	let overlay = document.querySelector('#overlay');
	let slideList = document.querySelector('.slides-list');
	let next = document.querySelector('#next');
	let previous = document.querySelector('#previous');
	let thumbnailsTrack = document.querySelector('.thumbnails-track');
	let thumbnail = document.querySelectorAll('.thumbnail');

	let slide;
	let currentSlide = 0;
	let imagesLink = [];


	images.forEach(function(image, index) {
		image.addEventListener('click', function(event) {
			currentSlide = index;
			showModal();
			getImagesLink();
			createSlides();
			createThumbnails();

		});
	});

	function showModal() {
		overlay.classList.add('is-show');
	}


	function createSlides() {
		for (let i = 0; i < imagesLink.length; i++) {
			let li = document.createElement('li');
			let div = document.createElement('div');

			if (i == currentSlide)
				li.classList.add('slide', 'is-show');
			else		
				li.classList.add('slide');

			div.classList.add('slide-image');
			div.style.backgroundImage = imagesLink[i];

			li.appendChild(div);
			slideList.appendChild(li);
		}

		slide = document.querySelectorAll('.slide');
	}

	function createThumbnails() {
		for (let i = 0; i < imagesLink.length; i++) {
			let li = document.createElement('li');
			let div = document.createElement('div');

			if (i == currentSlide)
				li.classList.add('thumbnail', 'is-active');
			else		
				li.classList.add('thumbnail');

			div.classList.add('thumbnail-photo');
			div.style.backgroundImage = imagesLink[i];

			li.appendChild(div);
			thumbnailsTrack.appendChild(li);
		}

		thumbnail = document.querySelectorAll('.thumbnail');
		// console.log(thumbnail);
		thumbnailClick();
	}

	function getImagesLink() {
		images.forEach(function(el) {
			let children = el.childNodes;
			for (let i = 0; i < children.length; i++) {
				if (children[i].tagName == 'DIV')
					imagesLink.push(children[i].style.backgroundImage);
			}
		});
	}


	overlay.addEventListener('click', function(evet) {
		if (!evet.target.classList.contains('overlay'))
			return false;

		this.classList.remove('is-show');
		imagesLink = [];
		removeSlideChildren(slideList);
		removeSlideChildren(thumbnailsTrack);
	});

	function removeSlideChildren(element) {
		while (element.firstChild)
			element.removeChild(element.firstChild);
	}


	/*
		------------------------------------------------
			Navigation
		------------------------------------------------
	*/ 
	next.addEventListener('click', function() {
		nextPhoto();
	});

	previous.addEventListener('click', function() {
		previousPhoto();
	});
	
	function nextPhoto() {
		goToPhoto(currentSlide + 1);
	}

	function previousPhoto() {
		goToPhoto(currentSlide - 1);
	}

	function goToPhoto(num) {
		slide[currentSlide].classList.remove('is-show');
		thumbnail[currentSlide].classList.remove('is-active');
		currentSlide = (num + slide.length) % slide.length;
		slide[currentSlide].classList.add('is-show');
		thumbnail[currentSlide].classList.add('is-active');
	}

	function thumbnailClick() {
		thumbnail.forEach(function(el, index) {
			el.addEventListener('click', function() {
				goToPhoto(index);
			});
		})
		
	}

})();
