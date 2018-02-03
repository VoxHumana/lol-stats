import React from 'react';
import SummonerSpell from './SummonerSpell';

export default function SummonerSpells(props) {
  return (
    <div
      className="summoners"
    >
      <SummonerSpell summonerSpell={props.spells[0]} />
      <br />
      <SummonerSpell summonerSpell={props.spells[1]} />
    </div>);
}
