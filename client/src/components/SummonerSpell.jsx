import React from 'react';
import PropTypes from 'prop-types';

export default class SummonerSpell extends React.Component {
  constructor(props) {
    super(props);
    this.spellImgUri = `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/spell/${props.summonerSpellImgSrc}`;
  }

  render() {
    return (
      <img
        src={this.spellImgUri}
        className="summoner-spells rounded"
        alt="Summoner spell"
      />);
  }
}

SummonerSpell.propTypes = {
  summonerSpellImgSrc: PropTypes.string,
};

SummonerSpell.defaultProps = {
  summonerSpellImgSrc: 'http://cdn3-www.cattime.com/assets/uploads/2012/05/socializing-kitten-300x200.jpg',
};
