import React from 'react';
import { Typography, Card, CardContent, Box, Container } from '@mui/material';
import BeerIcon from '@mui/icons-material/SportsBar';

const Home = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)', // Adjust based on AppBar height
      width: '100%'
    }}
  >
    <Container maxWidth="lg" sx={{ padding: 0 }}>
      <Card sx={{ margin: 'auto', padding: 2, textAlign: 'center' }}>
        <CardContent>
          <BeerIcon sx={{ fontSize: 50, color: '#e7c12a' }} />
          <Typography variant="h4" component="div" gutterBottom>
            Welcome to the Home Page
          </Typography>
          <Typography variant="body1">
            Placeholder content for the home page. Add more details here to make it engaging.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  </Box>
);

export default Home;
