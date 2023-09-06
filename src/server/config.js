require('dotenv').config();
console.log('Starting',process.env.API_URL);
module.exports = {    
    API_URL: process.env.API_URL,
};
  