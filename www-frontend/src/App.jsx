import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import Attendace from './components/Attendance';
import Bar from './components/Bar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo(0, 0);
    };

    handleScroll();

    return () => {
      window.removeEventListener('popstate', handleScroll);
    };
  }, [location.pathname]);
  return (
    <>
      <AppAppBar />
      <Box
        component="main"
        sx={{
          pt: (theme) => theme.spacing(15),
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
            <Route path="/bars" element={<Bar />} />
            <Route path="/beers/:id" element={<BeerDetail />} />
            <Route path="/login" element={<LogIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/map" element={<Map />} />
            {/* <Route path="/bars/:bar_id/events/:event_id" element={<Attendace />}></Route> */}
          </Routes>
        </Container>
      </Box>
    </>
  );
}

export default App;
