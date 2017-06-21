(function() {
    let gallery_1 = new SkySlider('.first-gallery');

    let gallery_2 = new SkySlider('#second-gallery', {
        showThumbnails: true,
        thumbnailsItemCount: 6,
    });

    console.dir(gallery_1);
    console.dir(gallery_2);
})();
