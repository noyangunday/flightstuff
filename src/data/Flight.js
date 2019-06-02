import React from 'react';

class Flight {

  static config = {
    id: "Flight",
    name: "Flights",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/White_Globe_Icon.png/1200px-White_Globe_Icon.png",
    model: {
      endpoint: "https://infinite-dawn-93085.herokuapp.com/flights",
      dataPath: "data.data",
      sizePath: "data.pagination.total",
      proto: [
        "id",
        "readable_departure",
        "readable_arrival",
        "origin",
        "destination"
      ],
      filter: "origin"
    },
    layout: function() {
      return (
        <div>
            <div className="FlightName"> {this.id} </div>
            <div className="FlightDetails">
            <div className="FlightFrom"> {this.origin}<br/>{this.readable_departure} </div>
            <div className="FlightTo"> {this.destination}<br/>{this.readable_arrival} </div>
            </div>
        </div>
      );
    }
  };

}

export default Flight;
