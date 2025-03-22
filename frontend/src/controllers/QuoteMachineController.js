export default class QuoteMachineController {
  constructor(quoteModel, quoteMachineView, utils, themeHandler, taskManagerView) {
    this.quoteModel = quoteModel;
    this.quoteMachineView = quoteMachineView;
    this.utils = utils;
    this.themeHandler = themeHandler;
    this.taskManagerView = taskManagerView;

    this.lms = this.quoteMachineView.getDomRefs();

    this.getAllQuotes();

    this.lms.getNewQuoteBtn.addEventListener('click', this.setQuoteAndTheme.bind(this));
  }

  setQuoteAndTheme() {
    if (this.taskManagerView.isAddTaskFormEdited()) {
      return;
    }
    this.setQuote();
    this.themeHandler.setRandomTheme(1050);
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

    let wasFetchAborted = false;
    const loadingTimId = this.utils.handleLoading(
      this.quoteMachineView.updateQuoteLoader.bind(this.quoteMachineView, true)
    );

    this.quoteModel.handleGetAllQuotes()
      .then(quotes => {
        this.quoteModel.setQuotesToCache(quotes);
        this.setQuote();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('aborted get all quotes due to navigation change')
          return;
        }

        console.error(error);
      })
      .finally(() => {
        clearTimeout(loadingTimId);
        if (wasFetchAborted) return;
        this.quoteMachineView.updateQuoteLoader(false);
      });
  }
}