import React from 'react';

export default function SummonerSpells() {
  return (
    <div
      className="summoners"
    >
      {this.props.spell1}
      <br />
      {this.props.spell2}
    </div>);
}
