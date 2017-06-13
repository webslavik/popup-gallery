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
	};

	SkySlider.prototype.open = function(index) {
		this.index = index;

		this.create();
		this.moveSlider();
		this.sliderArrows();
		this.thumbnailsActions();
		this.moveThumbnailsBelt();

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
		this.overlay = document.createElement('div');
		this.overlay.classList.add('skySlider-overlay');
		
		// create Slider
		//-------------------------------------------------------
		this.overlay.appendChild(this.createSlider());


		// create Thumbnails
		//--------------------------------------------------------
		this.overlay.appendChild(this.createThumbnails());

		document.body.appendChild(this.overlay);
	}

	SkySlider.prototype.createSlider = function() {
		this.sliderWrap = document.createElement('div');
		this.sliderWrap.classList.add('skySlider-slider-wrap');

		this.next = document.createElement('div');
		this.next.classList.add('skySlider-arrow', 'next');
		this.next.innerHTML = 'next';

		this.prev = document.createElement('div');
		this.prev.classList.add('skySlider-arrow', 'prev');
		this.prev.innerHTML = 'prev';

		this.sliderWrap.appendChild(this.next);
		this.sliderWrap.appendChild(this.prev);


		this.slider = document.createElement('div');
		this.slider.classList.add('skySlider-slider');
		this.sliderWrap.appendChild(this.slider);

		this.ulBelt = document.createElement('ul');
		this.ulBelt.classList.add('skySlider-slider-belt');
		this.slider.appendChild(this.ulBelt);


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

		return this.sliderWrap;
	}


	SkySlider.prototype.createThumbnails = function() {
		this.thumbnailsWrap = document.createElement('div');
		this.thumbnailsWrap.classList.add('skySlider-thumbnails-wrap');
		// this.

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

		return this.thumbnailsWrap;
	}

	SkySlider.prototype.thumbnailsActions = function() {
		let thumbnails = this.thumbnailsList.children,
			liWidth = this.li.offsetWidth;

		Array.from(thumbnails, (el, index) => {
			el.addEventListener('click', () => {
				let siblings = el.parentNode.children;

				for (let i = 0; i < siblings.length; i++) 
					if (siblings[i].classList.contains('is-current'))
						siblings[i].classList.remove('is-current');

				el.classList.add('is-current');

				this.index = index;
				this.ulBelt.style.transition = 'all 300ms ease-out';
				this.ulBelt.style.transform = `translate3d(-${this.index * liWidth}px,0,0)`;
			});
		});
	}

	SkySlider.prototype.changeActiveThumbnail = function() {
		let thumbnails = this.thumbnailsList.children;

		for (let i = 0; i < thumbnails.length; i++) {
			if (this.index === i) thumbnails[i].classList.add('is-current');
			else thumbnails[i].classList.remove('is-current');
		}
	}

	SkySlider.prototype.moveThumbnailsBelt = function() {
		let self = this; // test

		let thumbnails = this.thumbnailsList.children,
			thumbnailsLength = thumbnails.length,
			thumbnailWidth = thumbnails[0].offsetWidth,
			allowedTime = 400,
			listOffset,
			start,
			dist,
			totalDist;

		self.thumbnailsWrap.style.width = self.options.showThumbItems * thumbnailWidth + 'px';
		self.thumbnailsList.style.width = thumbnailsLength * thumbnailWidth + 'px';
		self.thumbnailsList.style.transform = 'translate3d(0,0,0)';


		// for Mouse
		//------------------------------------------------------
		self.thumbnailsWrap.addEventListener('mousedown', (e) => {
			e.preventDefault();

			listOffset = parseInt(getTransformValue(self.thumbnailsList));
			start = e.pageX;

			self.thumbnailsWrap.addEventListener('mousemove', onMouseMove);
		});

		function onMouseMove(e) {
			e.preventDefault();

			dist = e.pageX - start;
			totalDist = dist + listOffset;

			if (totalDist <= -(thumbnailWidth * thumbnailsLength - thumbnailWidth * self.options.showThumbItems)) {
				self.thumbnailsList.style.transform = `translate3d(-${(thumbnailWidth * thumbnailsLength) - (thumbnailWidth * self.options.showThumbItems)}px,0,0)`;
			} else if (totalDist >= 0) {
				self.thumbnailsList.style.transform = `translate3d(0,0,0)`;			
			} else {
				self.thumbnailsList.style.transform = `translate3d(${totalDist}px,0,0)`;
			}

		}

		this.thumbnailsWrap.addEventListener('mouseup', () => {
			this.thumbnailsWrap.removeEventListener('mousemove', onMouseMove);
		});

		this.thumbnailsWrap.addEventListener('mouseleave', () => {
			this.thumbnailsWrap.removeEventListener('mousemove', onMouseMove);
		});


		// for Touch
		//------------------------------------------------------
		this.thumbnailsWrap.addEventListener('touchstart', (e) => {
			e.preventDefault();

			listOffset = parseInt(getTransformValue(self.thumbnailsList));
			let touchObj = e.changedTouches[0];
			start = touchObj.pageX;
		});

		this.thumbnailsWrap.addEventListener('touchmove', (e) => {
			e.preventDefault();

			let touchObj = e.changedTouches[0];
			dist = touchObj.pageX - start;
			totalDist = dist + listOffset;
			if (totalDist <= -(thumbnailWidth * thumbnailsLength - thumbnailWidth * self.options.showThumbItems)) {
				self.thumbnailsList.style.transform = `translate3d(-${(thumbnailWidth * thumbnailsLength) - (thumbnailWidth * self.options.showThumbItems)}px,0,0)`;
			} else if (totalDist >= 0) {
				self.thumbnailsList.style.transform = `translate3d(0,0,0)`;			
			} else {
				self.thumbnailsList.style.transform = `translate3d(${totalDist}px,0,0)`;
			}
		});

	}

	SkySlider.prototype.moveSlider = function() {
		let sliderWidth = this.slider.offsetWidth,
			liElements = this.ulBelt.children,
			liCount = liElements.length,
			liWidth = liElements[0].offsetWidth,
			ulBeltLeft, // rename?
			start,
			dist,
			dir,
			allowedTime = 400,
			startTime,
			elepsedTime;

			
		this.ulBelt.style.width = `${liWidth * liCount}px`;
		this.ulBelt.style.transform = `translate3d(-${this.index * liWidth}px,0,0)`;

		// for Mouse
		//------------------------------------------------------
		this.slider.addEventListener('mousedown', (e) => {
			e.preventDefault();

			this.ulBelt.style.transition = 'all 300ms ease-out';
			ulBeltLeft = parseInt(getTransformValue(this.ulBelt));
			start = e.pageX;
			startTime = new Date().getTime();
		});

		this.slider.addEventListener('mouseup', (e) => {
			dist = e.pageX - start;
			dir = (dist < 0) ? 'left' : 'right';

			if (dist < -100 || dist > 100) {
				this.index = (dir == 'left') ? Math.min(this.index+1, liCount-1) : Math.max(this.index-1,0);
				this.ulBelt.style.transform = `translate3d(-${this.index * liWidth}px,0,0)`;
				this.changeActiveThumbnail();
			}
		});


		// for Touch
		//------------------------------------------------------
		this.slider.addEventListener('touchstart', (e) => {
			e.preventDefault();

			this.ulBelt.style.transition = 'all 300ms ease-out';
			ulBeltLeft = parseInt(getTransformValue(this.ulBelt));
			let touchObj = e.changedTouches[0];
			start = touchObj.pageX;
			startTime = new Date().getTime();
		});

		this.slider.addEventListener('touchmove', (e) => {
			e.preventDefault();

			let touchObj = e.changedTouches[0]
			dist = touchObj.pageX - start;
			dir = (dist < 0) ? 'left' : 'right';
		});

		this.slider.addEventListener('touchend', (e) => {
			e.preventDefault();

			elepsedTime = new Date().getTime() - startTime;

			if (elepsedTime < allowedTime && (dist < -150 || dist > 150)) {
				this.index = (dir == 'left') ? Math.min(this.index+1, liCount-1) : Math.max(this.index-1, 0);
				this.ulBelt.style.transform = `translate3d(-${this.index * liWidth}px,0,0)`;
				dist = 0;

				this.changeActiveThumbnail();
			}
		});
	}

	SkySlider.prototype.sliderArrows = function() {
		let liLength = this.ulBelt.children.length,
			liWidth = this.li.offsetWidth;

		this.prev.addEventListener('click', () => {
			this.index--;
			this.ulBelt.style.transition = 'all 300ms ease-out';

			if (this.index < 0) {
				this.index = 0;
			}

			this.ulBelt.style.transform = `translate3d(-${this.index * liWidth}px,0,0)`;

			this.changeActiveThumbnail();
		});

		this.next.addEventListener('click', () => {
			this.index++;
			this.ulBelt.style.transition = 'all 300ms ease-out';

			if (this.index == liLength) {
				this.index = liLength-1;
			}

			this.ulBelt.style.transform = `translate3d(-${this.index * liWidth}px,0,0)`;

			this.changeActiveThumbnail();
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

