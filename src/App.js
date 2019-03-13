import React, { Component } from 'react';
import './App.css';

import Map from './Components/Map';


const CustomButton = ({label, onClick, id}) => {
  return (
    <button
      onClick={()=> onClick(id)}
      style={{padding: '25px', backgroundColor: 'red', color: '#fff', margin: '30px', cursor: 'pointer'}}
    >{label}</button>
  )
}

class App extends Component {
  state = {
    showMap : false,
    activeDist: '',
    dist1: '',
    dist2: '' ,
    dehliLat : 28.644800,
    dehliLng: 77.216721,
    dehliRad: 150, // taken as assemption...
    lat1: 0,
    lng1: 0,
    lat2: 0,
    lng2: 0,
    distance: ''
  }

  showMapHandler = id => {
    this.setState({showMap: true, activeDist: id})
  }



  saveLatLngHandler = ({lat, lng}) => {
    const { activeDist, dehliLat, dehliLng } = this.state;

    if (activeDist == 'dist1') {
      this.setState({lat1: lat, lng1: lng}, () => {this.checkLatLngValidation(dehliLat, dehliLng, lat, lng)});
    }else {
      this.setState({lat2: lat, lng2: lng}, () => this.checkLatLngValidation(dehliLat, dehliLng, lat, lng));
    }
  }


  // Thsi algo I copied from google .... 
  checkLatLngValidation = (lat1, lon1, lat2, lon2, unit='M') => {

    const { dehliRad, activeDist } = this.state;
    
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }

        console.log('CALCULATED DISTANCE :::', dist)
        if (dist > dehliRad) {
            alert('You choosed outside dehli. Please choose again  ')
            if (activeDist == 'dist1') {
              this.setState({lat1: '', lng1: ''});
            }else {
              this.setState({lat2: '', lng2: ''});
            }
        }else {
          this.setState({distance: dist, [activeDist]: true, showMap: false})
        }

        return dist;
    }
  }

  calculateFairHandler = () => {
    const { lat1, lng1, lat2, lng2 } = this.state;

    console.log(this.state);

    var distance = this.checkLatLngValidation(lat1, lng1, lat2, lng2);
    alert(`Total fair (100 Rs / Mile ) = ${distance * 100}`)
    

    // if (!lat1 && !lng1 && lat2 && lng2) {
    //   var distance = this.checkLatLngValidation(lat1, lng1, lat2, lng2);
    //   alert(`Total fair 100 = ${distance * 100}`)
    // } else {
    //   alert('Pleae choose the distances..!')
    // }
  }
  

  render() {
    return (
      <div className="App">
        <h2>Choose location around Dehli</h2>
        <div style={{minHeight:'90vh', display:'flex', justifyContent: 'center', alignItems: 'center'}}>
        { this.state.showMap ? <Map saveData={this.saveLatLngHandler}/> : null }
          <CustomButton label={this.state.dist1 ? "Choosed" : "Choose Location A"} onClick={this.showMapHandler} id='dist1'/>
          <CustomButton label={this.state.dist2 ? "Choosed" : "Choose Location B"} onClick={this.showMapHandler} id='dist2'/>
          <CustomButton label="Show fair" onClick={this.calculateFairHandler} />
        </div>
      </div>
    );
  }
}

export default App;
