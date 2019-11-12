const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

module.exports = (req, res, next)=>{
let data = [];  

fs.createReadStream(path.join(__dirname , '../data/comparison.csv'))
.pipe(csv())
.on('data', rslt=>{
    try {
        data.push(rslt);
    }
    catch(err) {
        return res.status(500).json({err, message: "Data Loading Error"});
    }
})
.on('end', ()=>{
    req.data = data;
    next();
})
}