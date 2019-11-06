const express = require('express');
const router = express.Router();

router.post('/info', (req, res)=>{
    let personal_info = {name: "Sachin Tendulkar", total_run: 0, hs: 0, two_hundreds: 0, centuries: 0, fifties: 0, bat_avg: 0, wickets: 0, bowl_avg: 0, catch: 0,stump: 0}
    let total_run = 0;
    let matches = 0;
    let bat_max = 0;
    let centuries = 0;
    let two_hundreds = 0;
    let fifties = 0;  
    let total_wickets = 0;
    let total_runs_conceded = 0;
    let total_catches = 0;
    let total_stumps = 0;

    req.data.forEach((record) => {
        let run = parseInt(record.batting_score);
        if(!isNaN(run)){
            total_run += run
            matches++;
            if(run > bat_max){
                bat_max = run;
            }
            if(run >= 200){
                two_hundreds++;
            }
            if(run >= 100 && run<200){
                centuries++;
            }
            if(run>=50 && run<100){
                fifties++;
            }
        }
    
        let wickets = parseInt(record.wickets);
        let runs_conceded = parseInt(record.runs_conceded);
        
        if(!isNaN(wickets)){
            total_wickets += wickets;
            total_runs_conceded += runs_conceded;
        }

        let catches = parseInt(record.catches);
        let stumps = parseInt(record.stumps);

        if(!isNaN(catches)){
            total_catches += catches;
        }
        
        if(!isNaN(stumps)){
            total_stumps += stumps;
        }
    });

    personal_info.total_run = total_run;
    personal_info.hs = bat_max;
    personal_info.two_hundreds = two_hundreds;
    personal_info.centuries = centuries;
    personal_info.fifties = fifties;
    personal_info.bat_avg = total_run/matches;
    personal_info.wickets = total_wickets;
    personal_info.bowl_avg = total_runs_conceded/total_wickets;
    personal_info.catch = total_catches;
    personal_info.stump = total_stumps;

    res.status(200).json(personal_info);
});

router.post('/ground', (req, res) =>{
let location_data = [];
req.data.forEach((record)=>{
    let location = record.ground;
    let score = parseInt(record.batting_score);

    if(!isNaN(score)){
        let flag = 0;
        for(var i=0; i<location_data.length; i++){
            if(location_data[i].hasOwnProperty(location)){
                flag = 1;
                location_data[i][location] += score;
                break;
            }
        }
        if(flag == 0){
            location_data.push({[location]: score});
        }
    }
})
res.status(200).json(location_data);
});  

router.post('/country', (req, res)=>{
    let country_data = [];
    req.data.forEach((record)=>{
        let country = record.opposition.split("v ")[1];
        let score = parseInt(record.batting_score);
    
        if(!isNaN(score)){
            let flag = 0;
            for(var i=0; i<country_data.length; i++){
                if(country_data[i].hasOwnProperty(country)){
                    flag = 1;
                    country_data[i][country] += score;
                    break;
                }
            }
            if(flag == 0){
                country_data.push({[country]: score});
            }
        }
    });
    res.status(200).json(country_data);
});

router.post('/team', (req, res)=>{
    let victory_data = [];
    let win_matches = 0;
    let victory_runs = 0;
    let lost_matches = 0;
    let lost_runs = 0;
    let tied_matches = 0;
    let tied_runs = 0;
    req.data.forEach((record)=>{
        let runs = parseInt(record.batting_score);
        let status = record.match_result;

        if(!isNaN(runs)){
            victory_data.push({runs: [runs], status: [status]});
        }
        if(!isNaN(runs) && status == "won"){
            win_matches++;
            victory_runs += runs;
        }
        if(!isNaN(runs) && status == "lost"){
            lost_matches++;
            lost_runs += runs;
        }
        if(!isNaN(runs) && status == "tied"){
            tied_matches++;
            tied_runs += runs;
        }
    });
    let victory_avgruns = victory_runs/win_matches;
    let lost_avgruns = lost_runs/lost_matches;
    let tied_avgruns = tied_runs/tied_matches;
    res.status(200).json({data: victory_data, sachin_vict_avg: victory_avgruns, sachin_lost_avg: lost_avgruns, sachin_tied_avg: tied_avgruns});
}); 

router.post('/year', (req, res)=>{
    let yeardata = [];
    let yearrecord = {"1989": {total_run: 0, matches: 0, bat_avg: 0, centuries: 0}};

    req.data.forEach(record=>{
        // console.log(typeof(record.date));
        let year = record.date.split(" ")[2];
        // console.log(typeof(year)); 
        let run = parseInt(record.batting_score);
        let flag = 1;
        for(let i=0; i<yeardata.length; i++){
            if(!isNaN(run) && yeardata[i].hasOwnProperty(year)){
                yeardata[i][year].total_run+=run;
                if(run >= 100){
                    yeardata[i][year].centuries+=1;
                }
                yeardata[i][year].matches+=1;
                yeardata[i][year].bat_avg = yeardata[i][year].total_run / yeardata[i][year].matches;
                flag = 0;
            }
        }
        if(!isNaN(run) && flag == 1){
            let newrecord = {};
            if(run >= 100){
                newrecord = {[year]: {"total_run": run, "matches": 1, "bat_avg": run, "centuries": 1}};
            }
            else{
                newrecord = {[year]: {"total_run": run, "matches": 1, "bat_avg": run, "centuries": 0}};
            }
            yeardata.push(newrecord);
        }
    })
    res.status(200).json({yeardata});
});

module.exports = router
