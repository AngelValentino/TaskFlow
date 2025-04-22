import config from "../config.js";

export default class QuoteModel {
  constructor(utils, router) {
    this.utils = utils;
    this.router = router;
    this.baseEndpointUrl = config.apiUrl + '/quotes';
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
    const index = this.utils.getNonRepeatingRandomIndex(quotes, 'quotes');
    return quotes[index];
  }

  async handleGetAllQuotes() {
    const response = await fetch(this.baseEndpointUrl, {
      headers: {
        'X-Device-ID': sessionStorage.getItem('deviceUUID')
      }, 
      signal: this.router.getAbortSignal(this.utils.formatFetchRequestKey('GET', this.baseEndpointUrl))
    });

    // Rate limited
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: We couldn't get the quotes data. Please try again later.`);
    }
    
    return await response.json();
  }
}