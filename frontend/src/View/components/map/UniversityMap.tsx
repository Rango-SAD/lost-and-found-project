import React from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SHARIF_CENTER, OUTER_WORLD, SHARIF_BOUNDARY, BUILDINGS } from './mapData';


const emptyIcon = new L.Icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  iconSize: [1, 1],
});

const UniversityMap: React.FC = () => {
  return (
    <MapContainer
      center={SHARIF_CENTER as [number, number]}
      zoom={17}
      zoomControl={false}
      attributionControl={false}
      style={{ height: '100%', width: '100%', background: 'transparent' }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

      <Polygon
        positions={[OUTER_WORLD as any, SHARIF_BOUNDARY as any]}
        pathOptions={{ fillColor: "#020617", fillOpacity: 0.9, weight: 0 }}
      />

      <Polygon
        positions={SHARIF_BOUNDARY as any}
        pathOptions={{ color: '#3b82f6', fillColor: 'transparent', weight: 2.5 }}
      />

      {BUILDINGS.map((building, index) => (
        <Marker 
          key={index} 
          position={building.pos as [number, number]} 
          icon={emptyIcon}
        >
          <Tooltip permanent direction="center" className="neon-label">
            {building.name}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default UniversityMap;