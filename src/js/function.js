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
		this.ul = null;
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
		this.actions(this.index);
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
				this.slideTo(index);
			});
		});
	}
	
	SkySlider.prototype.actions = function(index) {
		this.prev.addEventListener('click', () => {
			this.index--;

			if (this.index < 0) {
				this.index = this.total - 1;
			}

			this.thumbnailActive();
			this.slideTo(this.index);
		});

		this.next.addEventListener('click', () => {
			this.index++;

			if (this.index == this.total) {
				this.index = 0;
			}

			this.thumbnailActive();
			this.slideTo(this.index);
		});
	}

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

})()

