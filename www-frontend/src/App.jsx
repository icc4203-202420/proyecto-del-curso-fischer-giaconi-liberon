import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AppAppBar from './components/AppAppBar';
import Home from './components/Home';
import Explore from './components/Explore'; // Import the Explore component
import UserSearch from './components/UserSearch';
import Events from './components/Events';

function App() {
  return (
    <>
      <AppAppBar />
      <Box
        component="main"
        sx={{
          pt: 20,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            pt: 20,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            //justifyContent: 'center',
            alignItems: 'center',
            padding: 3,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/usersearch" element={<UserSearch />} />
            <Route path="/bars/:bar_id/events" element={<Events />} />
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
