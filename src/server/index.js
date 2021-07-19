

const CSVtoJSON = require("csvtojson");

//Number of matches played per year for all the years in IPL.

function getMatchesPlayedPerYear(matches) {
    return matches.reduce((matchesPerYear, match) => {
      const season = match.season;
      if (matchesPerYear.hasOwnProperty(season)) {
        matchesPerYear[season] += 1;
      } else {
        matchesPerYear[season] = 1;
      }
      return matchesPerYear;
    }, {});
}

//Number of matches won per team per year in IPL.

function matchesWonPerTeamPerYear(matches) {
    let setOfYears = new Set(matches.map(match => match.season))
    let arrOfYears = Array.from(setOfYears).sort((a, b) => a - b);
    return matches.reduce((matchesWonPerTeamPerYear, match) => {
        const season = match.season;
        for (let i = 0; i < arrOfYears.length; i++) {
            let res = matches.filter(x => x['season'] == arrOfYears[i])
            .reduce((matchesWon, match) => {
            const winner = match.winner;
            if (matchesWon.hasOwnProperty(winner)) {
                matchesWon[winner] += 1;
            } else {
                matchesWon[winner] = 1;
            } return matchesWon;
        }, {});
        matchesWonPerTeamPerYear[arrOfYears[i]] = res;
    } return matchesWonPerTeamPerYear;
    }, {});
}

//Extra runs conceded per team in the year 2016

function runsConcededPerTeamIn2016(matches, deliveries) {
    let runsConcededPerTeamIn2016 = {};
    let arrOf2016 = matches.filter(x => x['season'] == 2016)
    .map(match => match.id);
    let arrOfDeliveriesOf2016 = deliveries.filter(x => arrOf2016.includes(x['match_id']));
    for (let i = 0; i < arrOfDeliveriesOf2016.length; i++) {
        let eachMatchIDRuns = arrOfDeliveriesOf2016.filter(x => x['match_id'] == arrOfDeliveriesOf2016[i]['match_id']);
        let totalRuns = eachMatchIDRuns.map(run => parseInt(run['extra_runs']))
        .reduce((a, b) => a + b, 0);
        runsConcededPerTeamIn2016[arrOfDeliveriesOf2016[i]['batting_team']] = totalRuns;
    } return runsConcededPerTeamIn2016;
}

// Top 10 economical bowlers in the year 2015

function topTenEconomicalBowlersIn2015(matches, deliveries) {
    let arrOfInningsOf2015 = matches.filter(x => x['season'] == 2015)
    .map(match => match.id);
    let arrOfDeliveriesOf2015 = deliveries.filter(x => arrOfInningsOf2015.includes(x['match_id']));
    let listOfBowlers = [...new Set(arrOfDeliveriesOf2015.map(x => x.bowler))];
    let noOfOversPerBowler = {};
    for (let i = 0; i < arrOfDeliveriesOf2015.length; i++) {
        let eachBowlerOvers = [];
        let setOfOvers = new Set();  
        let economyRate;
        if (noOfOversPerBowler.hasOwnProperty('bowler')) {
            i++;
        } else {
        eachBowlerOvers = arrOfDeliveriesOf2015.filter(x => x['bowler'] == arrOfDeliveriesOf2015[i]['bowler']);
        setOfOvers.add(eachBowlerOvers.map(x => x['over']));
        let totalRuns = eachBowlerOvers.map(x => Number(x['total_runs']))
        .reduce((a, b) => a + b, 0);
        economyRate = (totalRuns / (setOfOvers.size * 6)).toFixed(2);
        } noOfOversPerBowler[arrOfDeliveriesOf2015[i]['bowler']] = economyRate;
        }
    const sortable = Object.entries(noOfOversPerBowler)
    .sort(([,a],[,b]) => a-b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    return Object.keys(sortable).slice(0,10);
}

//Find the number of times each team won the toss and also won the match

function numberOfTimesWonTossAndMatch(matches) {
    return matches.reduce((numberOfTimesWonToss, match) => {
        const winner = match['toss_winner'];
        if (numberOfTimesWonToss.hasOwnProperty(winner) && winner == match.winner) {
            numberOfTimesWonToss[winner] += 1;
        } else if ((!numberOfTimesWonToss.hasOwnProperty(winner)) && winner == match.winner) {
            numberOfTimesWonToss[winner] = 1;
        } return numberOfTimesWonToss;
    }, {});
}

//Find a player who has won the highest number of Player of the Match awards for each season

function playerOfMatchInEachSeason(matches) {
    let playerOfMatchInEachSeason = {}; 
    let match;
    for (let i = 0; i < matches.length; i++) {
        match = matches.filter(x => x['season'] == matches[i]['season']);
        playerOfMatchInEachSeason[matches[i]['season']] = playerOfSeason(match);
    } 
    return playerOfMatchInEachSeason;
}

function playerOfSeason(match) {
    let count = 0;
    let obj = {};
    for (let i = 0; i < match.length; i++) {
        count = match.filter(x => x['player_of_match'] == match[i]['player_of_match']).length;
        obj[match[i]['player_of_match']] = count;
    } 
    const sortable = Object.entries(obj)
    .sort(([,a],[,b]) => b - a);
    return sortable[0][0];    
}

//Find the strike rate of a batsman for each season

function strikeRateOfABatsman(matches, deliveries) {
    let strikeRateOfABatsman = []; //batsman : {season: strike rate}
    let setOfBatsman = new Set(deliveries.map(x => x.batsman));
    let arrOfBatsman = Array.from(setOfBatsman)
    let delivery, deliveryPerMatchId, strikeRate;
    for (let i = 0; i < arrOfBatsman.length; i++) {
        let obj = {};
        let objBatsman = {};
        delivery = deliveries.filter(x => x['batsman'] == arrOfBatsman[i]);
        for (let j = 0; j < delivery.length; j++) {
            deliveryPerMatchId = delivery.filter(x => x['match_id'] == delivery[j]['match_id']);
            let id = delivery[j]['match_id'];
            let noOfBalls = deliveryPerMatchId.length;
            let totalRuns = deliveryPerMatchId.map(x => Number(x['total_runs']))
            .reduce((a, b) => a + b, 0);
            strikeRate = ((totalRuns/noOfBalls) * 100).toFixed(2);
            let season;
            for (let m = 0; m < matches.length; m++) {
                if (id == matches[m]['id']) {
                    season = matches[m]['season'];
                }
            } obj[season] = strikeRate;
            objBatsman[delivery[j]['batsman']] = obj
        } 
        strikeRateOfABatsman.push(objBatsman);  
    } return strikeRateOfABatsman;
}

// Find the highest number of times one player has been dismissed by another player

function highestCountOfPlayerDismissal(deliveries) {
    let deliveriesWithDismissal = deliveries.filter(x => x['player_dismissed'] != '');
    let setOfPlayerDismissed = new Set(deliveriesWithDismissal.map(x => x['player_dismissed']));
    let arrOfPlayerDismissed = Array.from(setOfPlayerDismissed);
    let countOfPlayerDismissed = {};
    for (let i = 0; i < arrOfPlayerDismissed.length; i++) {
        let eachPlayerDismissed = deliveriesWithDismissal.filter(x => x['player_dismissed'] == arrOfPlayerDismissed[i]);
        countOfPlayerDismissed[arrOfPlayerDismissed[i]] = eachPlayerDismissed.reduce((bowlerCount, delivery) => {
            let bowler = delivery.bowler;
            if (bowlerCount.hasOwnProperty(bowler)) {
                bowlerCount[bowler] += 1;
            } else {
                bowlerCount[bowler] = 1; 
            } return bowlerCount;
        }, {});
    } return countOfPlayerDismissed;
}

// Find the bowler with the best economy in super overs

function bestEconomyInSuperOvers(matches, deliveries) {
    let deliveriesWithSuperOver = deliveries.filter (x => Number(x['is_super_over']) != 0);
    let setOfSuperOverBowler = new Set(deliveriesWithSuperOver.map(x => x['bowler']));
    let superOverBowler = Array.from(setOfSuperOverBowler);
    let noOfOversPerBowler = {};
    for (let i = 0; i < deliveriesWithSuperOver.length; i++) {
        let eachBowlerOvers = [];
        let setOfOvers = new Set();  
        let economyRate;
        if (!noOfOversPerBowler.hasOwnProperty('bowler')) {
            eachBowlerOvers = deliveriesWithSuperOver.filter(x => x['bowler'] == deliveriesWithSuperOver[i]['bowler']);
            setOfOvers.add(eachBowlerOvers.map(x => x['over']));
            let totalRuns = eachBowlerOvers.map(x => Number(x['total_runs']))
            .reduce((a, b) => a + b, 0);
            economyRate = (totalRuns / (setOfOvers.size * 6)).toFixed(2);
        } noOfOversPerBowler[deliveriesWithSuperOver[i]['bowler']] = economyRate;
        }
    const sortable = Object.entries(noOfOversPerBowler)
    .sort(([,a],[,b]) => a-b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
    return Object.keys(sortable)[0];

}


CSVtoJSON().fromFile("./src/data/matches.csv").then(matches => {
    // console.log(matches);
    // console.log(matchesPerSeason(matches));
    // console.log(matchesWonPerTeamPerYear(matches));
    // console.log(getMatchesPlayedPerYear(matches));
    // console.log(numberOfTimesWonTossAndMatch(matches));
    // console.log(playerOfMatchInEachSeason(matches));
    
    CSVtoJSON().fromFile("./src/data/deliveries.csv").then(deliveries => {
        // console.log(deliveries);
        // console.log(matches);
        // console.log(runsConcededPerTeamIn2016(matches, deliveries));
        // console.log(topTenEconomicalBowlersIn2015(matches, deliveries));
        // console.log(strikeRateOfABatsman(matches, deliveries));
        // console.log(matchID(matches));
        // console.log(bestEconomyInSuperOvers(matches, deliveries));
        // console.log(highestCountOfPlayerDismissal(deliveries));

    });
});


