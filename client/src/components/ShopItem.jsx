import React from 'react';

export default function ShopItem(props) {
  return (<img
    src={`http://ddragon.leagueoflegends.com/cdn/8.1.1/img/item/${props.item.image}`}
    className="shop-item rounded"
    alt={props.item.name}
  />
  );
}
