const express = require('express');
const router = express.Router();

//get the personal info of sachin
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
            total_run += run;               //total runs scored
            let notouts = record.batting_score.split("*");
            if(notouts.length == 1){
                matches++;                  //total matches sachin got bowled
            }
            if(run > bat_max){
                bat_max = run;              //highest score 
            }
            if(run >= 200){
                two_hundreds++;             // >200
            }
            if(run >= 100){
                centuries++;               //centuries
            }
            if(run>=50 && run<100){
                fifties++;                 //fifties
            }
        }
    
        let wickets = parseInt(record.wickets);         //total wickets
        let runs_conceded = parseInt(record.runs_conceded);     //total runs
        
        if(!isNaN(wickets)){
            total_wickets += wickets;
            total_runs_conceded += runs_conceded;
        }

        let catches = parseInt(record.catches);         
        let stumps = parseInt(record.stumps);           

        if(!isNaN(catches)){
            total_catches += catches;                   //total catches
        }
        
        if(!isNaN(stumps)){
            total_stumps += stumps;                     //total stumps
        }
    });

    personal_info.total_run = total_run;
    personal_info.hs = bat_max;
    personal_info.two_hundreds = two_hundreds;
    personal_info.centuries = centuries;
    personal_info.fifties = fifties;
    personal_info.bat_avg = (total_run/matches).toFixed(2);
    personal_info.wickets = total_wickets;
    personal_info.bowl_avg = (total_runs_conceded/total_wickets).toFixed(2);
    personal_info.catch = total_catches;
    personal_info.stump = total_stumps;

    res.status(200).json(personal_info);
});

// scores vs grounds where sachin played
router.post('/ground', (req, res) =>{
let location_data = [];
req.data.forEach((record)=>{
    let location = record.ground;
    let score = parseInt(record.batting_score);

    if(!isNaN(score)){
        let flag = 0;
        for(var i=0; i<location_data.length; i++){
            if(location_data[i].loc == location){   //if ground is already present in result array
                flag = 1;
                location_data[i].runs += score;
                location_data[i].matches ++;
                break;
            }
        }
        if(flag == 0){                          //if ground is encountered for first time
            location_data.push({loc: location, runs: score, matches :1});
        }
    }
    
})
res.status(200).json({data: location_data});
});  

// total runs vs oponents teams
router.post('/country', (req, res)=>{
    let country_data = [];
    req.data.forEach((record)=>{
        let country = record.opposition.split("v ")[1];
        let score = parseInt(record.batting_score);
    
        if(!isNaN(score)){
            let flag = 0;
            for(var i=0; i<country_data.length; i++){
                if(country_data[i].hasOwnProperty(country)){       // if match has already played with this team    
                    flag = 1;
                    country_data[i][country] += score;
                    break;
                }
            }
            if(flag == 0){
                country_data.push({[country]: score});      // if this is the first match with this team
            }
        }
    });
    res.status(200).json(country_data);
});

//score ranges vs india victory
router.post('/team', (req, res)=>{
    let victory_data = {
        "0-30": {"won": 0, "lost": 0, "tied": 0, "n/r": 0}, 
        "31-50":{"won": 0, "lost": 0, "tied": 0, "n/r": 0} , 
        "51-80": {"won": 0, "lost": 0, "tied": 0, "n/r": 0}, 
        "81-100": {"won": 0, "lost": 0, "tied": 0, "n/r": 0}, 
        "101-150": {"won": 0, "lost": 0, "tied": 0, "n/r": 0}, 
        "151-200": {"won": 0, "lost": 0, "tied": 0, "n/r": 0}
    };

    

    let total_matches = 0;
    req.data.forEach((record)=>{
        let runs = parseInt(record.batting_score);
        let status = record.match_result;
        
        //update every match status counts
        if(!isNaN(runs)){
            if(runs>=0 && runs<=30){
                victory_data["0-30"][status]++; 
            }
            else if(runs<=50){
                victory_data["31-50"][status]++;
            }
            else if(runs<=80){
                victory_data["51-80"][status]++;
            }
            else if(runs<=100){
                victory_data["81-100"][status]++;
            }
            else if(runs<=150){
                victory_data["101-150"][status]++;
            }
            else if(runs<=200){
                victory_data["151-200"][status]++;
            }
            total_matches++;
        }
        
    });
    res.status(200).json({"data": victory_data, "matches": total_matches});
}); 

//every year performance of sachin
router.post('/year', (req, res)=>{
    let yeardata = [];
    let yearrecord = {"1989": {total_run: 0, matches: 0, bat_avg: 0, centuries: 0}};

    req.data.forEach(record=>{
        let year = record.date.split(" ")[2];      //getting year from date 
        let run = parseInt(record.batting_score);
        let flag = 1;
        
        for(let i=0; i<yeardata.length; i++){
            //if record with particular year is already visited
            if(!isNaN(run) && yeardata[i].hasOwnProperty(year)){
                //total runs in a year
                yeardata[i][year].total_run+=run;
                // counting centuries in year
                if(run >= 100){
                    yeardata[i][year].centuries+=1;
                }
                yeardata[i][year].matches+=1;
                //bat avg of each year
                yeardata[i][year].bat_avg = (yeardata[i][year].total_run / yeardata[i][year].matches).toFixed(2);
                flag = 0;
            }
        }
        //if this year record is not visited
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
