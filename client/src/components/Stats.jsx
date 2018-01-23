import React from 'react';
import PropTypes from 'prop-types';

export default function Stats(props) {
  return (
    <div className="stats text-center">
      <div className="level">
        <div className="sprite" />
        <span>{props.level}</span>
      </div>
      <div className="creep-score">
        <div className="sprite" />
        <span>{props.cs}<br />({(props.cs / props.duration).toFixed(2)})</span>
      </div>
      <div className="gold">
        <div className="sprite" />
        <span>{props.gold}<br />({(props.gold / props.duration).toFixed(2)})</span>
      </div>
    </div>);
}

Stats.propTypes = {
  level: PropTypes.number,
  cs: PropTypes.number,
  gold: PropTypes.number,
  duration: PropTypes.number,
};

Stats.defaultProps = {
  level: -1,
  cs: -1,
  gold: -1,
  duration: -1,
};
