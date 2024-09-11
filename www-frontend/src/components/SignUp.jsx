import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Typography, Alert, Card, CardContent, Container } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

// Define a theme for the sign-up
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

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    handle: '',
    password: '',
    password_confirmation: '',
    line1: '',
    line2: '',
    city: '',
    country_id: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Organizar los datos en el formato requerido
      const postData = {
        user: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          handle: formData.handle,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          address_attributes: {
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            country_id: formData.country_id,
          },
        },
      };

      // Enviar la solicitud POST
      const response = await axios.post('http://127.0.0.1:3001/api/v1/signup', postData);
      setSuccessMessage('Registration successful!');
      setErrorMessage('');

      setTimeout(() => {
        navigate('/login'); // Cambia '/login' por la ruta que corresponda a tu página de login
      }, 500); // Puedes ajustar el tiempo de espera según necesites
    } catch (error) {
      setErrorMessage(error.response?.data?.status?.message || 'Error registering user.');
      setSuccessMessage('');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <StyledCard>
          <Typography variant="h5" sx={{ textAlign: 'center', color: theme.palette.primary.main }}>
            Sign Up
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
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Handle"
              name="handle"
              value={formData.handle}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Confirm Password"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Address Line 1"
              name="line1"
              value={formData.line1}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              label="Address Line 2"
              name="line2"
              value={formData.line2}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              label="Country ID"
              name="country_id"
              type="number"
              value={formData.country_id}
              onChange={handleChange}
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">
              Sign Up
            </Button>
          </Box>
        </StyledCard>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
