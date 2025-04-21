export default class LoadHandler {
  preloadedImgs = [];

  // Handle actions once the image is fully loaded
  loadImage(imgContainerLm, thumbnailImg) {
    imgContainerLm.classList.add('loaded');
    thumbnailImg.ariaBusy = 'false';

    setTimeout(() => {
      // Remove the low-resolution background image
      imgContainerLm.style.backgroundImage = 'none';
      // Remove blur img container loader background color 
      imgContainerLm.style.backgroundColor = 'transparent';
    }, 250);
  }

  blurLoadImages() {
    const elements = document.querySelectorAll('.blur-img-loader');

    elements.forEach(imgContainerLm => {
      const thumbnailImg = imgContainerLm.querySelector('img');
    
      // If the image has already been fully loaded, trigger the loaded function immediately
      if (thumbnailImg.complete) {
        this.loadImage(imgContainerLm, thumbnailImg);
      } 
      // Otherwise, add an event listener to handle the image load event
      else {
        // Use { once: true } to ensure the event runs only once
        thumbnailImg.addEventListener('load', () => this.loadImage(imgContainerLm, thumbnailImg), { once: true });
        thumbnailImg.ariaBusy = 'true';
      }
    });
  }

  hidePageLoader() {
    const bouncerLoaderContainerLm = document.getElementById('bouncer-container');
    const bouncerLoaderLm = document.getElementById('bouncer-loader');
    
    // Annouce that the element has stopped loading
    bouncerLoaderContainerLm.ariaBusy = 'false';
    // Hide the loader
    bouncerLoaderContainerLm.style.backgroundColor = 'transparent';
    bouncerLoaderLm.style.opacity = 0;
    // Reset the loader title
    bouncerLoaderContainerLm.title = '';

    // After 500ms, completely hide the loader
    setTimeout(() => {
      bouncerLoaderContainerLm.style.display = 'none';
    }, 500);
  }

  preloadImage(imgUrl) {
    const img = new Image();
    img.src = imgUrl;
    this.preloadedImgs.push(img);
  }

  preloadDashboardBlurImages() {
    // Preload specific animal images
    this.preloadImage('assets/images/drawings/chilling-capybara-low-res.jpg');
    this.preloadImage('assets/images/drawings/empty-task-list-placeholder-low-res.jpg');
    this.preloadImage('assets/images/drawings/no-tasks-found-placeholder-low-res.jpg');
    
    // Preload a series of recycling icons
    for (let i = 1; i <= 6; i++) {
      this.preloadImage(`assets/images/recycle/garbage-collector-low-res-${i}.jpg`);
    }
  }
}