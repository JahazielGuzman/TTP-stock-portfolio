const express = require('express');
const User = require('../app/models/user');
const passport = require('passport');
const fetch = require('isomorphic-unfetch');
const _ = require('lodash');


const portfolioRoutes = express.Router();

/* 
    This route is fired when user is on /portfolio page.
    We get the 5 min time series for the ticker user has submitted.
    We use the most recent value to calculate price * quantity and also see how it performed compared to days open price
*/
portfolioRoutes.get('/portfolio', passport.authenticate('jwt', {session: false}), async (req, res) => {
    
    const user = await User.findOne({email: req.user.email});
    const portfolio = user.portfolio();
    let response, current, daily_recent, day_open_index, current_day, most_recent, current_value, daily_value, total = 0;
    
    try {
    
        for (stock of portfolio) {
            
            await waitMilliSeconds(300);

            // get the most recent 5-min data for the ticker
            response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.ticker}&interval=5min&apikey=${process.env.STOCK_API_KEY}`);
            current = await response.json();
            
            if (current["Error Message"] )
                return res.status(404).send({success: false, message: "Ticker was invalid"});
            if (current["Note"])
                return res.status(404).send({success: false, message: "Too many requests to vantage API, please wait 1 minutes and refresh the page."});
            
            // store all keys for the time series
            time_intervals = Object.keys(current["Time Series (5min)"]);
            // get the most recent time interval
            most_recent = time_intervals[0];
            // get the current day as a string
            current_day = most_recent.split(' ')[0];
            // get the last key that is in the current day
            day_open_index = time_intervals.map(current => current.split(' ')[0]).lastIndexOf(current_day);
            // use the above index to get the first key of the day
            daily_recent = time_intervals[day_open_index];

            current_value = parseFloat(current["Time Series (5min)"][most_recent]["1. open"]);
            daily_value = parseFloat(current["Time Series (5min)"][daily_recent]["1. open"]);
            
            // calculate the value of the stock based on price and quantity
            stock.value = current_value * stock.quantity;
            total += stock.value;

            // set ls, gt, or eq based on if current value is less than, greater or equal to daily opening price
            if (Math.abs(current_value - daily_value) > 0.0003)
                stock.performance = (current_value < daily_value) ? "ls" : "gt";
            else {
                // values to close to within 0.0001
                stock.performance = "eq";
            }
        }

        return res.status(200).send({success: true, portfolio, total, balance: user.balance });
    }
    catch (err) {
        
        res.status(400).send({success: false, message: err.message});
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
            return res.status(404).send({success: false, message: "Ticker and Quantity values are missing"});

        const user = await User.findOne({email: req.user.email});

        const STOCK_API = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=5min&apikey=${process.env.STOCK_API_KEY}`;
        
        const response = await fetch(STOCK_API);
        const data = await response.json();
        
        if (data["Error Message"])
            return res.status(404).send({success: false, message: "Ticker was invalid"});
        if (data["Note"])
            return res.status(404).send({success: false, message: "Too many requests to vantage API, please wait 1 minutes and refresh the page."});

    
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

        res.status(400).json({success: false, message: err.message});
    }
});

function waitMilliSeconds(x) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, x)
    })
}

module.exports = portfolioRoutes;