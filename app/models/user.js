const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema
const StockSchema = new mongoose.Schema({
    ticker: {
        type: String,
        uppercase: true,
        required: true
    },

    quantity: {

        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 5000.00
    },
    stocks: {
        type: [StockSchema],
        default: []
    }
});

// save the users password

UserSchema.pre('save', async function (next) {
    
    const user = this;
    
    try {    
        if (this.isModified('password') || this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);    
            user.password = hash;
        }
        return next();
    }
    catch(err) {
        return next(err);
    }

})

UserSchema.methods.comparePassword = function(pw) {

    return bcrypt.compare(pw, this.password);
}

UserSchema.methods.transactions = function() {

    return this.stocks;
}

/* If we can afford the stock then add it to our stocks array and lower our balace
    Otherwise return appropriate error message
*/

UserSchema.methods.buyStock = function(ticker, quantity, price) {

    const cost = quantity * price;

    if (cost < this.balance) {
        
        this.balance -= cost;
        this.stocks.push({ticker, quantity, price});
    }

    else {
        throw new Error("Not enough money to buy stock");
    }
}

/*
    take our stocks array which holds our transactions and reduce it into
    a unique set of tickers and accumulated quantities over all transactions for each ticker
*/
UserSchema.methods.portfolio = function() {

    const portfolio = {};

    for (stock of this.stocks) {

        if (!portfolio[stock.ticker]) {

            portfolio[stock.ticker] = {ticker: stock.ticker, quantity: 0, value: 0}
        }

        portfolio[stock.ticker].quantity += stock.quantity;
    }

    return Object.values(portfolio);
}

module.exports = mongoose.model('User', UserSchema);