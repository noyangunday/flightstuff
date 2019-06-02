import React from 'react';
import './DatePicker.css';

class DatePicker extends React.Component {
  render() {
    return (
      <div className="DatePicker">
        <div className="NavButton" id={this.props.canGoBack ? "NavButtonLeft" : "NavButtonLeftDisabled"} onClick={() => { this.props.canGoBack && this.props.dateChangeCb(-1) }}> {"<"} </div>
        {this.props.date}
        <div className="NavButton" id="NavButtonRight" onClick={() => { this.props.dateChangeCb(1) }}> {">"} </div>
      </div>
    );
  }
}

export default DatePicker;
