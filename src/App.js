import "leaflet/dist/leaflet.css";
import React from "react";
import classes from "./App.module.css";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerImage from "./marker.png";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

const App = () => {
  const [coordintes, setCoordinated] = React.useState([
    6.923744541420248, 79.86141202924618,
  ]);
  const [map, setMap] = React.useState(null);
  const markerRef = React.useRef(null);
  const [address, setAddress] = React.useState("");
  const [formattedAddress, setFomattedAddress] = React.useState("");
  const [markerPos, setMarkerPos] = React.useState([
    6.923744541420248, 79.86141202924618,
  ]);

  const markerIcon = Leaflet.icon({
    iconUrl: markerImage,
    iconSize: [50, 50],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setMarkerPos([marker.getLatLng().lat, marker.getLatLng().lng]);
        }
      },
    }),
    []
  );

  return (
    <div className={classes.ParentContainer}>
      <PlacesAutocomplete
        value={address}
        onChange={(value) => setAddress(value)}
        onSelect={(value) => {
          geocodeByAddress(value)
            .then((results) => {
              setFomattedAddress(results[0].formatted_address);
              return getLatLng(results[0]);
            })
            .then((latLng) => {
              setCoordinated([latLng.lat, latLng.lng]);
              map.flyTo(latLng, 15);
            })
            .catch((error) => console.error("Error", error));
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes.AutoComplete}>
            <p className={classes.Address}>{formattedAddress}</p>
            <p className={classes.LatLng}>
              Lat - {markerPos[0]} | Lng - {markerPos[1]}
            </p>
            <input
              {...getInputProps({
                placeholder: "Search...",
                className: classes.Input,
              })}
            />
            <div className={classes.DropDownContainer}>
              {suggestions.map((suggestion, index) => {
                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, {
                      className: classes.DropDownItem,
                    })}
                  >
                    <span className={classes.DropDownItemText}>
                      {suggestion.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <MapContainer
        className={classes.Map}
        center={coordintes}
        zoom={12}
        scrollWheelZoom={false}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={coordintes}
          icon={markerIcon}
          draggable
          ref={markerRef}
          eventHandlers={eventHandlers}
        >
          <Popup>
            Lat - {markerPos[0]}
            <br />
            Lng - {markerPos[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default App;
