const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

const sachinAnalysisRoute = require('./api/routes/sachinAnalysis.js');
const fetchDataMiddleware = require('./api/middleware/fetchData');

app.use('/sachin', fetchDataMiddleware ,sachinAnalysisRoute);

app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.json({
        error:{
            message: err.message
        }
    })
});

module.exports = app;
