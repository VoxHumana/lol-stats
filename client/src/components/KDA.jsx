import React from 'react';
import PropTypes from 'prop-types';

export default function KDA(props) {
  return (
    <div
      className="kda text-center"
    >
      <div>
        <span>K / D / A</span>
      </div>
      <div>
        <span className="kills"> {props.kills} </span>
        <span>/</span>
        <span className="deaths"> {props.deaths} </span>
        <span>/</span>
        <span className="assists"> {props.assists} </span>
      </div>
    </div>);
}

KDA.propTypes = {
  kills: PropTypes.number,
  deaths: PropTypes.number,
  assists: PropTypes.number,
};

KDA.defaultProps = {
  kills: -1,
  deaths: -1,
  assists: -1,
};
