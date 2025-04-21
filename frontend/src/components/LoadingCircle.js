export default class LoadingCircle {
  static getHtml(type = 'large') {
    return `
      <div class="loading-circle ${type}"></div>
    `;
  }
}