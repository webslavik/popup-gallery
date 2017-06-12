'use strict';

(function() {

	function SkySlider() {

		this.options = {
			showThumbItems: 5
		};

		this.init();
	}

	SkySlider.prototype.init = function() {
		this.el = document.querySelector('.skySlider');
		this.children = this.el.children;
		this.images = this.el.querySelectorAll('img');

		Array.from(this.children, (el, index) => {
			el.addEventListener('click', (e) => {
				modal.open(index);
			});
		});

		this.overlay = null;
		this.sliderWrap = null;
		this.slider = null;
		this.ulBelt = null;
		this.li = null;
		this.img = null;

		this.next = null;
		this.prev = null;

		this.thumbnailsWrap = null;
		this.thumbnailsList = null;
		this.thumbnail = null;

		this.index = 0;
		this.total = 0;
	};

	SkySlider.prototype.open = function(index) {

		this.index = index;
		this.create();
		this.moveSlider();
		// this.actions(this.index);
		this.thumbnailsActions();
		this.overlay.classList.add('is-open');

		this.overlay.addEventListener('click', (e) => {
			let target = e.target;
			if (!target.classList.contains('skySlider-overlay')) {
				return false;
			}
			this.close();
		});
	}

	SkySlider.prototype.close = function() {
		this.overlay.parentNode.removeChild(this.overlay);
	}

	SkySlider.prototype.create = function() {
		let docFrag = document.createDocumentFragment();
		
		this.overlay = document.createElement('div');
		this.overlay.classList.add('skySlider-overlay');
		docFrag.appendChild(this.overlay);
		
		this.sliderWrap = document.createElement('div');
		this.sliderWrap.classList.add('skySlider-slider-wrap');
		this.overlay.appendChild(this.sliderWrap);

		// create Slider navigations
		//--------------------------------------------------------
		this.next = document.createElement('div');
		this.next.classList.add('skySlider-arrow', 'next');
		this.next.innerHTML = 'next';

		this.prev = document.createElement('div');
		this.prev.classList.add('skySlider-arrow', 'prev');
		this.prev.innerHTML = 'prev';

		this.sliderWrap.appendChild(this.next);
		this.sliderWrap.appendChild(this.prev);

		// create Images list
		//--------------------------------------------------------
		this.slider = document.createElement('div');
		this.slider.classList.add('skySlider-slider');
		this.sliderWrap.appendChild(this.slider);

		this.ulBelt = document.createElement('ul');
		this.ulBelt.classList.add('skySlider-slider-belt');

		for (let i = 0; i < this.images.length; i++) {
			this.li = document.createElement('li');
			this.li.classList.add('skySlider-slide')
			if (this.index === i) {
				this.li.classList.add('is-current');
			}
			this.img = document.createElement('img');
			this.img.setAttribute('src', this.images[i].getAttribute('src'));
			this.li.appendChild(this.img);
			this.ulBelt.appendChild(this.li)
		}
		this.total = this.ulBelt.children.length;

		this.slider.appendChild(this.ulBelt);

		// create Thumbnails
		//--------------------------------------------------------
		this.thumbnailsWrap = document.createElement('div');
		this.thumbnailsWrap.classList.add('skySlider-thumbnails-wrap');
		this.thumbnailsList = document.createElement('ul');
		this.thumbnailsList.classList.add('skySlider-thumbnails-list');

		for (let i = 0; i < this.images.length; i++) {
			this.thumbnail = document.createElement('li');
			this.thumbnail.classList.add('skySlider-thumbnail')
			if (this.index === i) {
				this.thumbnail.classList.add('is-current');
			}
			this.img = document.createElement('img');
			this.img.setAttribute('src', this.images[i].getAttribute('src'));
			this.thumbnail.appendChild(this.img);
			this.thumbnailsList.appendChild(this.thumbnail);
		}
		this.thumbnailsWrap.appendChild(this.thumbnailsList);
		this.overlay.appendChild(this.thumbnailsWrap);

		document.body.appendChild(docFrag);
	}

	SkySlider.prototype.thumbnailsActions = function() {
		let thumbnails = this.thumbnailsList.children;

		Array.from(thumbnails, (el, index) => {
			el.addEventListener('click', () => {
				let siblings = el.parentNode.children;

				for (let i = 0; i < siblings.length; i++) 
					if (siblings[i].classList.contains('is-current'))
						siblings[i].classList.remove('is-current');

				el.classList.add('is-current');

				this.index = index;
				// this.slideTo(index);
			});
		});
	}
	
	// SkySlider.prototype.actions = function(index) {
	// 	this.prev.addEventListener('click', () => {
	// 		this.index--;

	// 		if (this.index < 0) {
	// 			this.index = this.total - 1;
	// 		}

	// 		this.thumbnailActive();
	// 		this.slideTo(this.index);
	// 	});

	// 	this.next.addEventListener('click', () => {
	// 		this.index++;

	// 		if (this.index == this.total) {
	// 			this.index = 0;
	// 		}

	// 		this.thumbnailActive();
	// 		this.slideTo(this.index);
	// 	});
	// }

	SkySlider.prototype.thumbnailActive = function() {
		let thumbnails = this.thumbnailsList.children;
		Array.from(thumbnails, (el, index) => {
			let siblings = el.parentNode.children;

			for (let i = 0; i < siblings.length; i++) 
				if (siblings[i].classList.contains('is-current'))
					siblings[i].classList.remove('is-current');
			
				siblings[this.index].classList.add('is-current');
		});
	}

	// SkySlider.prototype.slideTo = function(index) {
	// 	let slide = this.ulBelt.children;

	// 	Array.from(slide, (elem, indexEl) => {
	// 		if (elem.classList.contains('is-current')) {
	// 			elem.classList.remove('is-current');
	// 		}
	// 		if (indexEl == index) {
	// 			elem.classList.add('is-current');
	// 		}
	// 	});
	// }

	SkySlider.prototype.moveSlider = function() {

		let sliderWidth = this.slider.offsetWidth,
			liElements = this.ulBelt.children,
			liCount = liElements.length,
			liWidth = liElements[0].offsetWidth,
			ulBeltLeft, // rename?
			startX,
			startY,
			distX,
			distY,
			dir,
			totalDist,
			currentIndex = this.index,
			threshold = 150,
			restraint = 100,
			allowedTime = 500,
			startTime,
			elepsedTime;

			
		this.ulBelt.style.width = `${liWidth * liCount}px`;
		this.ulBelt.style.transform = `translate3d(-${currentIndex * liWidth}px,0,0)`;

		// for Mouse
		//------------------------------------------------------
		this.slider.addEventListener('mousedown', (e) => {
			e.preventDefault();

			this.ulBelt.style.transition = 'all 300ms ease-out';
			ulBeltLeft = parseInt(getTransformValue(this.ulBelt));
			startX = e.pageX;
			startTime = new Date().getTime();
		});

		this.slider.addEventListener('mouseup', (e) => {
			distX = e.pageX - startX;
			dir = (distX < 0) ? 'left' : 'right';
			currentIndex = (dir == 'left') ? Math.min(currentIndex+1, liCount-1) : Math.max(currentIndex-1,0);
			this.ulBelt.style.transform = `translate3d(-${currentIndex * liWidth}px,0,0)`;
		});


		// for Touch
		//------------------------------------------------------
		this.slider.addEventListener('touchstart', (e) => {
			e.preventDefault();

			this.ulBelt.style.transition = 'all 300ms ease-out';
			ulBeltLeft = parseInt(getTransformValue(this.ulBelt));
			let touchObj = e.changedTouches[0];
			startX = touchObj.pageX;
			startY = touchObj.pageY;
			startTime = new Date().getTime();
		});

		this.slider.addEventListener('touchmove', (e) => {
			e.preventDefault();

			let touchObj = e.changedTouches[0];
			totalDist = distX + ulBeltLeft;
			distX = touchObj.pageX - startX;
			dir = (distX < 0) ? 'left' : 'right';
		});

		this.slider.addEventListener('touchend', (e) => {
			e.preventDefault();

			elepsedTime = new Date().getTime() - startTime;

			if (elepsedTime < allowedTime) {
				currentIndex = (dir == 'left') ? Math.min(currentIndex+1, liCount-1) : Math.max(currentIndex-1, 0);
				this.ulBelt.style.transform = `translate3d(-${currentIndex * liWidth}px,0,0)`;
			}
		});
	}


	// get translate3d value
	//--------------------------------------------
	function getTransformValue(el) {
		let transform = el.style.transform;
		let xyzArray = transform.replace(/translate3d|px|\(|\)/gi, '').split(',');
		return xyzArray[0];
	}



	//-------------------------------------------------
	let modal = new SkySlider();

})()

