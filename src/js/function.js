'use strict';

;(function() {

	let _; // for `this`

	function SkySlider(items = 5) {
		_ = this;

		_.currentIndex;

		_.options = {
			showThumbItems: items
		};

		_.init();
	}

	SkySlider.prototype.init = function() {
		let el = document.querySelector('.skySlider'),
			children = el.children;

		_.imagesUrl = getImagesUrl(el.querySelectorAll('img'));

		Array.from(children, (el, index) => {
			el.addEventListener('click', (e) => {
				_.currentIndex = index;
				_.open();
			});
		});
	};

	SkySlider.prototype.open = function() {
		_.create();
		_.moveSlider();
		_.sliderArrows();
		_.thumbnailsActions();
		_.moveThumbnailsBelt();
		_.keyboardNavigation();

		_.overlay.classList.add('is-open');

		_.close();
	}

	SkySlider.prototype.close = function() {
		_.overlay.addEventListener('click', (e) => {
			let target = e.target;
			if (!target.classList.contains('skySlider-overlay')) {
				return false;
			}
			_.overlay.parentNode.removeChild(_.overlay);
		});
	}

	SkySlider.prototype.create = function() {
		_.overlay = document.createElement('div');
		_.overlay.classList.add('skySlider-overlay');
		
		// create Slider
		//-------------------------------------------------------
		_.overlay.appendChild(_.createSlider());

		// create Thumbnails
		//--------------------------------------------------------
		_.overlay.appendChild(_.createThumbnails());

		document.body.appendChild(_.overlay);
	}

	SkySlider.prototype.createSlider = function() {
		_.sliderWrap = document.createElement('div');
		_.sliderWrap.classList.add('skySlider-slider-wrap');

		_.next = document.createElement('div');
		_.next.classList.add('skySlider-arrow', 'next');
		_.next.innerHTML = 'next';

		_.prev = document.createElement('div');
		_.prev.classList.add('skySlider-arrow', 'prev');
		_.prev.innerHTML = 'prev';

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
			if (_.currentIndex === i) {
				_.li.classList.add('is-current');
			}
			_.img = document.createElement('img');
			_.img.setAttribute('src', _.imagesUrl[i]);
			_.li.appendChild(_.img);
			_.ulBelt.appendChild(_.li)
		}

		return _.sliderWrap;
	}


	SkySlider.prototype.createThumbnails = function() {
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

	SkySlider.prototype.thumbnailsActions = function() {
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

	SkySlider.prototype.changeActiveThumbnail = function() {
		let thumbnails = _.thumbnailsList.children;

		for (let i = 0; i < thumbnails.length; i++) {
			if (_.currentIndex === i) thumbnails[i].classList.add('is-current');
			else thumbnails[i].classList.remove('is-current');
		}
	}

	SkySlider.prototype.moveThumbnailsBelt = function() {
		let self = _; // test

		let thumbnails = _.thumbnailsList.children,
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

		_.thumbnailsWrap.addEventListener('mouseup', () => {
			_.thumbnailsWrap.removeEventListener('mousemove', onMouseMove);
		});

		_.thumbnailsWrap.addEventListener('mouseleave', () => {
			_.thumbnailsWrap.removeEventListener('mousemove', onMouseMove);
		});


		// for Touch
		//------------------------------------------------------
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

			
		_.ulBelt.style.width = `${liWidth * liCount}px`;
		_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;

		// for Mouse
		//------------------------------------------------------
		_.slider.addEventListener('mousedown', (e) => {
			e.preventDefault();

			_.ulBelt.style.transition = 'all 300ms ease-out';
			beltOffset = parseInt(getTransformValue(_.ulBelt));
			start = e.pageX;
			startTime = new Date().getTime();
		});

		_.slider.addEventListener('mouseup', (e) => {
			dist = e.pageX - start;
			dir = (dist < 0) ? 'left' : 'right';

			if (dist < -100 || dist > 100) {
				_.currentIndex = (dir == 'left') ? Math.min(_.currentIndex+1, liCount-1) : Math.max(_.currentIndex-1,0);
				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
				_.changeActiveThumbnail();
			}
		});


		// for Touch
		//------------------------------------------------------
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

				_.changeActiveThumbnail();
			}
		});
	}

	SkySlider.prototype.sliderArrows = function() {
		let liLength = _.ulBelt.children.length,
			liWidth = _.li.offsetWidth;

		_.prev.addEventListener('click', () => {
			_.currentIndex--;
			_.ulBelt.style.transition = 'all 300ms ease-out';

			if (_.currentIndex < 0) {
				_.currentIndex = 0;
			}

			_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;

			_.changeActiveThumbnail();
		});

		_.next.addEventListener('click', () => {
			_.currentIndex++;
			_.ulBelt.style.transition = 'all 300ms ease-out';

			if (_.currentIndex == liLength) {
				_.currentIndex = liLength-1;
			}

			_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;

			_.changeActiveThumbnail();
		});
	}

	SkySlider.prototype.keyboardNavigation = function() {
		let body = document.querySelector('body');
		let	liLength = _.ulBelt.children.length,
			liWidth = _.li.offsetWidth;

		console.info('Current index: ' + _.currentIndex);

		body.addEventListener('keyup', (e) => {
			if (e.keyCode == 37) {
				_.ulBelt.style.transition = 'all 300ms ease-out';
				_.currentIndex--;
				console.log('Left: ' + _.currentIndex);


				if (_.currentIndex <= 0) _.currentIndex = 0;

				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
				_.changeActiveThumbnail();
			}
			if (e.keyCode == 39) {
				_.currentIndex++;
				_.ulBelt.style.transition = 'all 300ms ease-out';

				console.log('Right: ' + _.currentIndex);

				if (_.currentIndex == liLength) _.currentIndex = liLength-1;

				_.ulBelt.style.transform = `translate3d(-${_.currentIndex * liWidth}px,0,0)`;
				_.changeActiveThumbnail();
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



let modal = new SkySlider();
