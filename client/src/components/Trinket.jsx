import React from 'react';
import PropTypes from 'prop-types';

export default class Trinket extends React.Component {
  constructor(props) {
    super(props);
    this.trinketImgUri = `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/item/${props.trinketImgSrc}`;
  }

  render() {
    return (<img src={this.trinketImgUri} className="trinket rounded" alt="Trinket" />);
  }
}

Trinket.propTypes = {
  trinketImgSrc: PropTypes.string,
};

Trinket.defaultProps = {
  trinketImgSrc: 'Empty Trinket',
};
