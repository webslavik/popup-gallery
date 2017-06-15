'use strict';

;(function() {

	let _; // for `this`

	function SkySlider() {

		_ = this;

		/**
		 * Defaults properties
		 * -------------------
		 */
		_.currentIndex;
		_.prevArrow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250.738 250.738"><path d="M96.633 125.37l95.053-94.534c7.1-7.055 7.1-18.492 0-25.546-7.1-7.054-18.613-7.054-25.714 0L58.99 111.69c-3.785 3.758-5.488 8.758-5.24 13.68-.248 4.92 1.455 9.92 5.24 13.68L165.97 245.448c7.1 7.055 18.613 7.055 25.714 0 7.1-7.054 7.1-18.49 0-25.544L96.633 125.37z" fill-rule="evenodd" clip-rule="evenodd"/></svg>';
		_.nextArrow = '<svg xmlns="http://www.w3.org/2000/svg" width="451.846" height="451.847" viewBox="0 0 451.846 451.847"><path d="M345.44 248.292l-194.286 194.28c-12.36 12.366-32.397 12.366-44.75 0-12.354-12.353-12.354-32.39 0-44.743l171.914-171.91-171.91-171.903c-12.353-12.36-12.353-32.394 0-44.748 12.355-12.36 32.392-12.36 44.75 0l194.288 194.283c6.177 6.18 9.262 14.27 9.262 22.366 0 8.098-3.09 16.195-9.267 22.372z"/></svg>';
		_.crossIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212.982 212.982"><path d="M131.804 106.49l75.936-75.935c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0L106.49 81.18 30.555 5.242c-6.99-6.99-18.322-6.99-25.312 0-6.99 6.99-6.99 18.323 0 25.312L81.18 106.49 5.24 182.427c-6.99 6.99-6.99 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0L106.49 131.8l75.938 75.937c6.99 6.99 18.322 6.99 25.312 0 6.99-6.99 6.99-18.323 0-25.313l-75.936-75.936z" fill-rule="evenodd" clip-rule="evenodd"/></svg>';
		

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

		_.imagesUrl = getImagesUrl(el.querySelectorAll('img'));

		create();
		moveSlider();
		sliderArrows();
		keyboardNavigation();
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
		_.overlay.classList.add('is-open');
		close();
		initSliderWith();
		changeActiveThumbnail();
		moveBeltWithArrow();
	}


	function close() {
		_.ulBelt.style.transition = '';
		_.overlay.addEventListener('click', (e) => {
			let target = e.target;

			if (target.parentElement.parentElement.classList.contains('skySlider-close')) {
				_.overlay.classList.remove('is-open');
			}
			
			if (!target.classList.contains('skySlider-overlay')) {
				return false;
			}

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

		_.ulBelt = document.createElement('ul');
		_.ulBelt.classList.add('skySlider-slider-belt');
		_.slider.appendChild(_.ulBelt);


		for (let i = 0; i < _.imagesUrl.length; i++) {
			_.li = document.createElement('li');
			_.li.classList.add('skySlider-slide')
			_.img = document.createElement('img');
			_.img.setAttribute('src', _.imagesUrl[i]);
			_.li.appendChild(_.img);
			_.ulBelt.appendChild(_.li)
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
			_.thumbnail.classList.add('skySlider-thumbnail')
			if (_.currentIndex === i) {
				_.thumbnail.classList.add('is-current');
			}
			_.img = document.createElement('img');
			_.img.setAttribute('src', _.imagesUrl[i]);
			_.thumbnail.appendChild(_.img);
			_.thumbnailsList.appendChild(_.thumbnail);
		}
		_.thumbnailsWrap.appendChild(_.thumbnailsList);

		return _.thumbnailsWrap;
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
				_.ulBelt.style.transition = 'all 300ms ease-out';
				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
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
			thumbnailsLength = thumbnails.length,
			thumbnailWidth = thumbnails[0].offsetWidth,
			allowedTime = 400,
			listOffset,
			start,
			dist,
			totalDist;

		_.thumbnailsWrap.style.width = _.options.thumbnailsItemCount * thumbnailWidth + 'px';
		_.thumbnailsList.style.width = thumbnailsLength * thumbnailWidth + 'px';
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

			if (totalDist <= -(thumbnailWidth * thumbnailsLength - thumbnailWidth * self.options.thumbnailsItemCount)) {
				self.thumbnailsList.style.transform = `translate3d(-${(thumbnailWidth * thumbnailsLength) - (thumbnailWidth * self.options.thumbnailsItemCount)}px,0,0)`;
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
			if (totalDist <= -(thumbnailWidth * thumbnailsLength - thumbnailWidth * self.options.thumbnailsItemCount)) {
				self.thumbnailsList.style.transform = `translate3d(-${(thumbnailWidth * thumbnailsLength) - (thumbnailWidth * self.options.thumbnailsItemCount)}px,0,0)`;
			} else if (totalDist >= 0) {
				self.thumbnailsList.style.transform = `translate3d(0,0,0)`;			
			} else {
				self.thumbnailsList.style.transform = `translate3d(${totalDist}px,0,0)`;
			}
		});
	}

	function initSliderWith() {
		let sliderWidth = _.slider.offsetWidth,
			liElements = _.ulBelt.children,
			liCount = liElements.length,
			liWidth = liElements[0].offsetWidth;

		_.ulBelt.style.width = `${liWidth * liCount}px`;
		_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
	}

	function moveSlider() {
		let sliderWidth = _.slider.offsetWidth,
			liElements = _.ulBelt.children,
			liCount = liElements.length,
			liWidth = liElements[0].offsetWidth,
			beltOffset,
			start,
			dist,
			dir,
			allowedTime = 400,
			startTime,
			elepsedTime;


		/**
		 * 	for Mouse
		 */
		_.slider.addEventListener('mousedown', (e) => {
			e.preventDefault();

			_.ulBelt.style.transition = 'all 300ms ease-out';
			beltOffset = parseInt(getTransformValue(_.ulBelt));
			start = e.pageX;
		});

		_.slider.addEventListener('mouseup', (e) => {
			e.stopPropagation();

			dist = e.pageX - start;
			dir = (dist < 0) ? 'left' : 'right';

			if (dist < -100 || dist > 100) {
				_.currentIndex = (dir == 'left') ? Math.min(_.currentIndex+1, liCount-1) : Math.max(_.currentIndex-1,0);
				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;

				if (_.options.showThumbnails) changeActiveThumbnail();

				moveBeltWithArrow();
			}
		});


		/**
		 * for Touch
		 * ---------
		 */
		_.slider.addEventListener('touchstart', (e) => {
			e.preventDefault();

			_.ulBelt.style.transition = 'all 300ms ease-out';
			beltOffset = parseInt(getTransformValue(_.ulBelt));
			let touchObj = e.changedTouches[0];
			start = touchObj.pageX;
			startTime = new Date().getTime();
		});

		_.slider.addEventListener('touchmove', (e) => {
			e.preventDefault();

			let touchObj = e.changedTouches[0]
			dist = touchObj.pageX - start;
			dir = (dist < 0) ? 'left' : 'right';
		});

		_.slider.addEventListener('touchend', (e) => {
			e.preventDefault();

			elepsedTime = new Date().getTime() - startTime;

			if (elepsedTime < allowedTime && (dist < -150 || dist > 150)) {
				_.currentIndex = (dir == 'left') ? Math.min(_.currentIndex+1, liCount-1) : Math.max(_.currentIndex-1, 0);
				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
				dist = 0;

				if (_.options.showThumbnails) changeActiveThumbnail();

				moveBeltWithArrow();
			}
		});
	}

	function sliderArrows() {
		let liLength = _.ulBelt.children.length,
			liWidth = _.li.offsetWidth;

		_.prev.addEventListener('click', () => {
			_.currentIndex--;
			_.ulBelt.style.transition = 'all 300ms ease-out';

			if (_.currentIndex < 0) {
				_.currentIndex = 0;
			}

			_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;

			if (_.options.showThumbnails) changeActiveThumbnail();

			moveBeltWithArrow();
		});

		_.next.addEventListener('click', () => {
			_.currentIndex++;
			_.ulBelt.style.transition = 'all 300ms ease-out';

			if (_.currentIndex == liLength) {
				_.currentIndex = liLength-1;
			}

			_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;

			if (_.options.showThumbnails) changeActiveThumbnail();

			moveBeltWithArrow();
		});
	}

	function moveBeltWithArrow() {
		let thumbnails = _.thumbnailsList.children,
			thumbnailWidth = thumbnails[0].offsetWidth;

		let offset = _.currentIndex - (Math.floor(_.options.thumbnailsItemCount / 2));

		/**
		 * rewrite!!!
		 * -----------
		 * correctly work only: _.options.thumbnailsItemCount = 5
		 */
		if (offset >= 0 && offset <= (thumbnails.length - _.options.thumbnailsItemCount)) {
			_.thumbnailsList.style.transform = `translate3d(-${offset * thumbnailWidth}px,0,0)`;
		}
		if (_.currentIndex == 0 || _.currentIndex == 1) {
			_.thumbnailsList.style.transform = `translate3d(-0,0,0)`;
		}
		if (_.currentIndex == (thumbnails.length - 1) || _.currentIndex == (thumbnails.length - 2)) {
			_.thumbnailsList.style.transform = `translate3d(-${(thumbnails.length - _.options.thumbnailsItemCount) * thumbnailWidth}px,0,0)`;
		}
	}

	function keyboardNavigation() {
		let body = document.querySelector('body');
		let	liLength = _.ulBelt.children.length,
			liWidth = _.li.offsetWidth;


		body.addEventListener('keyup', (e) => {
			if (e.keyCode == 37) {
				_.ulBelt.style.transition = 'all 300ms ease-out';
				_.currentIndex--;

				if (_.currentIndex <= 0) _.currentIndex = 0;

				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
				if (_.options.showThumbnails) changeActiveThumbnail();
			}
			if (e.keyCode == 39) {
				_.currentIndex++;
				_.ulBelt.style.transition = 'all 300ms ease-out';

				if (_.currentIndex == liLength) _.currentIndex = liLength-1;

				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
				if (_.options.showThumbnails) changeActiveThumbnail();
			}
		});
	}


	// get images url
	//--------------------------------------------
	function getImagesUrl(imagesEl) {
		let imagesUrl = [];

		for (let i = 0; i < imagesEl.length; i++) {
			imagesUrl.push(imagesEl[i].getAttribute('src'));
		}
		return imagesUrl;
	}


	// extend property
	//--------------------------------------------
	function extendDefaults(source, properties) {
		for (let property in properties) {
			if (properties.hasOwnProperty(property)) {
				source[property] = properties[property];
			}
		}
		return source;
	}

	// get translate3d value
	//--------------------------------------------
	function getTransformValue(el) {
		let transform = el.style.transform;
		let xyzArray = transform.replace(/translate3d|px|\(|\)/gi, '').split(',');
		return xyzArray[0];
	}


	// set Events
	//--------------------------------------------
	function addListenerMulti(el, s, fn) {
		s.split(' ').forEach(e => el.addEventListener(e, fn, false));
	}

	// init Module
	//--------------------------------------------
	window.SkySlider = SkySlider;

})()



let modal = new SkySlider({
	thumbnailsItemCount: 5,
	showThumbnails: true
});


