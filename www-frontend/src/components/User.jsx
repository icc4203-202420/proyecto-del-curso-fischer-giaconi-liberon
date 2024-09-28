import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Avatar, CircularProgress } from '@mui/material';

const User = () => {
  const { id } = useParams(); // Obtiene el ID del usuario de la URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3001/api/v1/users/${id}`); // Asegúrate de que tu API tenga esta ruta
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return <Typography variant="h6">User not found</Typography>; // Mensaje si no se encuentra el usuario
  }

  return (
    <Container style={{ paddingTop: '20px', textAlign: 'center' }}>
      <Avatar src={user.image_url} alt={user.first_name} style={{ width: 100, height: 100, margin: 'auto' }} />
      <Typography variant="h4">{`${user.first_name} ${user.last_name}`}</Typography>
      <Typography variant="body1">Handle: {user.handle}</Typography>
      {/* Otros detalles del usuario */}
    </Container>
  );
};

export default User;
