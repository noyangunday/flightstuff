import React from 'react';

class Aircraft {

  static config = {
    id: "Aircraft",
    name: "Aircrafts",
    logoUrl: "https://domotexusa.com/wp-content/uploads/2017/12/DOMOTEX-USA19-icon-plane-white.png",
    model: {
      endpoint: "https://infinite-dawn-93085.herokuapp.com/aircrafts",
      dataPath: "data.data",
      sizePath: "data.pagination.total",
      proto: [
        "ident",
        "type"
      ],
    },
    layout: function() {
      return (
        <div>
            <div className="AircraftName"> {[this.ident, " (", this.type, ")"].join("")} </div>
        </div>
      );
    }
  };

}

export default Aircraft;
