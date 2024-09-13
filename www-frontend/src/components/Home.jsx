import React from 'react';
import { Typography, Card, CardContent, Box, Container, Grid, Button } from '@mui/material';
import BeerIcon from '@mui/icons-material/SportsBar';
import LocalBarIcon from '@mui/icons-material/LocalBar';

const Home = () => (
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: 3 }}>
              <CardContent>
                <BeerIcon sx={{ fontSize: 50, color: '#c0874f' }} />
                <Typography variant="h6" component="div">
                  Bar 1
                </Typography>
                <Typography variant="body2">
                  Alan Cambia esto para que funcione con el mapa XD.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Boton no funciona JAJA XDDXDDD
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: 3 }}>
              <CardContent>
                <BeerIcon sx={{ fontSize: 50, color: '#c0874f' }} />
                <Typography variant="h6" component="div">
                  Bar 2
                </Typography>
                <Typography variant="body2">
                  Alan Cambia esto para que funcione con el mapa XD.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Boton no funciona JAJA XDDXDDD
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  </Box>
);

export default Home;
