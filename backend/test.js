const axios = require('axios');
async function run() {
  try {
    const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'workwithpunit247@gmail.com',
      password: 'password' // I don't know the password, I will just register a new one
    });
    console.log("Login res:", loginRes.data);
  } catch (err) {
    console.error("Login err:", err.response ? err.response.data : err.message);
  }
}
run();
