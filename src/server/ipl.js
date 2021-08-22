module.exports = {
  getMatchesPlayedPerYear: getMatchesPlayedPerYear,
  getMatchIDOfSeason: getMatchIDOfSeason,
  getMatchesPlayedInAYear: getMatchesPlayedInAYear,
  arrayOfYears: arrayOfYears,
  matchesWonPerTeamPerYear: matchesWonPerTeamPerYear,
  runsConcededPerTeam: runsConcededPerTeam,
  topTenEconomicalBowlers: topTenEconomicalBowlers,
};

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

// To get match ID corresponding to a particular season

function getMatchIDOfSeason(matches, deliveries, year) {
  let setOfYears = new Set(matches.map((match) => match.season));
  let arrOfYears = Array.from(setOfYears).sort((a, b) => a - b);
  let arrOfYear = matches
    .filter((x) => x["season"] == year)
    .map((match) => match.id);
  let arrOfDeliveriesOfYear = deliveries.filter((x) =>
    arrOfYear.includes(x["match_id"])
  );
  return arrOfDeliveriesOfYear;
}

//To get matches played in each season

function getMatchesPlayedInAYear(matches, year) {
  let setOfYears = new Set(matches.map((match) => match.season));
  let arrOfYears = Array.from(setOfYears).sort((a, b) => a - b);
  return matches.filter((x) => (x["season"] = year));
}

//To get array of years

function arrayOfYears(matches) {
  let setOfYears = new Set(matches.map((match) => match.season));
  let arrOfYears = Array.from(setOfYears).sort((a, b) => a - b);
  return arrOfYears;
}

//Number of matches won per team per year in IPL.

function matchesWonPerTeamPerYear(matches) {
  let years = arrayOfYears(matches);
  let matchWon = {};
  for (let i = 0; i < years.length; i++) {
    let year = years[i];
    let match = getMatchesPlayedInAYear(matches, year);
    matchWon[year] = {};
    match.reduce((matchW, m) => {
      const win = m.winner;
      if (matchWon[year].hasOwnProperty(win)) {
        matchWon[year][win] += 1;
      } else {
        matchWon[year][win] = 1;
      }
    }, {});
  }
  return matchWon;
}

//Extra runs conceded per team in the year 2016

function runsConcededPerTeam(matches, deliveries, year) {
  let runsConcededPerTeam = {};
  let arrOfDeliveriesOfYear = getMatchIDOfSeason(matches, deliveries, year);
  for (let i = 0; i < arrOfDeliveriesOfYear.length; i++) {
    let eachMatchIDRuns = arrOfDeliveriesOfYear.filter(
      (x) => x["match_id"] == arrOfDeliveriesOfYear[i]["match_id"]
    );
    let totalRuns = eachMatchIDRuns
      .map((run) => parseInt(run["extra_runs"]))
      .reduce((a, b) => a + b, 0);
    runsConcededPerTeam[arrOfDeliveriesOfYear[i]["batting_team"]] = totalRuns;
  }
  return runsConcededPerTeam;
}

// Top 10 economical bowlers in the year 2015

function topTenEconomicalBowlers(matches, deliveries, year) {
  let arrOfDeliveriesOfYear = getMatchIDOfSeason(matches, deliveries, year);
  let listOfBowlers = [...new Set(arrOfDeliveriesOfYear.map((x) => x.bowler))];
  let noOfOversPerBowler = {};
  for (let i = 0; i < arrOfDeliveriesOfYear.length; i++) {
    let eachBowlerOvers = [];
    let setOfOvers = new Set();
    let economyRate;
    if (noOfOversPerBowler.hasOwnProperty("bowler")) {
      i++;
    } else {
      eachBowlerOvers = arrOfDeliveriesOfYear.filter(
        (x) => x["bowler"] == arrOfDeliveriesOfYear[i]["bowler"]
      );
      setOfOvers.add(eachBowlerOvers.map((x) => x["over"]));
      let totalRuns = eachBowlerOvers
        .map((x) => Number(x["total_runs"]))
        .reduce((a, b) => a + b, 0);
      economyRate = (totalRuns / (setOfOvers.size * 6)).toFixed(2);
    }
    noOfOversPerBowler[arrOfDeliveriesOfYear[i]["bowler"]] = economyRate;
  }
  const sortable = Object.entries(noOfOversPerBowler)
    .sort(([, a], [, b]) => a - b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  return Object.keys(sortable).slice(0, 10);
}
