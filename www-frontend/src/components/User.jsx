import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Avatar, CircularProgress, Button, Alert } from '@mui/material';

const User = () => {
  const { id } = useParams(); // Obtiene el ID del usuario de la URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState(null); // Para manejar el estado de la solicitud de amistad
  const [alertType, setAlertType] = useState(''); // Estado para manejar el tipo de alerta

  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null; // Obtener usuario actual

  // Función para manejar solicitud de amistad
  const handleAddFriend = async () => {
    const token = localStorage.getItem('token');

    if (!currentUser) {
      setFriendshipStatus('Debes iniciar sesión para agregar amigos.');
      setAlertType('error');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:3001/api/v1/users/${id}/friendships`, {
          friendship: {
            friend_id: currentUser.id, // ID del usuario logueado
          }
        },
        {
          headers: {
            Authorization: token
          }
        }
      );
      setFriendshipStatus('Solicitud de amistad enviada con éxito.');
      setAlertType('success');
    } catch (error) {
      console.error('Error al enviar solicitud de amistad:', error);
      setFriendshipStatus('Error al enviar la solicitud de amistad.');
      setAlertType('error');
    }
  };

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
      
      {/* Mostrar botón solo si el ID del usuario logueado es diferente del ID de la URL */}
      {currentUser && currentUser.id !== parseInt(id) && (
        <Button 
          variant="contained" 
          color="primary" 
          style={{ marginTop: '20px' }} 
          onClick={handleAddFriend}
        >
          Agregar Amigo
        </Button>
      )}

      {/* Mostrar alerta de la solicitud de amistad */}
      {friendshipStatus && (
        <Alert severity={alertType} style={{ marginTop: '20px' }}>
          {friendshipStatus}
        </Alert>
      )}
    </Container>
  );
};

export default User;
