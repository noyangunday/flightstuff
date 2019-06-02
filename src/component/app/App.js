import React from 'react';
import Moment from 'moment';
import Panel from '../panel/Panel';
import Flight from '../../data/Flight';
import Aircraft from '../../data/Aircraft';
import DatePicker from '../date-picker/DatePicker';
import AircraftDetails from '../aircraft-details/AircraftDetails'
import RotationTile from '../rotation-tile/RotationTile'
import './App.css';
import '../../data/Flight.css';
import '../../data/Aircraft.css';
import logo from './logo.png';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.data = {
    }
    this.state = {
      date: Moment().startOf('day'),
      rotation: [],
      toast: ""
    };
  }

  currentDateString() {
    const today = Moment().endOf('day');
    const tomorrow = Moment().add(1, 'day').endOf('day');

    if (this.state.date < today) return 'Today';
    if (this.state.date < tomorrow) return 'Tomorrow';
    return this.state.date.format("DD MMM YYYY");
  }

  switchRotation(date) {
    let dateKey = date.valueOf().toString(),
      acKey = this.state.currentAircraft && this.state.currentAircraft.ident;
    return (acKey && this.data[dateKey] && this.data[dateKey][acKey]) ? this.data[dateKey][acKey] : [];
  }

  validateAdd(flight) {
    const secondsInTwentyMind = 1200;
    if (this.state.rotation.length === 0) {
      // NOTE: removing the condition (flight.origin === this.state.currentAircraft.base) for the sake
      // of this assingment as the only aircraft we have in the endpoint is based in "EEGK" and we don't
      // seem to have a flight with that origin in anywhere convenient in the flights list.
      return true;
    } else {
      let destination = this.state.rotation[this.state.rotation.length - 1].destination;
      let time = this.state.rotation[this.state.rotation.length - 1].arrivaltime;
      if (destination !== flight.origin) {
        this.showToast(["New flight's origin should be ", destination, "."].join(""));
        return false;
      } else if ((time + secondsInTwentyMind) > flight.departuretime) {
        this.showToast("The next flight should be at least 20 minutes after the last one.");
        return false;
      } else if (flight.arrivaltime < flight.departuretime) {
        this.showToast("Aircrafts must land by midnight.");
        return false;
      }
      return true;
    }
    // TODO: check if we can find a flight in between a slot where flight(n)'s dest and flight(n+1)'s origin
    // and times match the new flight's origin, dest and time. the design is more like a stack as it is.
  }

  showToast(message) {
    this.setState({
      toast: message
    });
    setTimeout(() => {
      this.setState({
        toast: ""
      });
    }, 3000);
  }

  onDateChanged(direction) {
    let newDate = this.state.date.add(direction, 'day'),
      rotation = this.switchRotation(newDate);
    this.setState({
      currentDate: newDate,
      rotation: rotation
    });
    this.updateUtilisationBar(rotation);
  }

  onAircraftSelected(aircraft) {
    let rotation = this.switchRotation(this.state.date);
    this.setState({
      currentAircraft: aircraft,
      rotation: rotation
    });
    this.updateUtilisationBar(rotation);
  }

  onFlightSelected(flight) {
    if (this.state.currentAircraft) {
      if (this.validateAdd(flight)) {
        let dateKey = this.state.date.valueOf().toString();
        let acKey = this.state.currentAircraft && this.state.currentAircraft.ident;
        // Design note: a bit of cheating here for the sake of this assignment's time limit,
        // TODO: need to replace the this with a redux store
        !this.data[dateKey] && (this.data[dateKey] = {});
        !this.data[dateKey][acKey] && (this.data[dateKey][acKey] = []);
        this.data[dateKey][acKey].push(flight);
        this.setState({
          rotation: this.data[dateKey][acKey]
        });
        this.showToast("Flight added to rotation.");
        this.updateUtilisationBar(this.data[dateKey][acKey]);
      }
    } else {
      this.showToast("Select an aircraft first.");
    }
  }

  onDeleteFlight(flight) {
    var rotation = this.switchRotation(this.state.date);
    if (rotation.length > 0 && rotation[rotation.length - 1].id === flight.id) {
      rotation.pop();
      this.setState({
        rotation: rotation
      });
      this.updateUtilisationBar(rotation);
      this.showToast("Flight removed.");
    } else {
      this.showToast("Removing this flight will lead to an empty flight to the next airport; try removing trailing flights first.");
    }
  }

  updateUtilisationBar(rotation) {
    let canvas = this.refs.canvas;
    if (canvas && canvas.getContext) {
      let ctx = canvas.getContext('2d');
      ctx.fillStyle = "#101010";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      rotation.forEach((flight) => {
        let flightStart = (flight.departuretime / 86400) * canvas.width;
        let flightEnd = (flight.arrivaltime / 86400) * canvas.width;
        let cooldownEnd = ((flight.arrivaltime + 1200) / 86400) * canvas.width;
        ctx.fillStyle = "green";
        ctx.fillRect(flightStart, 0, flightEnd - flightStart, canvas.height);
        ctx.fillStyle = "purple";
        ctx.fillRect(flightEnd, 0, cooldownEnd - flightEnd, canvas.height);
      });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="TopBar">
          <img className="Logo" src={logo} alt="" />
          <div className="Toast">{this.state.toast}</div>
        </div>
        <div className="Main">
          <Panel tile={Flight.config} alignment="right" key="FlightPanel" selectCb={this.onFlightSelected.bind(this)} />
          <Panel tile={Aircraft.config} alignment="left" key="AircraftsPanel" selectCb={this.onAircraftSelected.bind(this)} selectedTile={this.state.currentAircraft} />
          <div className="Editor">
            <DatePicker date={this.currentDateString()} dateChangeCb={this.onDateChanged.bind(this)} canGoBack={this.state.date > Moment().startOf('day')} />
            <AircraftDetails aircraft={this.state.currentAircraft} rotation={this.state.rotation} />
            <canvas className="UtilisationBar" ref="canvas"></canvas>
            {this.state.rotation.map((flight, index) => { return (<RotationTile flight={flight} key={["RotationTile", index].join()} selectCb={this.onDeleteFlight.bind(this, flight)} />) })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
