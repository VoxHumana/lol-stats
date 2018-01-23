import React from 'react';

export default function SummonerSpells(props) {
  return (
    <div
      className="summoners"
    >
      {props.spells[0]}
      <br />
      {props.spells[1]}
    </div>);
}
