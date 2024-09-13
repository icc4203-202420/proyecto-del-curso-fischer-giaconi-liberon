import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AppAppBar from './components/AppAppBar';
import Home from './components/Home';
import Explore from './components/Explore';
import UserSearch from './components/UserSearch';
import Events from './components/Events';
import BeerDetail from './components/BeerDetail';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Map from './components/Map';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

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
            alignItems: 'center',
            padding: 3,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/usersearch" element={<UserSearch />} />
            <Route path="/bars/:bar_id/events" element={<Events />} />
            <Route path="/beers/:id" element={<BeerDetail />} />
            <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
