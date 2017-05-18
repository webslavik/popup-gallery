'use strict';

(function () {

	let images = document.querySelectorAll('.photo');
	let overlay = document.querySelector('.overlay');

	images.forEach(function(image, index) {
		image.addEventListener('click', function(event) {
			// console.log(event);
			// console.log(index);
			showModal(index);
		});
	});

	function showModal(index) {
		overlay.classList.toggle('is-show');
	}

	overlay.addEventListener('click', function() {
		this.classList.toggle('is-show');
	});




})();
