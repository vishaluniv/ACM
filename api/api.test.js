const https = require('https');
const axios = require('axios').create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});
const API_URL = 'https://localhost:5000/api';

test('mixers', async () => {
    await axios.get(`${API_URL}/mixers?ind=${1}`)
    .then(resp => resp.data)
    .then(resp => {
      console.log(resp);
      expect(resp.mixers[1]).toEqual("Gin");
    });
});

test('mixers1', async () => {
    await axios.get(`${API_URL}/mixers?ind=${0}`)
    .then(resp => resp.data)
    .then(resp => {
      console.log(resp);
      expect(resp.mixers[0]).toEqual("Tonic");
    });
});

test('drink', async () => {
    await axios.get(`${API_URL}/drink?drinkIndex=${2}`)
    .then(resp => resp.data)
    .then(resp => {
      console.log(resp);
      expect(resp.cost).toEqual(42);
    });
});

test('drink1', async () => {
    await axios.get(`${API_URL}/drink?drinkIndex=${0}`)
    .then(resp => resp.data)
    .then(resp => {
      console.log(resp[2]);
      expect(resp.cost).toEqual(38);
    });
});

test('drink2', async () => {
    await axios.get(`${API_URL}/drink?drinkIndex=${1}`)
    .then(resp => resp.data)
    .then(resp => {
      console.log(resp[2]);
      expect(resp.cost).toEqual(22);
    });
});







