import React from 'react';
import './matchcard.css'

const MatchCard = ({ match }) => {
  return (
    <div className="match-card">
      <strong>Name:</strong>{match.name} <br />
      <strong>Age:</strong> {match.age} <br />
      <strong>MSISDN:</strong> {match.msisdn}<br />
      
    </div>
  );
}

export default MatchCard;
