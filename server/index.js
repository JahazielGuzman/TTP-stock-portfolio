const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('../routes/auth');
dotenv.config();

const PORT = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app
    .prepare()
    .then(() => {

        const server = express();

        server.use(express.urlencoded({extended: false}));
        server.use(express.json());
        server.use('/api/auth', authRoutes);

        mongoose.connect(process.env.MONGO_URL,  {useNewUrlParser: true, useUnifiedTopology: true});


        server.get('/api', (req, res) => {

            res.status(200).send("hello");
        });

        server.get("*", (req, res) => {

            return handle(req, res);
        });
        
        server.listen(PORT, err => {
            if (err) throw err;
            
            console.log(`READY ON PORT ${PORT}`);
        })
    })
    .catch(ex => {

        console.error(ex.stack);
        process.exit(1);
    });