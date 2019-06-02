import React from 'react';
import Tile from '../tile/Tile';
import Loader from '../loader/Loader';
import Utils from '../../utils/Utils';
import Axios from 'axios';

import "./Panel.css"

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchStatus: 0, //0 - ready, 1 - fetching, 2 - error
      offset: 0,
      data: [],
      filter: ""
    }
  }

  componentDidMount() {
    // Do the initial fetch
    this.fetch();
  }

  fetch() {
    // Design Notes: limit and fetch logic should be part of unit tests
    let limit = 10;
    if (this.state.total !== undefined) {
      limit = Math.min(this.state.total - this.state.offset, 10);
    }
    if(limit > 0 && this.state.fetchStatus !== 1) {
      this.setState({fetchStatus: 1});
      Axios.get([this.props.tile.model.endpoint, "?offset=", this.state.offset, "&limit=", limit].join(""))
      .then((response) => {
        this.setState({
          data: this.state.data.concat(Utils.getProperty(response, this.props.tile.model.dataPath)),
          fetchStatus: 0,
          offset: this.state.offset + 10,
          total: Utils.getProperty(response, this.props.tile.model.sizePath)
        })
      })
      .catch((error) => {
        this.setState({
          fetchStatus: 2,
          errorCode: error
        })
      });
    }
  }

  onTileSelected(item) {
    if (this.props.selectCb) {
      this.props.selectCb(item);
    }
  }

  renderTiles() {
    let data = this.state.data;
    if (this.state.filter.length > 0) {
      // Design notes: filtering should ideally be handled by the endpoint with proper pagination
      data = data.filter((value) => {
        return value[this.props.tile.model.filter].includes(this.state.filter);
      });
    }
    
    return data.map((item, i) => { 
        let props = {};
        this.props.tile.model.proto.forEach((field) => {
          props[field] = item[field];
        });
        return (
            <Tile selected={this.props.selectedTile && this.props.selectedTile["ident"] === item["ident"]} key={["Tile", this.props.tile.model.id, i].join("_")} selectCb={this.onTileSelected.bind(this, item)} {...props} layout={this.props.tile.layout}/>
        );
    });
  }

  renderLoadMore() {
    if (((this.state.total && this.state.total - this.state.offset > 0) || (this.state.total === undefined)) && this.state.fetchStatus === 0) {
      return (<div className="LoadMoreButton" onClick={() => {this.fetch()}}> Load More </div>);
    }
  }

  renderFilter() {
    const filter = this.props.tile.model.filter;
    if (filter) {
      const id = ["PanelFilter", this.props.tile.id, filter].join("_");
      return (<div> <input onChange={() => {
          this.setState({filter: document.getElementById(id).value})
        }} id={id} key={id} className="PanelFilter" type="text" placeholder={["Filter by", filter].join(" ")} /> </div>);
    }
  }

  render() {
    return (
      <div className="Panel" style={{float: this.props.alignment}}>
        <div className="PanelHeader">
          <div> 
            <img className="PanelHeaderLogo" src={this.props.tile.logoUrl} alt=""/> 
          </div>
          <div> 
            {[this.props.tile.name, this.state.total ? [" (" + this.state.total + ")"].join("") : ""].join("")} 
          </div>
        </div>
        {this.renderFilter()}
        {this.renderTiles()}
        {this.state.fetchStatus === 1 && (<Loader/>)}
        {this.renderLoadMore()}
      </div>
    );
  }
}

export default Panel;
