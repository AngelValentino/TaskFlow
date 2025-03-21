export default class LoadHandler {
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
}