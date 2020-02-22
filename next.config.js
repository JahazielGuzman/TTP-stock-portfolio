module.exports = {
    env: {
      REACT_APP_BACKEND: process.env.NODE_ENV === "production" ? 'https://jaziel-stock-portfolio.herokuapp.com' : 'http://localhost:3000'
    },
  }