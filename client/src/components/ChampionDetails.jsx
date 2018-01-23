import React from 'react';
import PropTypes from 'prop-types';

export default function ChampionDetails(props) {
  const championImgUri = `http://ddragon.leagueoflegends.com/cdn/8.1.1/img/champion/${props.championImgSrc}`;
  return (
    <div
      className="champion-details"
    >
      <div
        className="champion-img-container text-center"
      >
        <img className="rounded" src={championImgUri} alt="Champion" />
        <span>{props.championName}</span>
      </div>
      {props.children}
    </div>);
}

ChampionDetails.propTypes = {
  championImgSrc: PropTypes.string,
  championName: PropTypes.string,
};

ChampionDetails.defaultProps = {
  championImgSrc: null,
  championName: 'Unnamed',
};
