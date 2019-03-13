import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import SweetAlert from 'react-bootstrap-sweetalert';

import { calculatePoints } from '../../Utils/CalculatePoints';

var markers = []
const AnyReactComponent = ({ text }) => <div style={{color:'red', fontSize:25, padding: '20px'}}>{text}</div>;
 
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 28.644800,
      lng: 77.216721
    },
    zoom: 11
  };

  state = {
    centeredLat : 28.644800,  // center points of dehli ....
    centeredLng: 77.216721,
    boundRadius: 150, // taken as asseption ...
    choosedPoints: [],
    showAlert: false,
    alertMsg: ''
  }

  renderMarkers = ({map, maps}) => {

        maps.event.addListener(map, 'click', function(event) {
            Marker(event.latLng)
        });

         function Marker(location) {
            let marker = new maps.Marker({
                position: location, 
                map: map
            });

            markers.push(marker)
         }

  }

  saveLatLngHandler = ({ lat, lng, event }) => {
    console.log("EVENT ::", event.trigger)
    const { centeredLat, centeredLng, choosedPoints, boundRadius } = this.state;

    const distance = calculatePoints(centeredLat, centeredLng, lat, lng);

    if (distance > boundRadius) {
        alert("Please choose inside Dehli!");
        // here you have to remove marker

        return 
    }

    choosedPoints.push({lat, lng });
    this.setState({choosedPoints}, () => {
        const { choosedPoints } = this.state;
        
        if (choosedPoints.length === 2) {
            let point1, point2;

            [point1, point2] = choosedPoints;
            let distance = calculatePoints(point1.lat, point1.lng, point2.lat, point2.lng);

            console.log(`Total Fair (100 Rs/Mile) : ${Math.round(distance * 100)}`);
            // here you have to remove marker
            this.setState({
                showAlert: true, 
                alertMsg: `Total Fair (100 Rs/Mile) : ${Math.round(distance * 100)}`,
                choosedPoints: []
            })
        }
    });
  }

  hideAlert = () => this.setState({showAlert: false});

 
  render() {
      const { showAlert, alertMsg } = this.state;

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '90vh', width: '100%' }}>
        {
            showAlert ? 
            <SweetAlert success title="Message!" onConfirm={this.hideAlert}>
                {alertMsg}
            </SweetAlert>:
            null
        }
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCk7brNem_4InuHQVOC83JRCINeTGCbsR8' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onClick={this.saveLatLngHandler}
          onGoogleApiLoaded={this.renderMarkers}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default SimpleMap;