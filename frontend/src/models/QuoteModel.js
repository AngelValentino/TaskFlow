export default class QuoteModel {
  constructor(utils, router) {
    this.utils = utils;
    this.router = router;
    this.baseEndpointUrl = 'http://taskflow-api.com/quotes';
  }

  setQuotesToCache(quotes) {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  getQuotesFromCache() {
    return JSON.parse(localStorage.getItem('quotes')) || null;
  }

  getRandomQuoteFromCache() {
    const quotes = this.getQuotesFromCache();
    if (!quotes) return null;
    const index = this.utils.getNonRepeatingRandomIndex(quotes, 'quotes')
    return quotes[index];
  }

  async handleGetAllQuotes() {
    const response = await fetch(this.baseEndpointUrl, {
      signal: this.router.getAbortSignal('GET' + this.baseEndpointUrl)
    });

    if (!response.ok) {
      throw new Error("We couldn't get the quotes data. Please try again later.");
    }
    
    return await response.json();
  }
}