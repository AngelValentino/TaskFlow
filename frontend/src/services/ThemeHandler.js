export default class ThemeHandler {
  static themes = [
    {
      darkAccent: '#593e7f',
      mediumToDarkAccent: '#9b59b6',
      mediumAccent: '#b259b6',
      lightAccent: '#ecdeff',
      contrast: '#dfd684',
      backgroundImage: 'public/assets/images/background/purple-background.jpg'
    },
    {
      darkAccent: '#2e6881',
      mediumToDarkAccent: '#427db8',
      mediumAccent: '#6573eb',
      lightAccent: '#d6f3ff',
      contrast: '#fd94ce',
      backgroundImage: 'public/assets/images/background/blue-background.jpg'
    },
    {
      darkAccent: '#51763d',
      mediumToDarkAccent: '#73A857',
      mediumAccent: '#57a871',
      lightAccent: '#d8ffc2',
      contrast: '#6ecab9',
      backgroundImage: 'public/assets/images/background/green-background.jpg'
    },
    {
      darkAccent: '#55373d',
      mediumToDarkAccent: '#7a4f54',
      mediumAccent: '#d8085f',
      lightAccent: '#ffe9ed',
      contrast: '#91c989',
      backgroundImage: 'public/assets/images/background/chocolate-background.jpg'
    },
    {
      darkAccent: '#984a9b',
      mediumToDarkAccent: '#f38bd4',
      mediumAccent: '#bc8bf3',
      lightAccent: '#ffe4fd',
      contrast: '#daf38b',
      backgroundImage: 'public/assets/images/background/pink-background.jpg'
    },
    {
      darkAccent: '#793735',
      mediumToDarkAccent: '#FB6964',
      mediumAccent: '#fba264',
      lightAccent: '#ffdad9',
      contrast: '#ff5b9f',
      backgroundImage: 'public/assets/images/background/red-background.jpg'
    },
    {
      darkAccent: '#84846b',
      mediumToDarkAccent: '#BDBB99',
      mediumAccent: '#b0bd99',
      lightAccent: '#fff8d9',
      contrast: '#b6c3e0',
      backgroundImage: 'public/assets/images/background/sand-background.jpg'
    },
    {
      darkAccent: '#4e817e',
      mediumToDarkAccent: '#8ba7ec',
      mediumAccent: '#e79049',
      lightAccent: '#c0f0ed',
      contrast: '#ec8bd6',
      backgroundImage: 'public/assets/images/background/cian-background.jpg'
    }
  ];
  
  constructor(utils) {
    this.utils = utils;
    this.lms = {
      backgroundImgLm: document.getElementById('background-image')
    };
    this.timIds = {};

    this.setRandomTheme();
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

    this.changeRootTheme(theme);

    const loadBgImg = url => {
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
        preloadImgLm.addEventListener('load', loadBgImgHandler);
      }
    }, time);
  }

  setRandomTheme(time = 0) {
    this.lms.backgroundImgLm.style.opacity = 0;
    clearTimeout(this.timIds.loadBgIm);

    const index = this.utils.getNonRepeatingRandomIndex(ThemeHandler.themes, 'themes');
    const currentTheme = ThemeHandler.themes[index];
    this.loadBgImgProgressively(currentTheme, time);
  }
}