import React from 'react';
import './AircraftDetails.css';

class AircraftDetails extends React.Component {

    calculateUtilisation() {
        return Math.trunc((this.props.rotation.reduce((total, current) => {
            return total + (current.arrivaltime - current.departuretime);
        }, 0) / 86400) * 100);

    }

    render() {
        let title = this.props.aircraft ? ["Rotation for ", this.props.aircraft.ident].join("") : "No Aircraft Selected.",
            details = this.props.aircraft ? ["Type: ", this.props.aircraft.type, " (", this.props.aircraft.economySeats, " seats) | Base Airport: ", this.props.aircraft.base].join("") : "",
            utilisation = this.props.aircraft ? ["Current utilisation: ", this.calculateUtilisation(), "%"].join("") : "";
        return (
            <div className="AircraftDetails">
                {title} <br /> {details} <br /> {utilisation}
            </div>
        );
    }
}

export default AircraftDetails;
