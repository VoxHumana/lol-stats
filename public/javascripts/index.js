let region = 'na1';

function getMatchTemplate() {
  return $('#match-template')[0].content.cloneNode(true).firstElementChild;
}

function initChampionName(template, name) {
  $(template).find('.champion-img-container > span').text(name);
}

function initChampionImg(template, image) {
  $(template).find('.champion-img-container > img').attr('src', `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/champion/${image}`);
}

function initSummonerSpells(template, spells) {
  $(template).find('.summoners > .spell-one').attr('src', `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/spell/${spells.spell1Id.image}`);
  $(template).find('.summoners > .spell-two').attr('src', `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/spell/${spells.spell2Id.image}`);
}

function initKDA(template, kda) {
  $(template).find('.kda > div > span.kills').text(kda.kills);
  $(template).find('.kda > div > span.deaths').text(kda.deaths);
  $(template).find('.kda > div > span.assists').text(kda.assists);
}

function initStats(template, stats) {
  $(template).find('.stats > .level').text(`Lvl: ${stats.level}`);
  $(template).find('.stats > .creep-score').text(`CS: ${stats.cs} (${(stats.cs / stats.duration).toFixed(2)})`);
  $(template).find('.stats > .gold').text(`Gold: ${stats.gold} (${(stats.gold / stats.duration).toFixed(2)})`);
}

function initItems(template, items) {
  for (const i in items) {
    if (items[i].image === 'empty') {
      continue;
    }
    $(template).find(`.shop-item-container > .${i}`).attr('src', `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/item/${items[i].image}`);
  }
}

function initTrinket(template, trinket) {
  $(template).find('.trinket').attr('src', `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/item/${trinket.image}`);
}

function showErrorAlert() {
  const errorAlert = $('#error-display')[0].content.cloneNode(true).firstChildElement;
  $('#matches-container').append(errorAlert);
}

async function getSummonerMatches(name) {
  try {
    return $.get(`/summoner/${name}?region=${region}`).fail(showErrorAlert);
  } catch (err) {
    console.error(err);
    showErrorAlert();
  }
}

async function onClickSearchSummoner() {
  const container = $('#matches-container');
  container.empty();
  const summonerName = $('#summoner-input-form').val();
  const matches = await getSummonerMatches(summonerName);
  matches.forEach((m) => {
    const template = getMatchTemplate();
    if (m.win) {
      $(template).find('.card').addClass('bg-success');
    } else {
      $(template).find('.card').addClass('bg-danger');
    }

    initChampionName(template, m.champion.name);
    initChampionImg(template, m.champion.image);
    initSummonerSpells(template, m.summonerSpells);
    initKDA(template, { kills: m.kills, deaths: m.deaths, assists: m.assists });
    initStats(template, {
      level: m.level, cs: m.cs, gold: m.gold, duration: m.gameDuration,
    });
    initItems(template, m.items);
    initTrinket(template, m.trinket);
    container.append(template);
  });
}

function selectRegion(e) {
  region = regions[e.target.text.toLowerCase()];
  $('#summoner-region-dropdown').text(e.target.text);
}

$(document).ready(() => {
  $('#summoner-search-button').on('click', onClickSearchSummoner);
  $('.dropdown-item').on('click', selectRegion);
});
