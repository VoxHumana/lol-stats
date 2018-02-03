import React from 'react';
import Trinket from './Trinket';
import EmptyItem from './EmptyItem';
import ShopItem from './ShopItem';

export default function ChampionBuild(props) {
  const items = props.items.map(item => (item.name === 'empty' ? <EmptyItem /> : <ShopItem item={item} />));
  return (
    <div className="champion-build text-center">
      <div className="shop-item-container">
        {items[0]}
        {items[1]}
        {items[2]}
        <br />
        {items[3]}
        {items[4]}
        {items[5]}
      </div>
      <div className="trinket-container">
        <Trinket trinket={props.trinket} />
      </div>
    </div>);
}
