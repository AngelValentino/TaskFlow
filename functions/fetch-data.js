const handler = async () => {
  try {
    const key = process.env.API_KEY;
    const url = 'https://api.api-ninjas.com/v1/quotes?category=success';
  
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'X-Api-Key': key}
    });
  
    const data =  await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data[0]),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
}

module.exports = { handler }
