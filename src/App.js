import React, { Component } from 'react';
import './App.css';

import Map from './Components/Map';

class App extends Component {
  state = {}

  render() {
    return (
      <div className="App">
        <h3>Choose location around Dehli</h3>
        <Map saveData={this.saveLatLngHandler}/>
      </div>
    );
  }
}

export default App;
