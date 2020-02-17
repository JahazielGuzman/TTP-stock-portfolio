const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User schema
const StockSchema = new mongoose.Schema({

    ticker: {
        type: String,
        required: true,
        uppercase: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const UserSchema = new mongoose.Schema({

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

module.exports = mongoose.model('User', UserSchema);