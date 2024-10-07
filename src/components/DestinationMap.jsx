import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DestinationMap = ({ destinations }) => {
  return (
    <div className="destination-map">
      <h2>Your Saved Destinations</h2>
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {destinations.map((destination) => (
          <Marker key={destination.id} position={[destination.latitude, destination.longitude]}>
            <Popup>{destination.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DestinationMap;
