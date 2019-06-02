import React from 'react';
import './Tile.css';

class Tile extends React.Component {
    render() {
      
      return (
        <div className="Tile" id={this.props.selected ? "SelectedTile" : "Tile"} onClick={()=>{this.props.selectCb();}}>
          {this.props.layout()}
        </div>
      );
    }
  }

  export default Tile;
