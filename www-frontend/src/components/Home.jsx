import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Box, Container, Grid, Button, CircularProgress } from '@mui/material';
import BeerIcon from '@mui/icons-material/SportsBar';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { Link } from 'react-router-dom';

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

  return R * c; // Distance in meters
};

const Home = () => {
  const [bars, setBars] = useState([]); // List of all bars
  const [nearbyBars, setNearbyBars] = useState([]); // List of nearby bars
  const [userLocation, setUserLocation] = useState(null); // User's current location
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Function to get user's current location
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        }, error => {
          console.error('Error getting location:', error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // Fetch bars from API (replace with your API endpoint)
    const fetchBars = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/v1/bars');
        const data = await response.json();
        setBars(data.bars || []);
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    getUserLocation();
    fetchBars();
  }, []);

  useEffect(() => {
    if (userLocation && bars.length > 0) {
      const nearby = bars
        .map(bar => {
          const barLocation = { lat: bar.latitude, lng: bar.longitude };
          const distance = haversineDistance(userLocation, barLocation);
          return { ...bar, distance };
        })
        .filter(bar => bar.distance <= 500000); // Only include bars within 5 km

      setNearbyBars(nearby);
      setLoading(false); // Stop loading when nearby bars are calculated
    }
  }, [userLocation, bars]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        width: '100%',
        backgroundColor: '#3a271f',
        padding: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ padding: 0 }}>
        <Card sx={{ margin: 'auto', padding: 2, textAlign: 'center', mb: 4 }}>
          <CardContent>
            <BeerIcon sx={{ fontSize: 50, color: '#e7c12a' }} />
            <Typography variant="h4" component="div" gutterBottom>
              Bienvenido
            </Typography>
            <Typography variant="body1">
              ¡Estas son las novedades!
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ width: '100%' }}>
          <Typography variant="h5" component="div" gutterBottom>
            <LocalBarIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#c0874f' }} />
            Bares Cercanos
          </Typography>
          {loading ? (
            <CircularProgress sx={{ color: '#c0874f', margin: 2 }} />
          ) : (
            <Grid container spacing={2}>
              {nearbyBars.length > 0 ? (
                nearbyBars.map((bar, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: 3 }}>
                      <CardContent>
                        <BeerIcon sx={{ fontSize: 50, color: '#c0874f' }} />
                        <Typography variant="h6" component="div">
                          {bar.name}
                        </Typography>
                        <Typography variant="body2">
                          {bar.address}
                        </Typography>
                        <Typography variant="body2">
                          {Math.round(bar.distance)} metros de distancia
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: '#c0874f' }}
                          component={Link}
                          to={`/bars/${bar.id}/events`} // Navigate to events page for the bar
                        >
                          Más detalles
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1">
                  No hay bares cercanos en esta ubicación.
                </Typography>
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
