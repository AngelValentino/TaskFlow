export default class ThemeHandler {
  loadToken = null;
  static themes = [
    {
      type: 'purple',
      darkAccent: '#593e7f',
      mediumToDarkAccent: '#9b59b6',
      mediumAccent: '#b259b6',
      lightAccent: '#ecdeff',
      contrast: '#dfd684',
      backgroundImage: 'assets/images/background/purple-background.jpg'
    },
    {
      type: 'blue',
      darkAccent: '#2e6881',
      mediumToDarkAccent: '#427db8',
      mediumAccent: '#6573eb',
      lightAccent: '#d6f3ff',
      contrast: '#fd94ce',
      backgroundImage: 'assets/images/background/blue-background.jpg'
    },
    {
      type: 'green',
      darkAccent: '#51763d',
      mediumToDarkAccent: '#73A857',
      mediumAccent: '#57a871',
      lightAccent: '#d8ffc2',
      contrast: '#6ecab9',
      backgroundImage: 'assets/images/background/green-background.jpg'
    },
    {
      type: 'chocolate',
      darkAccent: '#55373d',
      mediumToDarkAccent: '#7a4f54',
      mediumAccent: '#d8085f',
      lightAccent: '#ffe9ed',
      contrast: '#91c989',
      backgroundImage: 'assets/images/background/chocolate-background.jpg'
    },
    {
      type: 'pink',
      darkAccent: '#984a9b',
      mediumToDarkAccent: '#f38bd4',
      mediumAccent: '#bc8bf3',
      lightAccent: '#ffe4fd',
      contrast: '#daf38b',
      backgroundImage: 'assets/images/background/pink-background.jpg'
    },
    {
      type: 'red',
      darkAccent: '#793735',
      mediumToDarkAccent: '#FB6964',
      mediumAccent: '#fba264',
      lightAccent: '#ffdad9',
      contrast: '#ff5b9f',
      backgroundImage: 'assets/images/background/red-background.jpg'
    },
    {
      type: 'sand',
      darkAccent: '#84846b',
      mediumToDarkAccent: '#BDBB99',
      mediumAccent: '#b0bd99',
      lightAccent: '#fff8d9',
      contrast: '#b6c3e0',
      backgroundImage: 'assets/images/background/sand-background.jpg'
    },
    {
      type: 'cian',
      darkAccent: '#4e817e',
      mediumToDarkAccent: '#8ba7ec',
      mediumAccent: '#e79049',
      lightAccent: '#c0f0ed',
      contrast: '#ec8bd6',
      backgroundImage: 'assets/images/background/cian-background.jpg'
    }
  ];
  
  constructor(utils) {
    this.utils = utils;
    this.lms = {
      backgroundImgLm: document.getElementById('background-image')
    };
    this.timIds = {};
  }

  changeRootTheme({ darkAccent, mediumToDarkAccent, mediumAccent, lightAccent, contrast }) {
    const rootLm = document.documentElement;

    rootLm.style = `
      --dark-accent-color: ${darkAccent};
      --dark-to-medium-accent-color: ${mediumToDarkAccent};
      --medium-accent-color: ${mediumAccent};
      --light-accent-color: ${lightAccent};
      --contrast-color: ${contrast};
    `;
  }

  loadBgImgProgressively(theme, time) {
    const bgImgUrl = theme.backgroundImage;
    const preloadImgLm = document.createElement('img');
    preloadImgLm.src = bgImgUrl;

    // Avoid race condition using a unique symbol
    const loadToken = Symbol();
    this.currentLoadToken = loadToken;

    this.changeRootTheme(theme);

    const loadBgImg = url => {
      if (this.currentLoadToken !== loadToken) {
        console.warn('different theme while former event active, return');
        return;
      };
      this.lms.backgroundImgLm.style.opacity = 1;
      this.lms.backgroundImgLm.style.backgroundImage = `url(${url})`;
    }

    const handleLoadBgImg = url => () => loadBgImg(url);
    const loadBgImgHandler = handleLoadBgImg(bgImgUrl);
  
    this.timIds.loadBgIm = setTimeout(() => {
      if (preloadImgLm.complete) {
        loadBgImgHandler();
      }
      else {
        preloadImgLm.addEventListener('load', loadBgImgHandler, { once: true });
      }
    }, time);
  }

  setRandomTheme(time = 0) {
    this.lms.backgroundImgLm.style.opacity = 0;
    clearTimeout(this.timIds.loadBgIm);
    this.currentLoadToken = null;

    const index = this.utils.getNonRepeatingRandomIndex(ThemeHandler.themes, 'themes');
    const currentTheme = ThemeHandler.themes[index];
    this.loadBgImgProgressively(currentTheme, time);
  }
}