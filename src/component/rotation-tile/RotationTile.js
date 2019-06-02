import React from 'react';
import './RotationTile.css';
import '../../data/Flight.css';

class RotationTile extends React.Component {
    render() {
      
      return (
        <div className="RotationTile" onClick={() => {this.props.selectCb && this.props.selectCb()}}>
            <div className="RotationFlightName"> {["Flight:", this.props.flight.id].join(" ")} </div>
            <div className="RotationFlightDetails">
                <div className="FlightFrom"> {this.props.flight.origin}<br/>{this.props.flight.readable_departure} </div>
                <div className="FlightTo"> {this.props.flight.destination}<br/>{this.props.flight.readable_arrival} </div>
            </div>
        </div>
      );
    }
  }

  export default RotationTile;
