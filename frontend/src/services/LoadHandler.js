export default class LoadHandler {
  preloadedImgs = [];
  
  blurLoadImages() {
    const elements = document.querySelectorAll('.blur-img-loader');

    elements.forEach(imgContainerLm => {
      // Select the thumbnail image within the container
      const thumbnailImg = imgContainerLm.querySelector('img');
    
      // Function to handle actions once the image is fully loaded
      function loaded() {
        // Add the 'loaded' class to the container, indicating the image has loaded
        imgContainerLm.classList.add('loaded');
        // Set the image's 'aria-busy' attribute indicating that has finished loading
        thumbnailImg.ariaBusy = 'false';
  
        // Delay to smoothly transition from low-res to full-res image
        setTimeout(() => {
          // Remove the low-resolution background image
          imgContainerLm.style.backgroundImage = 'none';
          // Remove blur img container loader background color 
          imgContainerLm.style.backgroundColor = 'transparent';
        }, 250);
      }
    
      // If the image has already been fully loaded, trigger the loaded function immediately
      if (thumbnailImg.complete) {
        loaded();
      } 
      // Otherwise, add an event listener to handle the image load event
      else {
        console.log('add load event')
        thumbnailImg.addEventListener('load', loaded);
        // Mark the image as loadeing via 'aria-busy' attribute
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
    this.preloadImage('/public/assets/images/drawings/chilling-capybara-low-res.jpg');
    this.preloadImage('/public/assets/images/drawings/empty-task-list-placeholder-low-res.jpg');
    this.preloadImage('/public/assets/images/drawings/no-tasks-found-placeholder-low-res.jpg');
    
    // Preload a series of recycling icons
    for (let i = 1; i <= 6; i++) {
      this.preloadImage(`/public/assets/images/recycle/garbage-collector-low-res-${i}.jpg`);
    }
  }
}