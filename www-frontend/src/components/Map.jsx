import React, { useEffect, useState, useRef } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from './useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from './constants';
import { TextField, IconButton, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Modal, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const MAP_CENTER = { lat: -33, lng: -70 };
const DEFAULT_RADIUS = 500000;

// Haversine formula to calculate distance between two coordinates (lat, lng)
const haversineDistance = (coords1, coords2) => {
  const toRad = value => (value * Math.PI) / 180;
  const R = 6371e3; // Radius of Earth in meters
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);
  const deltaLat = toRad(coords2.lat - coords1.lat);
  const deltaLng = toRad(coords2.lng - coords1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const Map = () => {
  const [bars, setBars] = useState([]);
  const [nearbyBars, setNearbyBars] = useState([]);
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const inputRef = useRef();
  const markerCluster = useRef();
  const libraries = useLoadGMapsLibraries(['places']);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/v1/bars');
        const data = await response.json();
        setBars(data.bars || []);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    fetchBars();
  }, []);

  // Initialize map and marker cluster when libraries and bars are ready
  useEffect(() => {
    if (!libraries || bars.length === 0) return;

    const { Map } = libraries[MAPS_LIBRARY];
    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 7,
    });

    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
    const markers = bars.map(bar => {
      const marker = new Marker({
        position: { lat: bar.latitude, lng: bar.longitude },
        title: bar.name,
      });

      marker.addListener('click', () => {
        setSelectedBar(bar);
      });

      return marker;
    });

    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });


    if (libraries['places']) {
      const { Autocomplete } = libraries['places'];
      const autocomplete = new Autocomplete(inputRef.current, {
        fields: ['geometry', 'name', 'formatted_address'],
      });
      setPlaceAutocomplete(autocomplete);


      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = place.geometry.location;
          mapRef.current.setCenter(location);
          mapRef.current.setZoom(15);

          const nearby = bars
            .map(bar => {
              const barLocation = { lat: bar.latitude, lng: bar.longitude };
              const distance = haversineDistance(location.toJSON(), barLocation);
              return { ...bar, distance };
            })
            .filter(bar => bar.distance <= DEFAULT_RADIUS);

          setNearbyBars(nearby);
          setDrawerOpen(true);
        }
      });
    }
  }, [libraries, bars, navigate]);

  const handleCloseModal = () => setSelectedBar(null);
  const handleGoToEvents = () => {
    if (selectedBar) {
      navigate(`/bars/${selectedBar.id}/events`);
      handleCloseModal();
    }
  };


  const handleSearchClick = () => {
    if (placeAutocomplete) {
      const place = placeAutocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        mapRef.current.setCenter(location);
        mapRef.current.setZoom(20);

        const nearby = bars
          .map(bar => {
            const barLocation = { lat: bar.latitude, lng: bar.longitude };
            const distance = haversineDistance(location.toJSON(), barLocation);
            return { ...bar, distance };
          })
          .filter(bar => bar.distance <= DEFAULT_RADIUS);

        setNearbyBars(nearby);
        setDrawerOpen(true);
      }
    }
  };

  if (!libraries) {
    return <h1>Cargando. . .</h1>;
  }

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#c0874f' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Búsqueda de Bares
          </Typography>
          <TextField
            inputRef={inputRef}
            variant="outlined"
            placeholder="Buscar lugares..."
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            style={{ backgroundColor: 'white', borderRadius: 4 }}
          />
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ style: { height: '30vh' } }}
      >
        <div style={{ padding: '16px' }}>
          <Typography variant="h6">Bares cercanos:</Typography>
          {nearbyBars.length > 0 ? (
            <List>
              {nearbyBars.map((bar, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={bar.name}
                    secondary={`Dirección: ${bar.address} - Distancia: ${Math.round(bar.distance)} metros`}
                    onClick={() => navigate(`/bars/${bar.id}/events`)} 
                    style={{ cursor: 'pointer' }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No hay bares cercanos en esta ubicación.</Typography>
          )}
        </div>
      </Drawer>

      <Modal
        open={Boolean(selectedBar)}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{ width: 300, margin: '100px auto', padding: 20, backgroundColor: '#3a271f', borderRadius: 8, boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', color: 'white' }}>
          {selectedBar && (
            <>
              <Typography id="modal-title" variant="h6" component="h2">
                {selectedBar.name}
              </Typography>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                Dirección: {selectedBar.address}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGoToEvents}
                sx={{ mt: 2, backgroundColor: '#c0874f', color: 'white', '&:hover': { backgroundColor: '#a8743e' } }}
              >
                Ver Eventos
              </Button>
            </>
          )}
        </div>
      </Modal>

      <div ref={mapNodeRef} style={{ width: '100vw', height: '90vh' }} />
    </div>
  );
};

export default Map;
