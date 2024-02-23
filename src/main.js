async function getQuoteData() {
  const response = await  fetch('/.netlify/functions/fetch-data');

  if (response.status !== 200) {
    throw new Error("Could't fetch the data");
  }

  return await response.json();
}

document.querySelector('button').addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));

});
