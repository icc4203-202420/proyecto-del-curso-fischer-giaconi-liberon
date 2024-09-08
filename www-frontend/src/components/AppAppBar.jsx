import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  return (
    <AppBar
      position="fixed"
      sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 10 }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Button
              component={Link}
              to="/"
              variant="text"
              size="small"
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/explore"
              variant="text"
              size="small"
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Explore
            </Button>
            <Button
              component={Link}
              to="/usersearch"
              variant="text"
              size="small"
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Users
            </Button>
          </Box>
          <Box>
            <Button
              component={Link}
              to="/login"
              variant="text"
              size="small"
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Log In
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="text"
              size="small"
              sx={{ color: 'white', textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
