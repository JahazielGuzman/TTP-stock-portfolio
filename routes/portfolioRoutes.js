const express = require('express');
const User = require('../app/models/user');
const passport = require('passport');
const fetch = require('isomorphic-unfetch');
const _ = require('lodash');


const portfolioRoutes = express.Router();

portfolioRoutes.get('/portfolio', passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const user = await User.findOne({email: req.user.email});
    const portfolio = user.portfolio();
    let response, data, value, most_recent;
    try {
        
        for (stock of portfolio) {
    
            response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.ticker}&interval=5min&apikey=${process.env.STOCK_API_KEY}`);
            data = await response.json();
            most_recent = Object.keys(data["Time Series (Daily)"])[0];
            value = parseFloat(data["Time Series (Daily)"][most_recent]["1. open"]);
            stock.value = value * stock.quantity.toFixed(5);
        }

        return res.status(200).send({success: true, portfolio: portfolio});
    }
    catch (err) {
        
        res.status(400).send({success: false, message: "Could not get portfolio data"});
    }
    
});

/* show all of the users transactions */
portfolioRoutes.get('/transactions', passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    try {
        const user = await User.findOne({email: req.user.email});
        
        res.status(200).send({success: true, transactions: user.transactions()})
    }
    catch(err) {
        
        res.status(400).send({success: false, message: "Could not authenticate user token"});
    }
});

/*
    This route is fired when the user buys a new stock. The ticker and quantity are taken as inputs.
    If the ticker is valid then the quantity of that stock will be added to the users stocks property.
*/
portfolioRoutes.post('/transactions', passport.authenticate('jwt', {session: false}), async(req, res) => {
    
    const {ticker, quantity} = req.body;

    try {

        if (!ticker || !quantity)
            return res.status(404).send({success: false});
            
            const user = await User.findOne({email: req.user.email});
            
            const STOCK_API = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${process.env.STOCK_API_KEY}`;
            
            const response = await fetch(STOCK_API);
            const data = await response.json();
            
        if (data["Error Message"])
            return res.status(404).send({success: false, message: "Ticker was invalid"});

    
        // get most recent date
        const most_recent = Object.keys(data["Time Series (5min)"])[0]
        const price = parseFloat(data["Time Series (5min)"][most_recent]["1. open"]);

        user.buyStock(ticker, quantity, price);

        user.save((err) => {
            if (err)
                return res.status(400).json({success: false, message: "user save error"});
        });
    
        // return open price for most recent data
        return res.status(200).json({ success: true, stock: _.last(user.transactions()) });
    }

    catch(err) {

        res.status(400).json({success: false, message: "unknown error"});
    }
});

module.exports = portfolioRoutes;