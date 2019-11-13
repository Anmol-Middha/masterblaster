const express = require('express');
const router = express.Router();

//route to get 50s of each player
router.post('/50s', (req, res)=>{
    let players = req.body.players;
    let rslt = [];
    players.forEach(record => {
        req.data.find((d) =>{
            if(d.Player == record){
                const temp = {"name": record.split(" (")[0],"fifties": parseInt(d["50"]), "rate": parseFloat(d["50"]/d["Inns"]).toFixed(3)};
                rslt.push(temp);
            }
        });
    });
    res.status(200).json(rslt);
});

//route to get centuries of each player
router.post('/100s', (req, res)=>{
    let players = req.body.players;
    let rslt = [];
    players.forEach(record => {
        req.data.find((d) =>{
            if(d.Player == record){
                const temp = {"name": record.split(" (")[0],"hundreds": parseInt(d["100"]), "rate": parseFloat(d["100"]/d["Inns"]).toFixed(3)};
                rslt.push(temp);
            }
        });
    });
    res.status(200).json(rslt);
});

//route to get 0s of each player
router.post('/0s', (req, res)=>{
    let players = req.body.players;
    let rslt = [];
    players.forEach(record => {
        req.data.find((d) =>{
            if(d.Player == record){
                const temp = {"name": record.split(" (")[0],"zeroes": parseInt(d["0"]), "rate": parseFloat(d["0"]/d["Inns"]).toFixed(3)};
                rslt.push(temp);
            }
        });
    });
    res.status(200).json(rslt);
});

//route to compare totalruns and highest score of each player
router.post('/totalruns', (req, res)=>{
    let players = req.body.players;
    let rslt = [];
    players.forEach(record => {
        req.data.find((d) =>{
            if(d.Player == record){
                let HSstatus ="Out"
                if(d["HS"].split("*").length == 2){
                    HSstatus = "Not Out";
                }
                const temp = {"name": record.split(" (")[0], "total_runs": parseInt(d["Runs"]), "HS":parseInt(d["HS"].split('*')), "HS_status":HSstatus};
                rslt.push(temp);
            }
        });
    });
    res.status(200).json(rslt);
});

//router to compare Batting average and Mean strike of every player
router.post('/batavg', (req, res)=>{
    let players = req.body.players;
    let rslt = [];
    players.forEach(record => {
        req.data.find((d) =>{
            if(d.Player == record){
                const temp = {"name": record.split(" (")[0],"strike_rate": parseFloat(d["SR"]).toFixed(2), "bat_avg": parseFloat(d["Ave"]).toFixed(2)};
                rslt.push(temp);
            }
        });
    });
    res.status(200).json(rslt);
});

module.exports = router;