import { getRandomIndex } from './utils.js';

// DOM references
const quoteTextLm = document.getElementById('quote__text');
const quoteAutorLm = document.getElementById('quote__author');
const shareWithTwitterBtn = document.getElementById('quote__share-with-twitter-btn');
const shareWithTumblrBtn = document.getElementById('quote__share-with-tumblr-btn');

// Object to store the last quote index
export const lastQuoteIndex = {};
// Retrieve stored quotes data from localStorage or initialize it to null
export let quotesData = JSON.parse(localStorage.getItem('quotesData')) || null;

// Asynchronous function to fetch quote data from an API
async function getQuoteData() {
  // Add a loading class to the quote text element to indicate loading
  quoteTextLm.classList.add('load-quote');
  // Fetch the quote data from the provided URL
  const response = await fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json');
  // If the fetch fails, throw an error
  if (response.status !== 200) {
    throw new Error("Couldn't fetch the quote data.");
  }
  // Return the parsed JSON data from the response
  return await response.json();
}

// Generate and display the quote on the page
function generateQuote(data) {
  // Set the inner HTML of the quote text element with the quote data
  quoteTextLm.innerHTML = ` 
    <svg class="quote__quotes-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path fill="currentColor" d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z"/>
    </svg>
    ${data.quote}
  `;
  // Set the inner text of the quote author element with the author's name
  quoteAutorLm.innerText = `- ${data.author}`;
}

// Cache the fetched quotes data in localStorage
function setQuoteCache(value) {
  // Update the quotesData variable with the new data
  quotesData = value;
  // Store the quotes data in localStorage
  localStorage.setItem('quotesData', JSON.stringify(value));
}

// Update the share buttons' href attributes with the current quote
function setShareBtnsHrefAttr(randomCurrentQuote) {
  // Encode the quote and author for URL usage
  const msg = encodeURIComponent(`"${randomCurrentQuote.quote}" - ${randomCurrentQuote.author}`)
  const quote = encodeURIComponent(randomCurrentQuote.quote);
  const author = encodeURIComponent(randomCurrentQuote.author);

  // Set the href attribute for the Twitter share button with the quote data
  shareWithTwitterBtn.href = `https://twitter.com/intent/tweet?hashtags=quotes,inspirational,success&text=${msg}`;
  // Set the href attribute for the Tumblr share button with the quote data
  shareWithTumblrBtn.href = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes&caption=${author}&content=${quote}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;
}

export function setQuote(quotesData, lastQuoteIndex) {
  // Get a random unique index for a quote
  const currentIndex = getRandomIndex(quotesData, lastQuoteIndex.current);
  // Get the quote data for the selected random index
  const randomCurrentQuote = quotesData[currentIndex];
  // Update the lastQuoteIndex with the current index
  lastQuoteIndex.current = currentIndex;

  // Generate and display the quote on the page
  generateQuote(randomCurrentQuote);
  // Update the share buttons with the current quote data
  setShareBtnsHrefAttr(randomCurrentQuote);
}

// Check if quotes data is available and set a quote
export function loadQuote() {
  if (!quotesData) {
    // If quotes cache is not found, fetch quotes from an API
    getQuoteData()
      .then(data =>{
        // Cache the fetched quotes data locally
        setQuoteCache(data.quotes);
        // Set and display a quote on the page
        setQuote(quotesData, lastQuoteIndex);
      })
      .catch(err => {
        // If there's an error, display an error message
        quoteTextLm.innerHTML = `<p>Couldn't fetch the quote data.</p>`;
        console.error(err);
      })
      .finally(() => {
        // Remove the loading class from the quote text element
        quoteTextLm.classList.remove('load-quote');
      });
  } 
  else {
    // If quotes data is found in cache, directly set and display a quote
    setQuote(quotesData, lastQuoteIndex);
  }
}