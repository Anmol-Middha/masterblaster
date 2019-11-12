const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const sachinAnalysisRoute = require('./api/routes/sachinAnalysis.js');
const comparisonAnalysis = require('./api/routes/comparison.js');
const fetchDataMiddleware = require('./api/middleware/fetchData.js');
const fetchComparisonMiddleware = require('./api/middleware/fetchComparsion.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
})

app.use('/sachin', fetchDataMiddleware ,sachinAnalysisRoute);
app.use('/comparison', fetchComparisonMiddleware, comparisonAnalysis);

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
