export default class ThreeDotsLoader {
  static getHtml() {
    return `
      <div class="three-dots-loader end">
        <div class="dot" data-index="0"></div>
        <div class="dot" data-index="1"></div>
        <div class="dot" data-index="2"></div>
      </div>
    `;
  }
}