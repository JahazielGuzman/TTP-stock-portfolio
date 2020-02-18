const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema

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
        type: Array,
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

UserSchema.methods.buyStock = function(ticker, quantity, price) {

    const cost = quantity * price;

    if (cost < this.balance) {
        
        this.balance -= cost;
        this.stocks.push({ticker: ticker.toUpperCase(), quantity, price});
    }

    else {
        throw new Error("Not enough money to buy stock");
    }
}

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