import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Avatar, CircularProgress, Button, Alert, TextField, Autocomplete } from '@mui/material';

const User = () => {
  const { id } = useParams(); // Obtiene el ID del usuario de la URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [alertType, setAlertType] = useState('');
  const [event, setEvent] = useState(null);
  const [friendship, setFriendship] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [sharedEvents, setSharedEvents] = useState([]);

  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleAddFriend = async () => {
    const token = localStorage.getItem('token');

    if (!currentUser) {
      setFriendshipStatus('Debes iniciar sesión para agregar amigos.');
      setAlertType('error');
      return;
    }

    if (!eventId) {
      setFriendshipStatus('Debes especificar un evento.');
      setAlertType('error');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:3001/api/v1/users/${id}/friendships`,
        {
          friendship: {
            friend_id: currentUser.id,
            event_id: eventId
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
        const response = await axios.get(`http://127.0.0.1:3001/api/v1/users/${id}`, {
          params: {
            current_user: currentUser.id,
          }
        });
        console.log(response.data);
        if (response.data.friendship) {
          setEvent(response.data.event);
          setUser(response.data.user);
          setFriendship(response.data.friendship);
        } else {
          setUser(response.data.user);
          setSharedEvents(response.data.events);
        }
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
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <Container style={{ paddingTop: '20px', textAlign: 'center' }}>
      <Avatar src={user.image_url} alt={user.first_name} style={{ width: 100, height: 100, margin: 'auto' }} />
      <Typography variant="h4">{`${user.first_name} ${user.last_name}`}</Typography>
      <Typography variant="body1">Handle: {user.handle}</Typography>

      {!friendship && (
        currentUser && currentUser.id !== parseInt(id) && (
          <>
            <Autocomplete
              options={sharedEvents}
              getOptionLabel={(option) => option.name} // Supone que el evento tiene un atributo 'name'
              onChange={(event, value) => setEventId(value ? value.id : null)} // Suponiendo que el evento tiene un atributo 'id'
              renderInput={(params) => (
                <TextField {...params} label="Selecciona un Evento" variant="outlined" style={{ marginTop: '20px' }} fullWidth />
              )}
              style={{ marginTop: '20px' }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              style={{ marginTop: '20px' }} 
              onClick={handleAddFriend}
            >
              Agregar Amigo
            </Button>
          </>
        )
      )}

      {friendshipStatus && (
        <Alert severity={alertType} style={{ marginTop: '20px' }}>
          {friendshipStatus}
        </Alert>
      )}

      {event && (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Primer evento como amigos: {event.name}
        </Typography>
      )}
    </Container>
  );
};

export default User;
