export const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const preloadImgs = []

function preload_image(im_url) {
  const img = new Image();
  img.src = im_url;
  preloadImgs.push(img);
}

export function preloadDialogImages() {
  preload_image('img/cute-animals-drawings/capybara.png');
  for (let i = 1; i <= 6; i++) {
    preload_image(`img/recycle-icons/garbage-collector-${i}.jpg`);
  }
}