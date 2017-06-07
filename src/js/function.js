'use strict';

(function() {

	function SkySlider(items) {
		this.init(items);
	}

	SkySlider.prototype.init = function(items) {
		this.el = document.querySelector('.skySlider');
		this.images = this.el.querySelectorAll('img');

		this.overlay = null;
		this.sliderWrap = null;
		this.ul = null;
		this.li = null;
		this.img = null;

		this.next = null;
		this.prev = null;

		this.thumbnailsWrap = null;
		this.thumbnailsBelt = null;
		this.thumbnail = null;

		this.index = 0;
		this.total = 0;

		this.test = 'Jack';

		this.defatulSettings = {
			thumbnailItems: items || 5,
		}
	};

	SkySlider.prototype.open = function(index) {
		this.index = index;
		this.create();
		this.arrowActions(this.index);
		this.thumbnailsActions();
		this.thumbnailWrapperWidth();

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
		this.ul = document.createElement('ul');
		this.ul.classList.add('skySlider-slider');

		for (let i = 0; i < this.images.length; i++) {
			this.li = document.createElement('li');
			this.li.classList.add('skySlider-slide')
			if (this.index === i) {
				this.li.classList.add('is-current');
			}
			this.img = document.createElement('img');
			this.img.setAttribute('src', this.images[i].getAttribute('src'));
			this.li.appendChild(this.img);
			this.ul.appendChild(this.li)
		}
		this.total = this.ul.children.length;

		this.sliderWrap.appendChild(this.ul);

		// create Thumbnails
		//--------------------------------------------------------
		this.thumbnailsWrap = document.createElement('div');
		this.thumbnailsWrap.classList.add('skySlider-thumbnails-wrap');

		this.thumbnailsBelt = document.createElement('ul');
		this.thumbnailsBelt.classList.add('skySlider-thumbnails-belt');

		for (let i = 0; i < this.images.length; i++) {
			this.thumbnail = document.createElement('li');
			this.thumbnail.classList.add('skySlider-thumbnail')
			if (this.index === i) {
				this.thumbnail.classList.add('is-current');
			}
			this.img = document.createElement('img');
			this.img.setAttribute('src', this.images[i].getAttribute('src'));
			this.thumbnail.appendChild(this.img);
			this.thumbnailsBelt.appendChild(this.thumbnail);
		}
		this.thumbnailsWrap.appendChild(this.thumbnailsBelt);
		this.overlay.appendChild(this.thumbnailsWrap);

		document.body.appendChild(docFrag);
	}

	SkySlider.prototype.thumbnailsActions = function() {
		let thumbnails = this.thumbnailsBelt.children;

		Array.from(thumbnails, (el, index) => {
			el.addEventListener('click', () => {
				let siblings = el.parentNode.children;

				for (let i = 0; i < siblings.length; i++) 
					if (siblings[i].classList.contains('is-current'))
						siblings[i].classList.remove('is-current');

				el.classList.add('is-current');

				this.index = index;
				this.slideTo(index);
			});
		});
	}

	SkySlider.prototype.thumbnailWrapperWidth = function() {
		let style = window.getComputedStyle(this.thumbnailsBelt.children[0]),
			width = this.thumbnailsBelt.children[0].offsetWidth,
			margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
			padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
			border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

		let sum = width + margin + padding + border;
		let wrapWidth = sum * this.defatulSettings.thumbnailItems;
		let listWidth = sum * this.total;

		this.thumbnailsWrap.style.width = `${wrapWidth}px`;
		this.thumbnailsBelt.style.width = `${listWidth}px`;
	}

	SkySlider.prototype.thumbnailActive = function() {
		let thumbnails = this.thumbnailsBelt.children;
		Array.from(thumbnails, (el, index) => {
			let siblings = el.parentNode.children;

			for (let i = 0; i < siblings.length; i++) 
				if (siblings[i].classList.contains('is-current'))
					siblings[i].classList.remove('is-current');
			
				siblings[this.index].classList.add('is-current');
		});
	}

	SkySlider.prototype.moveBelt = function(direction) {
		if (direction == 'right') {
			let moveWidth = 131 * (this.index);
			this.thumbnailsBelt.style.left = `-${moveWidth}px`;

			console.log(moveWidth);
		}

		if (direction == 'left') {
			let moveWidth = 131 * (this.index);
			this.thumbnailsBelt.style.left = `${moveWidth}px`;

			console.log(moveWidth);
		}

	}

	SkySlider.prototype.arrowActions = function(index) {
		this.prev.addEventListener('click', () => {
			this.index--;

			if (this.index < 0) {
				this.index = this.total - 1;
			}

			this.thumbnailActive();
			this.slideTo(this.index);
			this.moveBelt('left');
		});

		this.next.addEventListener('click', () => {
			this.index++;

			if (this.index == this.total) {
				this.index = 0;
			}

			this.thumbnailActive();
			this.slideTo(this.index);
			this.moveBelt('right');
		});
	}

	SkySlider.prototype.slideTo = function(index) {
		let slide = this.ul.children;

		Array.from(slide, (elem, indexEl) => {
			if (elem.classList.contains('is-current')) {
				elem.classList.remove('is-current');
			}
			if (indexEl == index) {
				elem.classList.add('is-current');
			}
		});
	}



	//-------------------------------------------------
	let modal = new SkySlider();
	let images = document.querySelectorAll('.photo');

	images.forEach(function(el, index) {
		el.addEventListener('click', function(event) {
			modal.open(index);
		});
	});

})()

