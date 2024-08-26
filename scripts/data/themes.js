import { getRandomIndex } from '../utils.js';

// DOM reference to the background image element
const backgroundImgLm = document.getElementById('background-image');
// Object to store the event handler for preloading background images
export const preloadBgImgEventHandler = {};
// Variable to store the last preloaded image
export let lastPreloadedImg;
// Variable to store the index of the last used theme
let lastThemeIndex;

// Array of theme objects, each containing wbpage colors and a background image
const themes = [
  {
    darkAccent: '#593e7f',
    mediumToDarkAccent: '#9b59b6',
    mediumAccent: '#b259b6',
    lightAccent: '#ecdeff',
    contrast: '#dfd684',
    backgroundImage: '../images/app-background/purple-background.jpg'
  },
  {
    darkAccent: '#2e6881',
    mediumToDarkAccent: '#427db8',
    mediumAccent: '#6573eb',
    lightAccent: '#d6f3ff',
    contrast: '#fd94ce',
    backgroundImage: '../images/app-background/blue-background.jpg'
  },
  {
    darkAccent: '#51763d',
    mediumToDarkAccent: '#73A857',
    mediumAccent: '#57a871',
    lightAccent: '#d8ffc2',
    contrast: '#6ecab9',
    backgroundImage: '../images/app-background/green-background.jpg'
  },
  {
    darkAccent: '#55373d',
    mediumToDarkAccent: '#7a4f54',
    mediumAccent: '#d8085f',
    lightAccent: '#ffe9ed',
    contrast: '#91c989',
    backgroundImage: '../images/app-background/chocolate-background.jpg'
  },
  {
    darkAccent: '#984a9b',
    mediumToDarkAccent: '#f38bd4',
    mediumAccent: '#bc8bf3',
    lightAccent: '#ffe4fd',
    contrast: '#daf38b',
    backgroundImage: '../images/app-background/pink-background.jpg'
  },
  {
    darkAccent: '#793735',
    mediumToDarkAccent: '#FB6964',
    mediumAccent: '#fba264',
    lightAccent: '#ffdad9',
    contrast: '#ff5b9f',
    backgroundImage: '../images/app-background/red-background.jpg'
  },
  {
    darkAccent: '#84846b',
    mediumToDarkAccent: '#BDBB99',
    mediumAccent: '#b0bd99',
    lightAccent: '#fff8d9',
    contrast: '#b6c3e0',
    backgroundImage: '../images/app-background/sand-background.jpg'
  },
  {
    darkAccent: '#4e817e',
    mediumToDarkAccent: '#8ba7ec',
    mediumAccent: '#e79049',
    lightAccent: '#c0f0ed',
    contrast: '#ec8bd6',
    backgroundImage: '../images/app-background/cian-background.jpg'
  }
];

// Change the theme by updating CSS variables
function changeRootThemeVars(currentRandomTheme) {
  const { darkAccent, mediumToDarkAccent, mediumAccent, lightAccent, contrast, backgroundImage } = currentRandomTheme;
  const rootLm = document.documentElement;

  // A timeout is used to ensure smooth transition from grey to color in the todos container
  setTimeout(() => {
    rootLm.style = `
    --dark-accent-color: ${darkAccent};
    --dark-to-medium-accent-color: ${mediumToDarkAccent};
    --medium-accent-color: ${mediumAccent};
    --light-accent-color: ${lightAccent};
    --contrast-color: ${contrast};
    --background-image: ${backgroundImage};
    `;
  });
}

// Load the background image progressively with optional delay
function loadBgImgProgressively(currentRandomTheme, time = 0) {
  const imgUrl = currentRandomTheme.backgroundImage; // Current URL
  const preloaderImg = document.createElement("img"); // Create an image element for preloading
  preloaderImg.src = imgUrl; // Set the source of the preloader image
  lastPreloadedImg = preloaderImg; // Store the preloaded image globally
  changeRootThemeVars(currentRandomTheme); // Change the :root variables

  // Set background image
  function loadBgImg(imgUrl) {
    backgroundImgLm.style.opacity = 1;
    backgroundImgLm.style.backgroundImage = `url(${imgUrl})`;
  }
  
  // Event handler to load the background image once preloaded
  const handleLoadBgImg = imgUrl => () => {
    loadBgImg(imgUrl);
  }

  // Assign the event handler to the global object for later removal
  const loadBgImgHandler = handleLoadBgImg(imgUrl);
  preloadBgImgEventHandler.loadBgImgHandler = loadBgImgHandler;

  // Set a optional timeout and check if the image is preloaded
  const timBgId = setTimeout(() => { 
    if (preloaderImg.complete) {
      // Load image immediately if loading is complete
      loadBgImgHandler(); 
    } 
    else {
      // Load image when the loading is done
      preloaderImg.addEventListener('load', loadBgImgHandler);
    }
  }, time);

  return timBgId; // Return the timeout ID
}

// Set a random theme with an optional delay
export function setRandomTheme(time = 0) {
  const currentIndex = getRandomIndex(themes, lastThemeIndex); // Get a random theme index, avoiding repetition
  const currentRandomTheme = themes[currentIndex]; // Get the theme data with the random index
  const timBgId = loadBgImgProgressively(currentRandomTheme, time); // Load background image with optional timeot
  lastThemeIndex = currentIndex;  // Update the last used theme index
  
  return timBgId; // Return the timeout ID
}