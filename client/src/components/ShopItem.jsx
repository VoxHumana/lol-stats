import React from 'react';
import PropTypes from 'prop-types';

export default class ShopItem extends React.Component {
  constructor(props) {
    super(props);
    this.itemImgUri = `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/item/${props.itemImgSrc}`;
  }

  render() {
    return (<img src={this.itemImgUri} className="shop-item rounded" alt="Shop Item" />
    );
  }
}

ShopItem.propTypes = {
  itemImgSrc: PropTypes.string,
};

ShopItem.defaultProps = {
  itemImgSrc: 'Empty Item',
};
