import React from 'react';

export default function Trinket(props) {
  return (<img
    src={`http://ddragon.leagueoflegends.com/cdn/8.1.1/img/item/${props.trinket.image}`}
    className="trinket rounded"
    alt={props.trinket.name}
  />);
}
