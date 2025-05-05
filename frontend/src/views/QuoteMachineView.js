export default class QuoteMachineView {
  constructor(utils) {
    this.utils = utils;
    this.lms = {
      quoteTextLm: document.getElementById('quote-machine__text'),
      quoteAutorLm: document.getElementById('quote-machine__author'),
      twitterShareButton: document.getElementById('quote-machine__share-with-twitter-btn'),
      tumblrShareButton: document.getElementById('quote-machine__share-with-tumblr-btn'),
      getNewQuoteBtn: document.getElementById('quote-machine__new-quote-btn')
    };
  }

  getDomRefs() {
    return this.lms;
  }

  setQuoteError(message) {
    this.lms.quoteTextLm.innerText = message;
  }

  setQuoteData({quote, author}) {
    this.lms.quoteTextLm.innerHTML = ` 
      <svg class="quote-machine__quotes-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z"/>
      </svg>
      ${quote}
    `;

    this.lms.quoteAutorLm.innerText = `- ${author}`;
  }

  setShareBtnsHrefAttr({ quote, author }) {
    // Encode the quote and author for URL usage
    const encodedFullQuote = encodeURIComponent(`"${quote}" - ${author}`)
    const encodedQuote = encodeURIComponent(quote);
    const encodedAuthor = encodeURIComponent(author);

    // Set the href attribute for the Twitter share button with the quote data
    this.lms.twitterShareButton.href = `https://twitter.com/intent/tweet?hashtags=quotes,inspirational,success&text=${encodedFullQuote}`;
    // Set the href attribute for the Tumblr share button with the quote data
    this.lms.tumblrShareButton.href = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes&caption=${encodedAuthor}&content=${encodedQuote}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;
  }

  renderQuote(quote) {
    this.setQuoteData(quote);
    this.setShareBtnsHrefAttr(quote);
  }

  updateQuoteLoader(load) {
    if (!this.lms.quoteTextLm) return;
    load ? this.lms.quoteTextLm.classList.add('loading') : this.lms.quoteTextLm.classList.remove('loading');
  }
}