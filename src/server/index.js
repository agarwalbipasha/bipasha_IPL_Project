const CSVtoJSON = require("csvtojson");
var ipl = require('./ipl');


// Find the highest number of times one player has been dismissed by another player

function highestCountOfPlayerDismissal(deliveries) {
  let deliveriesWithDismissal = deliveries.filter(
    (x) => x["player_dismissed"] != ""
  );
  let setOfPlayerDismissed = new Set(
    deliveriesWithDismissal.map((x) => x["player_dismissed"])
  );
  let arrOfPlayerDismissed = Array.from(setOfPlayerDismissed);
  let countOfPlayerDismissed = {};
  for (let i = 0; i < arrOfPlayerDismissed.length; i++) {
    let eachPlayerDismissed = deliveriesWithDismissal.filter(
      (x) => x["player_dismissed"] == arrOfPlayerDismissed[i]
    );
    countOfPlayerDismissed[arrOfPlayerDismissed[i]] =
      eachPlayerDismissed.reduce((bowlerCount, delivery) => {
        let bowler = delivery.bowler;
        if (bowlerCount.hasOwnProperty(bowler)) {
          bowlerCount[bowler] += 1;
        } else {
          bowlerCount[bowler] = 1;
        }
        return bowlerCount;
      }, {});
  }
  return countOfPlayerDismissed;
}

// Find the bowler with the best economy in super overs

function bestEconomyInSuperOvers(matches, deliveries) {
  let deliveriesWithSuperOver = deliveries.filter(
    (x) => Number(x["is_super_over"]) != 0
  );
  let setOfSuperOverBowler = new Set(
    deliveriesWithSuperOver.map((x) => x["bowler"])
  );
  let superOverBowler = Array.from(setOfSuperOverBowler);
  let noOfOversPerBowler = {};
  for (let i = 0; i < deliveriesWithSuperOver.length; i++) {
    let eachBowlerOvers = [];
    let setOfOvers = new Set();
    let economyRate;
    if (!noOfOversPerBowler.hasOwnProperty("bowler")) {
      eachBowlerOvers = deliveriesWithSuperOver.filter(
        (x) => x["bowler"] == deliveriesWithSuperOver[i]["bowler"]
      );
      setOfOvers.add(eachBowlerOvers.map((x) => x["over"]));
      let totalRuns = eachBowlerOvers
        .map((x) => Number(x["total_runs"]))
        .reduce((a, b) => a + b, 0);
      economyRate = (totalRuns / (setOfOvers.size * 6)).toFixed(2);
    }
    noOfOversPerBowler[deliveriesWithSuperOver[i]["bowler"]] = economyRate;
  }
  const sortable = Object.entries(noOfOversPerBowler)
    .sort(([, a], [, b]) => a - b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  return Object.keys(sortable)[0];
}

CSVtoJSON()
  .fromFile("./src/data/matches.csv")
  .then((matches) => {
    // console.log(matches);
    // console.log(matchesPerSeason(matches));
    // console.log(ipl.matchesWonPerTeamPerYear(matches));
    // console.log(ipl.getMatchesPlayedPerYear(matches));
    // console.log(ipl.numberOfTimesWonTossAndMatch(matches));
    // console.log(ipl.playerOfMatchInEachSeason(matches));
    // console.log(ipl.getMatchesPlayedInAYear(matches, 2015));
    // console.log(ipl.arrayOfYears(matches));

    CSVtoJSON()
      .fromFile("./src/data/deliveries.csv")
      .then((deliveries) => {
        // console.log(deliveries);
        // console.log(matches);
        // console.log(ipl.runsConcededPerTeam(matches, deliveries, 2016));
        // console.log(ipl.topTenEconomicalBowlers(matches, deliveries, 2015));
        console.log(ipl.strikeRateOfABatsman(matches, deliveries));
        // console.log(matchID(matches));
        // console.log(bestEconomyInSuperOvers(matches, deliveries));
        // console.log(highestCountOfPlayerDismissal(deliveries));
        // console.log(ipl.getMatchIDOfSeason(matches, deliveries, 2015));
      });
  });
