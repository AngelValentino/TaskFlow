import { getRandomIndex } from '../utils.js'

let lastShuffledTheme = JSON.parse(localStorage.getItem('lastShuffledTheme')) || 0;
const themes = [
  {
    darkAccent: '#593e7f',
    mediumToDarkAccent: '#9b59b6',
    mediumAccent: '#b259b6',
    ligthAccent: '#ecdeff',
    contrast: '#dfd684',
    backgroundImage: 'url(../img/app-background/purple-background.jpg)'
  },
/*   {
    darkAccent: '#2e6881',
    mediumToDarkAccent: '#427db8',
    mediumAccent: '#4d57b8',
    ligthAccent: '#d6f3ff',
    contrast: '#fd94ce',
    backgroundImage: 'url(../img/app-background/blue-background.jpg)'
  }, */
  {
    darkAccent: '#51763d',
    mediumToDarkAccent: '#73A857',
    mediumAccent: '#57a871',
    ligthAccent: '#d8ffc2',
    contrast: '#6ecab9',
    backgroundImage: 'url(../img/app-background/green-background.jpg)'
  },
  {
    darkAccent: '#55373d',
    mediumToDarkAccent: '#7a4f54',
    mediumAccent: '#d8085f',
    ligthAccent: '#ffe9ed',
    contrast: '#91c989',
    backgroundImage: 'url(../img/app-background/chocolate-background.jpg)'
  },
  {
    darkAccent: '#aa61a6',
    mediumToDarkAccent: '#f38bd4',
    mediumAccent: '#bc8bf3',
    ligthAccent: '#ffe4fd',
    contrast: '#daf38b',
    backgroundImage: 'url(../img/app-background/pink-background.jpg)'
  },
  {
    darkAccent: '#793735',
    mediumToDarkAccent: '#FB6964',
    mediumAccent: '#fba264',
    ligthAccent: '#ffdad9',
    contrast: '#ff5b9f',
    backgroundImage: 'url(../img/app-background/red-background.jpg)'
  }
];

export function checkIfCurrentThemeIsRepeated() {
  let currentRandomTheme = themes[getRandomIndex(themes)];
  while (lastShuffledTheme.contrast === currentRandomTheme.contrast) {
    currentRandomTheme = themes[getRandomIndex(themes)];
  }
  return currentRandomTheme;
}

export function changeTheme(currentRandomTheme) {
  const { darkAccent, mediumToDarkAccent, mediumAccent, ligthAccent, contrast, backgroundImage } = currentRandomTheme;
  const rootLm = document.documentElement;
  document.body.classList.add('change-theme-active');
    setTimeout(() => {
      document.body.classList.remove('change-theme-active');
    }, 500);

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
    })

}

export function setlastShuffledThemeToLocalStorage(currentRandomTheme) {
  lastShuffledTheme = currentRandomTheme;
  localStorage.setItem('lastShuffledTheme', JSON.stringify(currentRandomTheme))
}
