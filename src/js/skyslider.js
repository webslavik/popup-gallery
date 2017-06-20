/**
 * SkySlider
 * ---------
 * Version: 1.0.0
 * Repo: https://github.com/webslavik/popup-gallery/tree/master
 * Author: Slavik Sukhanov 
 */


'use strict';

;(function() {

	// for `this`
	let _; 

	function SkySlider() {

		_ = this;

		/**
		 * Private properties
		 * -------------------
		 */
		_.currentIndex = null;
		_.sliderWidth = null;
		_.elementsNumber = null;
		_.prevArrow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250.738 250.738"><path d="M96.633 125.37l95.053-94.534c7.1-7.055 7.1-18.492 0-25.546-7.1-7.054-18.613-7.054-25.714 0L58.99 111.69c-3.785 3.758-5.488 8.758-5.24 13.68-.248 4.92 1.455 9.92 5.24 13.68L165.97 245.448c7.1 7.055 18.613 7.055 25.714 0 7.1-7.054 7.1-18.49 0-25.544L96.633 125.37z" fill-rule="evenodd" clip-rule="evenodd"/></svg>';
		_.nextArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="451.846" height="451.847" viewBox="0 0 451.846 451.847"><path d="M345.44 248.292l-194.286 194.28c-12.36 12.366-32.397 12.366-44.75 0-12.354-12.353-12.354-32.39 0-44.743l171.914-171.91-171.91-171.903c-12.353-12.36-12.353-32.394 0-44.748 12.355-12.36 32.392-12.36 44.75 0l194.288 194.283c6.177 6.18 9.262 14.27 9.262 22.366 0 8.098-3.09 16.195-9.267 22.372z"/></svg>';
		_.crossIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M437.02 74.98C388.666 26.63 324.38 0 256 0S123.333 26.63 74.98 74.98 0 187.62 0 256s26.63 132.667 74.98 181.02C123.333 485.37 187.62 512 256 512s132.667-26.63 181.02-74.98C485.37 388.666 512 324.38 512 256s-26.63-132.668-74.98-181.02zM256 470.637C137.65 470.636 41.364 374.35 41.364 256S137.65 41.364 256 41.364 470.636 137.65 470.636 256 374.35 470.636 256 470.636z"/><path d="M341.22 170.78c-8.077-8.076-21.172-8.076-29.25 0L170.78 311.97c-8.077 8.078-8.077 21.173 0 29.25 4.038 4.04 9.332 6.058 14.625 6.058s10.587-2.02 14.625-6.058l141.19-141.19c8.076-8.077 8.076-21.172 0-29.25z"/><path d="M341.22 311.97L200.03 170.78c-8.077-8.076-21.173-8.076-29.25 0-8.076 8.077-8.076 21.172 0 29.25l141.19 141.19a20.616 20.616 0 0 0 14.626 6.058c5.293 0 10.586-2.02 14.625-6.058 8.076-8.077 8.076-21.172 0-29.25z"/></svg>';
		

		/**
		 * Options
		 * -------
		 * User can set some options
		 */
		_.options = {
			thumbnailsItemCount: 5,
			showThumbnails: true
		};


		if (arguments[0] && typeof arguments[0] === 'object') {
			_.options = extendDefaults(_.options, arguments[0]);
		}

		init();
	}

	function init() {
		let el = document.querySelector('.skySlider'),
			children = el.children;
			
		_.elementsNumber = children.length;
		_.imagesUrl = getImagesUrl(el.querySelectorAll('img'));

		create();
		moveSlider();
		sliderArrows();
		keyboardNavigation();
		close();
		if (_.options.showThumbnails) {
			moveThumbnailsBelt();
			thumbnailsActions();
		}

		Array.from(children, (el, index) => {
			el.addEventListener('click', (e) => {
				_.currentIndex = index;
				open();
			});
		});
	};

	function open() {
		initSliderWith();


		/**
		 * HACK
		 * ----
		 * delay add class
		 */
		setTimeout(() => {
			_.overlay.classList.add('is-open');
		}, 0.5);

		if (_.options.showThumbnails) {
			changeActiveThumbnail();
			goToCurrentThumbnail();
		}

	}


	function close() {
		_.overlay.addEventListener('click', (e) => {
			let target = e.target;

			/**
			 * refactoring
			 * -----------
			 * need optimize
			 */
			// if (target.classList.contains('skySlider-close') || target.classList.contains('skySlider-slider-wrap') || target.tagName == 'path' || target.tagName == 'svg') {
			// 	_.overlay.classList.remove('is-open');
			// }

			if (target.classList.contains('skySlider-close') || target.classList.contains('skySlider-slider-wrap')) {
				_.overlay.classList.remove('is-open');
			}
			
			if (!target.classList.contains('skySlider-overlay')) {
				return false;
			}
			_.overlay.classList.remove('is-open');

		});

		document.querySelector('.skySlider-close').addEventListener('click', (e) => {
			_.overlay.classList.remove('is-open');
		});
	}

	function create() {
		_.overlay = document.createElement('div');
		_.overlay.classList.add('skySlider-overlay');

		_.closeBtn = document.createElement('button');
		_.closeBtn.classList.add('skySlider-close');
		_.closeBtn.innerHTML = _.crossIcon;
		_.overlay.appendChild(_.closeBtn);
		// create Slider
		//-------------------------------------------------------
		_.overlay.appendChild(createSlider());

		// create Thumbnails
		//--------------------------------------------------------
		if (_.options.showThumbnails) _.overlay.appendChild(createThumbnails());

		document.body.appendChild(_.overlay);
	}

	function createSlider() {
		_.sliderWrap = document.createElement('div');
		_.sliderWrap.classList.add('skySlider-slider-wrap');

		_.next = document.createElement('div');
		_.next.classList.add('skySlider-arrow', 'next');
		_.next.innerHTML = _.nextArrow;

		_.prev = document.createElement('div');
		_.prev.classList.add('skySlider-arrow', 'prev');
		_.prev.innerHTML = _.prevArrow;

		_.sliderWrap.appendChild(_.next);
		_.sliderWrap.appendChild(_.prev);


		_.slider = document.createElement('div');
		_.slider.classList.add('skySlider-slider');
		_.sliderWrap.appendChild(_.slider);

		_.sliderBelt = document.createElement('ul');
		_.sliderBelt.classList.add('skySlider-slider-belt');
		_.slider.appendChild(_.sliderBelt);


		for (let i = 0; i < _.imagesUrl.length; i++) {
			_.li = document.createElement('li');
			_.li.classList.add('skySlider-slide')
			_.img = document.createElement('img');
			_.img.setAttribute('src', _.imagesUrl[i]);
			_.li.appendChild(_.img);
			_.sliderBelt.appendChild(_.li)
		}

		return _.sliderWrap;
	}


	function createThumbnails() {
		_.thumbnailsWrap = document.createElement('div');
		_.thumbnailsWrap.classList.add('skySlider-thumbnails-wrap');

		_.thumbnailsList = document.createElement('ul');
		_.thumbnailsList.classList.add('skySlider-thumbnails-list');

		for (let i = 0; i < _.imagesUrl.length; i++) {
			_.thumbnail = document.createElement('li');
			_.thumbnail.classList.add('skySlider-thumbnail');
			_.img = document.createElement('img');
			_.img.setAttribute('src', _.imagesUrl[i]);
			_.thumbnail.appendChild(_.img);
			_.thumbnailsList.appendChild(_.thumbnail);
		}
		_.thumbnailsWrap.appendChild(_.thumbnailsList);

		return _.thumbnailsWrap;
	}


	function initSliderWith() { 
		_.sliderWidth = _.slider.offsetWidth;

		_.sliderBelt.style.width = `${_.sliderWidth * _.elementsNumber}px`;
		_.sliderBelt.style.transform = `translate3d(-${_.currentIndex * _.sliderWidth}px,0,0)`;
	}

	function moveSlider() {
		let sliderWidth = _.slider.offsetWidth,
			liElements = _.sliderBelt.children,
			liWidth = liElements[0].offsetWidth,
			beltOffset,
			start,
			dist,
			totalDist,
			dir,
			allowedTime = 2000,
			startTime,
			elepsedTime;


		/**
		 * for Mouse
		 * ---------
		 */
		_.sliderBelt.addEventListener('mousedown', (e) => {
			e.preventDefault();

			beltOffset = parseInt(getTransformValue(_.sliderBelt));
			start = e.pageX;

			_.sliderBelt.addEventListener('mousemove', onMouseMove);
		});

		function onMouseMove(e) {
			e.preventDefault();

			dist = e.pageX - start;
			totalDist = dist + beltOffset;
			
			_.sliderBelt.style.transform = `translate3d(${totalDist}px,0,0)`;
		}

		_.sliderBelt.addEventListener('mouseup', (e) => {
			e.stopPropagation();

			const DRAG__OFFSET = liElements[_.currentIndex].querySelector('img').offsetWidth * 0.3;

			dist = e.pageX - start;
			dir = (dist < 0) ? 'left' : 'right';
			
			if (dist < DRAG__OFFSET || dist > DRAG__OFFSET) {
				changeImg(dir);
			}

			_.sliderBelt.removeEventListener('mousemove', onMouseMove);
		});


		_.sliderBelt.addEventListener('mouseleave', () => {
			_.sliderBelt.removeEventListener('mousemove', onMouseMove);
		});



		/**
		 * for Touch
		 * ---------
		 */
		_.sliderBelt.addEventListener('touchstart', (e) => {
			e.preventDefault();

			dist = 0;
			beltOffset = parseInt(getTransformValue(_.sliderBelt));
			let touchObj = e.changedTouches[0];
			start = touchObj.pageX;
			startTime = new Date().getTime();
		});

		_.sliderBelt.addEventListener('touchmove', (e) => {
			e.preventDefault();

			let touchObj = e.changedTouches[0]
			dist = touchObj.pageX - start;
			dir = (dist < 0) ? 'left' : 'right';


			/**
			 * Need test on device
			 * -------------------
			 */
			totalDist = dist + beltOffset;
			_.sliderBelt.style.transform = `translate3d(${totalDist}px,0,0)`;
		});

		_.sliderBelt.addEventListener('touchend', (e) => {
			e.preventDefault();

			elepsedTime = new Date().getTime() - startTime;

			if (elepsedTime < allowedTime && (dist < -50 || dist > 50)) {
				changeImg(dir);
			}
		});
	}


	function sliderArrows() {
		let liWidth = _.li.offsetWidth;

		_.prev.addEventListener('click', () => {
			_.currentIndex--;

			if (_.currentIndex < 0) {
				_.currentIndex = 0;
			}

			changeImg();
		});

		_.next.addEventListener('click', () => {
			_.currentIndex++;

			if (_.currentIndex == _.elementsNumber) {
				_.currentIndex = _.elementsNumber-1;
			}

			changeImg();
		});
	}


	function keyboardNavigation() {
		let body = document.querySelector('body'),
			liWidth = _.li.offsetWidth;

		body.addEventListener('keyup', (e) => {
			if (e.keyCode == 37) {
				_.currentIndex--;

				if (_.currentIndex <= 0) _.currentIndex = 0;

				changeImg();
			}
			if (e.keyCode == 39) {
				_.currentIndex++;

				if (_.currentIndex == _.elementsNumber) _.currentIndex = _.elementsNumber - 1;

				changeImg();
			}
		});
	}


	/**
	 * Direction and movement of the Slider
	 * 
	 * @param {String} dir - 'left' or 'right'
	 */
	function changeImg(dir = null) {

		if (dir) {
			_.currentIndex = (dir == 'left') ? Math.min(_.currentIndex+1, _.elementsNumber-1) : Math.max(_.currentIndex-1,0);
		}

		_.sliderBelt.style.transform = `translate3d(-${_.currentIndex * _.sliderWidth}px,0,0)`;

		if (_.options.showThumbnails) {
			changeActiveThumbnail();
			goToCurrentThumbnail();
		}
	}


	function thumbnailsActions() {
		let thumbnails = _.thumbnailsList.children,
			liWidth = _.li.offsetWidth;

		Array.from(thumbnails, (el, index) => {

			addListenerMulti(el, 'click touchend', () => {
				let siblings = el.parentNode.children;

				for (let i = 0; i < siblings.length; i++) 
					if (siblings[i].classList.contains('is-current'))
						siblings[i].classList.remove('is-current');

				el.classList.add('is-current');

				_.currentIndex = index;
				_.sliderBelt.style.transform = `translate3d(-${_.currentIndex * _.sliderWidth}px,0,0)`;

				goToCurrentThumbnail();
			});
		});
	}

	function changeActiveThumbnail() {
		let thumbnails = _.thumbnailsList.children;

		for (let i = 0; i < thumbnails.length; i++) {
			if (_.currentIndex === i) thumbnails[i].classList.add('is-current');
			else thumbnails[i].classList.remove('is-current');
		}
	}

	function moveThumbnailsBelt() {
		let self = _; // test

		let thumbnails = _.thumbnailsList.children,
			thumbnailWidth = thumbnails[0].offsetWidth,
			allowedTime = 400,
			listOffset,
			start,
			dist,
			totalDist;

		_.thumbnailsWrap.style.width = _.options.thumbnailsItemCount * thumbnailWidth + 'px';
		_.thumbnailsList.style.width = _.elementsNumber * thumbnailWidth + 'px';
		_.thumbnailsList.style.transform = 'translate3d(0,0,0)';

		/**
		 * for Mouse
		 * ---------
		 */
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

			if (totalDist <= -(thumbnailWidth * _.elementsNumber - thumbnailWidth * self.options.thumbnailsItemCount)) {
				self.thumbnailsList.style.transform = `translate3d(-${(thumbnailWidth * _.elementsNumber) - (thumbnailWidth * self.options.thumbnailsItemCount)}px,0,0)`;
			} else if (totalDist >= 0) {
				self.thumbnailsList.style.transform = `translate3d(0,0,0)`;			
			} else {
				self.thumbnailsList.style.transform = `translate3d(${totalDist}px,0,0)`;
			}

		}

		_.thumbnailsWrap.addEventListener('mouseup', () => {
			_.thumbnailsWrap.removeEventListener('mousemove', onMouseMove);
		});

		_.thumbnailsWrap.addEventListener('mouseleave', () => {
			_.thumbnailsWrap.removeEventListener('mousemove', onMouseMove);
		});


		/**
		 * for Touch
		 * ---------
		 */
		_.thumbnailsWrap.addEventListener('touchstart', (e) => {
			e.preventDefault();

			listOffset = parseInt(getTransformValue(self.thumbnailsList));
			let touchObj = e.changedTouches[0];
			start = touchObj.pageX;
		});

		_.thumbnailsWrap.addEventListener('touchmove', (e) => {
			e.preventDefault();

			let touchObj = e.changedTouches[0];
			dist = touchObj.pageX - start;
			totalDist = dist + listOffset;
			if (totalDist <= -(thumbnailWidth * _.elementsNumber - thumbnailWidth * self.options.thumbnailsItemCount)) {
				self.thumbnailsList.style.transform = `translate3d(-${(thumbnailWidth * _.elementsNumber) - (thumbnailWidth * self.options.thumbnailsItemCount)}px,0,0)`;
			} else if (totalDist >= 0) {
				self.thumbnailsList.style.transform = `translate3d(0,0,0)`;			
			} else {
				self.thumbnailsList.style.transform = `translate3d(${totalDist}px,0,0)`;
			}
		});
	}


	/**
	 * Move Thumbnails Belt depending on current slide
	 */
	function goToCurrentThumbnail() {
		let thumbnailWidth = _.thumbnailsList.children[0].offsetWidth;

		let beltOffset = _.currentIndex - (Math.floor(_.options.thumbnailsItemCount / 2));

		if (beltOffset >= 0 && beltOffset <= (_.elementsNumber - _.options.thumbnailsItemCount)) {
			_.thumbnailsList.style.transform = `translate3d(-${beltOffset * thumbnailWidth}px,0,0)`;
		}
	}


	/**
	 * Get images url
	 * 
	 * @param {Nodes} imagesEl
	 * @returns {Array} imagesUrl - src for slider images
	 */
	function getImagesUrl(imagesEl) {
		let imagesUrl = [];

		for (let i = 0; i < imagesEl.length; i++) {
			imagesUrl.push(imagesEl[i].getAttribute('src'));
		}
		return imagesUrl;
	}


	/**
	 * Extend property
	 * 
	 * @param {object} source -  _.options
	 * @param {object} properties - arguments[0]
	 * @returns {Object} source - check User and Custom settings
	 */
	function extendDefaults(source, properties) {
		for (let property in properties) {
			if (properties.hasOwnProperty(property)) {
				if (property === 'thumbnailsItemCount') {
					if (properties[property] < 3) source[property] = properties[property] = 3;
					if (properties[property] > 8) source[property] = properties[property] = 8;
				}
				source[property] = properties[property];
			}
		}

		return source;
	}


	/**
	 * Get translate3d value
	 * 
	 * @param {Node} el
	 * @returns {Array} xyzArray[0] - the first value of the translate3d
	 */
	function getTransformValue(el) {
		let transform = el.style.transform;
		let xyzArray = transform.replace(/translate3d|px|\(|\)/gi, '').split(',');
		return xyzArray[0];
	}


	/**
	 * Set events for several elements
	 * 
	 * @param {Node} el 
	 * @param {Events} events
	 * @param {Callback} fn 
	 */
	function addListenerMulti(el, events, fn) {
		events.split(' ').forEach(e => el.addEventListener(e, fn, false));
	}


	/**
	 * init Module
	 */
	window.SkySlider = SkySlider;
})()