export default class QuoteMachineController {
  constructor(quoteModel, quoteMachineView, utils) {
    this.quoteModel = quoteModel;
    this.quoteMachineView = quoteMachineView;
    this.utils = utils;

    this.lms = this.quoteMachineView.getDomRefs();

    this.getAllQuotes();

    this.lms.getNewQuoteBtn.addEventListener('click', this.setQuote.bind(this));
  }

  setQuote() {
    const currentQuote = this.quoteModel.getRandomQuoteFromCache();
    if (currentQuote === null) {
      return;
    }
    this.quoteMachineView.renderQuote(currentQuote);
  }

  getAllQuotes() {
    const cachedQuotes = this.quoteModel.getQuotesFromCache()

    if (cachedQuotes) {
      this.setQuote();
      return;
    }

    this.quoteMachineView.updateQuoteLoader(true);

    this.quoteModel.handleGetAllQuotes()
      .then(quotes => {
        this.quoteModel.setQuotesToCache(quotes);
        this.setQuote();
      })
      .catch(error => {
        console.error(error);
      })
      .then(() => {
        this.quoteMachineView.updateQuoteLoader(false);
      });
  }
}