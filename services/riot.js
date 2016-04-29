const BASE = process.env.LOL_BASE
const GLOBAL_BASE = process.env.LOL_GLOBAL
const KEY = process.env.RIOT_API_KEY
const fetch = require('../utils/fetch')
const _ = require('lodash')

function prepUrl (url, region = 'eune', base = BASE, options) {
  base = base.replace('{region}', region)
  return `${base}${url}?api_key=${KEY}${options || ''}`
}

function championById (summoner, id, region) {
  const url = prepUrl(`/v1.2/champion/${id || summoner.match.championId}`, region, GLOBAL_BASE, '&champData=blurb,image')

  return fetch(url)
    .then(data => Object.assign(summoner, { champion: data }))
}

function gameBySummoner (summoner, region) {
  const url = prepUrl(`/v1.3/game/by-summoner/${summoner.id}/recent`, region)

  return fetch(url)
    .then(data => Object.assign(summoner, { match: data.games[0] }))
}

function summonerByIds (team, summoners, region) {
  const url = prepUrl(`/v1.4/summoner/${summoners}`, region)

  if (_.isEmpty(team)) {
    return new Promise(resolve => resolve([{}]))
  }

  return fetch(url)
    .then(data => Object.assign(team, { roster: data }))
}

function summonerByName (summonerName, region) {
  const url = prepUrl(`/v1.4/summoner/by-name/${summonerName}`, region)

  return fetch(url)
}

function summonerStatsSummaryById (summoner, region) {
  const url = prepUrl(`/v1.3/stats/by-summoner/${summoner.id}/summary`, region)

  return fetch(url)
    .then(data => Object.assign(summoner, { stats: data.playerStatSummaries }))
}

function topThreeChampions (summoner, region, platform) {
  const url = prepUrl(`/championmastery/location/${platform}/player/${summoner.id}/topchampions`, null, 'https://eune.api.pvp.net/')

  return fetch(url)
}

function champions (region) {
  const url = prepUrl('/v1.2/champion', region, BASE, '&freeToPlay=true')

  return fetch(url)
}

function teamBySummonerId (summoner, region) {
  const url = prepUrl(`/v2.4/team/by-summoner/${summoner.id}`, region)

  return fetch(url)
    .then(data => Object.assign(summoner, { teams: data[summoner.id] }))
}

function status (region) {
  const url = prepUrl(`/shards/${region.toLowerCase()}`, null, 'http://status.leagueoflegends.com')

  return fetch(url)
}

module.exports = {
  champions: champions,
  championById: championById,
  gameBySummoner: gameBySummoner,
  status: status,
  summonerByIds: summonerByIds,
  summonerByName: summonerByName,
  summonerStatsSummaryById: summonerStatsSummaryById,
  teamBySummonerId: teamBySummonerId,
  topThreeChampions: topThreeChampions
}
