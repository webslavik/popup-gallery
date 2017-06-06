'use strict';

// (function() {

// 	let images = document.querySelectorAll('.photo');
// 	let overlay = document.querySelector('#overlay');
// 	let slideList = document.querySelector('.slides-list');
// 	let next = document.querySelector('#next');
// 	let previous = document.querySelector('#previous');
// 	let thumbnailsTrack = document.querySelector('.thumbnails-track');
// 	let thumbnail = document.querySelectorAll('.thumbnail');

// 	let slide;
// 	let thumbnailsLength;
// 	let currentSlide = 0;
// 	let imagesLink = [];
// 	let count = 0;
// 	let move = 172;


// 	images.forEach(function(el, index) {
// 		el.addEventListener('click', function(event) {
// 			currentSlide = index;
// 			showModal();
// 			getImagesLink();
// 			createSlides();
// 			createThumbnails();
// 		});
// 	});

// 	function showModal() {
// 		overlay.classList.add('is-show');
// 	}


// 	function createSlides() {
// 		for (let i = 0; i < imagesLink.length; i++) {
// 			let li = document.createElement('li');
// 			let div = document.createElement('div');

// 			if (i == currentSlide)
// 				li.classList.add('slide', 'is-show');
// 			else		
// 				li.classList.add('slide');

// 			div.classList.add('slide-image');
// 			div.style.backgroundImage = imagesLink[i];

// 			li.appendChild(div);
// 			slideList.appendChild(li);
// 		}

// 		slide = document.querySelectorAll('.slide');
// 	}

// 	function createThumbnails() {
// 		for (let i = 0; i < imagesLink.length; i++) {
// 			let li = document.createElement('li');
// 			let div = document.createElement('div');

// 			if (i == currentSlide)
// 				li.classList.add('thumbnail', 'is-active');
// 			else		
// 				li.classList.add('thumbnail');

// 			div.classList.add('thumbnail-photo');
// 			div.style.backgroundImage = imagesLink[i];

// 			li.appendChild(div);
// 			thumbnailsTrack.appendChild(li);
// 		}

// 		thumbnail = document.querySelectorAll('.thumbnail');
// 		// console.log(thumbnail);
// 		thumbnailClick();
// 	}

// 	function getImagesLink() {
// 		images.forEach(function(el) {
// 			let children = el.childNodes;
// 			for (let i = 0; i < children.length; i++) {
// 				if (children[i].tagName == 'DIV')
// 					imagesLink.push(children[i].style.backgroundImage);
// 			}
// 		});
// 	}


// 	overlay.addEventListener('click', function(evet) {
// 		if (!evet.target.classList.contains('overlay'))
// 			return false;

// 		this.classList.remove('is-show');
// 		imagesLink = [];
// 		removeSlideChildren(slideList);
// 		removeSlideChildren(thumbnailsTrack);
// 	});

// 	function removeSlideChildren(element) {
// 		while (element.firstChild)
// 			element.removeChild(element.firstChild);
// 	}


// 	/*
// 		------------------------------------------------
// 			Navigation
// 		------------------------------------------------
// 	*/ 
// 	next.addEventListener('click', function() {
// 		nextPhoto();
// 	});

// 	previous.addEventListener('click', function() {
// 		previousPhoto();
// 	});
	
// 	function nextPhoto() {
// 		goToPhoto(currentSlide + 1);
// 		thumbnailsTrackMove('next');
// 	}

// 	function previousPhoto() {
// 		goToPhoto(currentSlide - 1);
// 		thumbnailsTrackMove('prev');
// 	}


// 	function thumbnailClick() {
// 		thumbnailsLength = thumbnail.length;
// 		thumbnail.forEach(function(el, index) {
// 			el.addEventListener('click', function() {
// 				goToPhoto(index);
// 			});
// 		})
// 	}

// 	function goToPhoto(index) {
// 		slide[currentSlide].classList.remove('is-show');
// 		thumbnail[currentSlide].classList.remove('is-active');
// 		currentSlide = (index + slide.length) % slide.length;
// 		slide[currentSlide].classList.add('is-show');
// 		thumbnail[currentSlide].classList.add('is-active');
// 	}

// 	function thumbnailsTrackMove(direction) {
		
// 		if (direction == 'next') {
// 			count = (count + 1) % thumbnailsLength;
// 			let moveDistance = count * move;
// 			console.log(count);
// 			if (moveDistance >= 516) {
// 				thumbnailsTrack.style.transform = 'translateX(-' + 516 + 'px)';
// 			} else if (count === (thumbnail.length - 1))  {
// 				thumbnailsTrack.style.transform = 'translateX(' + 0 + 'px)';
// 			} else {
// 				thumbnailsTrack.style.transform = 'translateX(-' + (count * move) + 'px)';
// 			}
// 		} 

// 		if (direction == 'prev') {
// 			count = (count - 1) % thumbnailsLength;
// 			let moveDistance = count * move;

// 			if (count === -1) {
// 				count = thumbnailsLength - 1;
// 				thumbnailsTrack.style.transform = 'translateX(-' + 516 + 'px)';
// 			} else {
// 				thumbnailsTrack.style.transform = 'translateX(-' + count * (move / 2) + 'px)';
// 			}
// 		}

// 		// if (direction == 'next') {
// 		// 	thumbnailsTrack.style.transform = 'translateX(-' + (count * move) + 'px)';
// 		// 	count = (count + 1) % thumbnailsLength;
// 		// } else {
// 		// 	count = (count - 1) % thumbnailsLength;
// 		// 	if ( count == -1 )
// 		// 		count = thumbnailsLength - 1;
// 		// 	// thumbnailsTrack.style.transform = 'translateX(' + (count * move) + 'px)'
// 		// }
// 	}

// })();



(function() {

	function SkySlider() {
		this.images = document.querySelectorAll('.skySlider img');
		this.content = null;
		this.overlay = null;
		this.ul = null;
		this.li = null;
		this.img = null;
		this.currentImage = null;
	}

	SkySlider.prototype.open = function(index) {
		this.create();
		this.overlay.addEventListener('click', this.close.bind(this));
		this.overlay.classList.add('is-open');

		console.log(this.currentImage);
	}

	SkySlider.prototype.close = function() {
		this.overlay.parentNode.removeChild(this.overlay);
	}

	SkySlider.prototype.create = function() {
		let docFrag = document.createDocumentFragment();
		let images = document.querySelectorAll('.skySlider img');
		
		this.overlay = document.createElement('div');
		this.overlay.classList.add('skySlider-overlay');
		docFrag.appendChild(this.overlay);
		
		this.content = document.createElement('div');
		this.content.classList.add('skySlider-content');
		this.overlay.appendChild(this.content);

		this.ul = document.createElement('ul');
		this.ul.classList.add('skySlider-slider');

		for (let i = 0; i < images.length; i++) {
			this.li = document.createElement('li');
			this.li.classList.add('skySlider-slide')
			if (this.currentImage === i) {
				this.li.classList.add('is-current');
			}
			this.img = document.createElement('img');
			this.img.setAttribute('src', images[i].getAttribute('src'));
			this.li.appendChild(this.img);
			this.ul.appendChild(this.li)
		}

		this.content.appendChild(this.ul);

		document.body.appendChild(docFrag);
	}



	let modal = new SkySlider();
	let images = document.querySelectorAll('.photo');

	images.forEach(function(el, index) {
		el.addEventListener('click', function(event) {
			modal.currentImage = index;
			modal.open();
		});
	});

})()

