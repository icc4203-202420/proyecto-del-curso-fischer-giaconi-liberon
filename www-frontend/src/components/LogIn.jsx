import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert, Card, CardContent, Container } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

// Define a theme for the login
const theme = createTheme({
  palette: {
    primary: {
      main: '#c0874f',
    },
    secondary: {
      main: '#3a271f',
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  maxWidth: 450,
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const LogIn = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:3001/api/v1/login', { user: formData });
      const token = response.data.status.token; 
      console.log(response.data.status.data.user)
      localStorage.setItem('user', JSON.stringify(response.data.status.data.user))
      if (token) {
        onLogin(token); 
        setSuccessMessage('Login successful!');
        setErrorMessage('');
      } else {
        setErrorMessage('Unable to retrieve token. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.status?.message || 'An error occurred.');
      setSuccessMessage('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <StyledCard>
          <Typography variant="h5" sx={{ textAlign: 'center', color: theme.palette.primary.main }}>
            Log In
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Log In
            </Button>
          </Box>
        </StyledCard>
      </Container>
    </ThemeProvider>
  );
};

export default LogIn;
