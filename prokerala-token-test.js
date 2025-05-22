import axios from 'axios';


const CLIENT_ID = '688e78fb-6ebd-431d-9de8-1e3515fa46c6';
const CLIENT_SECRET = 'utLbnPffYkhTUzphK1mEJOcHQv2A8eEV2elcW0rB';
const TOKEN_URL = 'https://api.prokerala.com/token';

async function getToken() {
  try {
    const response = await axios({
      method: 'post',
      url: TOKEN_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
      }).toString()
    });
    console.log('Access token:', response.data.access_token);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

getToken();
