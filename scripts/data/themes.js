import { getRandomIndex } from '../utils.js';

const backgroundImgLm = document.getElementById('background-image');
export const preloadBgImgEventHandler = {};
export let lastPreloadedImg;
let lastShuffledTheme = JSON.parse(localStorage.getItem('lastShuffledTheme')) || 0;
const themes = [
  {
    darkAccent: '#593e7f',
    mediumToDarkAccent: '#9b59b6',
    mediumAccent: '#b259b6',
    ligthAccent: '#ecdeff',
    contrast: '#dfd684',
    backgroundImage: '../img/app-background/purple-background.jpg'
  },
  {
    darkAccent: '#2e6881',
    mediumToDarkAccent: '#427db8',
    mediumAccent: '#6573eb',
    ligthAccent: '#d6f3ff',
    contrast: '#fd94ce',
    backgroundImage: '../img/app-background/blue-background.jpg'
  },
  {
    darkAccent: '#51763d',
    mediumToDarkAccent: '#73A857',
    mediumAccent: '#57a871',
    ligthAccent: '#d8ffc2',
    contrast: '#6ecab9',
    backgroundImage: '../img/app-background/green-background.jpg'
  },
  {
    darkAccent: '#55373d',
    mediumToDarkAccent: '#7a4f54',
    mediumAccent: '#d8085f',
    ligthAccent: '#ffe9ed',
    contrast: '#91c989',
    backgroundImage: '../img/app-background/chocolate-background.jpg'
  },
  {
    darkAccent: '#984a9b',
    mediumToDarkAccent: '#f38bd4',
    mediumAccent: '#bc8bf3',
    ligthAccent: '#ffe4fd',
    contrast: '#daf38b',
    backgroundImage: '../img/app-background/pink-background.jpg'
  },
  {
    darkAccent: '#793735',
    mediumToDarkAccent: '#FB6964',
    mediumAccent: '#fba264',
    ligthAccent: '#ffdad9',
    contrast: '#ff5b9f',
    backgroundImage: '../img/app-background/red-background.jpg'
  },
  {
    darkAccent: '#84846b',
    mediumToDarkAccent: '#BDBB99',
    mediumAccent: '#b0bd99',
    ligthAccent: '#fff8d9',
    contrast: '#b6c3e0',
    backgroundImage: '../img/app-background/sand-background.jpg'
  },
  {
    darkAccent: '#4e817e',
    mediumToDarkAccent: '#8ba7ec',
    mediumAccent: '#e79049',
    ligthAccent: '#c0f0ed',
    contrast: '#ec8bd6',
    backgroundImage: '../img/app-background/cian-background.jpg'
  }
];

function checkIfCurrentThemeIsRepeated() {
  let currentRandomTheme = themes[getRandomIndex(themes)];
  while (lastShuffledTheme.contrast === currentRandomTheme.contrast) {
    currentRandomTheme = themes[getRandomIndex(themes)];
  }
  return currentRandomTheme;
}

function changeTheme(currentRandomTheme) {
  const { darkAccent, mediumToDarkAccent, mediumAccent, ligthAccent, contrast, backgroundImage } = currentRandomTheme;
  const rootLm = document.documentElement;

  // Because the todos are generated after the page is loaded; a timeout is needed in order to transition from grey to color in the todos container.
  setTimeout(() => {
    rootLm.style = `
    --dark-accent-color: ${darkAccent};
    --dark-to-medium-accent-color: ${mediumToDarkAccent};
    --medium-accent-color: ${mediumAccent};
    --light-accent-color: ${ligthAccent};
    --contrast-color: ${contrast};
    --background-image: ${backgroundImage};
    `;
  });
}

function setLastShuffledThemeToStorage(currentRandomTheme) {
  lastShuffledTheme = currentRandomTheme;
  localStorage.setItem('lastShuffledTheme', JSON.stringify(currentRandomTheme));
}

function loadBgImgProgressively(currentRandomTheme, time, changeThemeAfterTim) {
  const imgUrl = currentRandomTheme.backgroundImage;
  const preloaderImg = document.createElement("img");
  preloaderImg.src = imgUrl;
  lastPreloadedImg = preloaderImg;
  !changeThemeAfterTim && changeTheme(currentRandomTheme);

  function loadBgImg(imgUrl) {
    backgroundImgLm.style.opacity = 1;
    backgroundImgLm.style.backgroundImage = `url(${imgUrl})`;
  }
  
  const handleLoadBgImg = imgUrl => () => {
    loadBgImg(imgUrl);
  }

  const loadBgImgHandler = handleLoadBgImg(imgUrl)
  preloadBgImgEventHandler.loadBgImgHandler = loadBgImgHandler;

  const timBgId = setTimeout(() => { 
    changeThemeAfterTim && changeTheme(currentRandomTheme);
    console.log('tim init');
    if (preloaderImg.complete) {
      console.log('bg completed!');
      loadBgImgHandler();
    } 
    else {
      console.log('added load bg event');
      preloaderImg.addEventListener('load', loadBgImgHandler);
    }
  }, time);

  return timBgId;
}

export function setRandomTheme(time, changeThemeAfterTim) {
  const currentRandomTheme = checkIfCurrentThemeIsRepeated();
  setLastShuffledThemeToStorage(currentRandomTheme);
  const timBgId = loadBgImgProgressively(currentRandomTheme, time, changeThemeAfterTim);
  return timBgId;
}
