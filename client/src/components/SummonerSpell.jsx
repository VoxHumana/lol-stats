import React from 'react';

export default function SummonerSpell(props) {

  return (
    <img
      src={`http://ddragon.leagueoflegends.com/cdn/8.1.1/img/spell/${props.summonerSpell.image}`}
      className="summoner-spells rounded"
      alt={props.summonerSpell.name}
    />);
}
