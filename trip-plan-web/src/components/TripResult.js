import React from 'react';

const TripResult = ({ result }) => {
    return (
        <div className="trip-result">
            <h2>Your Trip Plan</h2>
            <p><strong>Departure:</strong> {result.departure}</p>
            <p><strong>Destination:</strong> {result.destination}</p>
            <p><strong>Date:</strong> {result.date}</p>
            <p><strong>Budget:</strong> {result.budget}</p>
            <h3>Schedule:</h3>
            <ul>
                {result.schedule.map((item, index) => (
                    <li key={index}>
                        <strong>{item.time}:</strong> {item.activity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TripResult;