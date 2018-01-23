import React from 'react';

export default function ChampionBuild(props) {
  return (
    <div className="champion-build text-center">
      <div className="shop-item-container">
        {props.items[0]}
        {props.items[1]}
        {props.items[2]}
        <br />
        {props.items[3]}
        {props.items[4]}
        {props.items[5]}
      </div>
      <div className="trinket-container">
        {props.trinket}
      </div>
    </div>);
}
