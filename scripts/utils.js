export const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Keeps a reference of the preloaded images to prevent the browser from sending them to the garbage collector.
const preloadImgs = [];

function preloadImage(im_url) {
  const img = new Image();
  img.src = im_url;
  preloadImgs.push(img);
}

export function preloadDialogImages() {
  preloadImage('img/cute-animals-drawings/croco-capybara.png');
  preloadImage('img/cute-animals-drawings/croco-capybara-todos.png');
  preloadImage('img/cute-animals-drawings/capybara.jpg');
  for (let i = 1; i <= 6; i++) {
    preloadImage(`img/recycle-icons/garbage-collector-${i}.jpg`);
  }
}