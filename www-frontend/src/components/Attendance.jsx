import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, CircularProgress, Card, CardContent, Box, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Attendance = ({ event_id }) => {
    const [attendances, setAttendances] = useState([]);
    const [error, setError] = useState('');
    const { bar_id } = useParams();

    useEffect(() => {
        const fetchAttendances = async () => {
            const token = localStorage.getItem('token'); 

            try {
                const response = await axios.get(
                    `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                    {
                        headers: {
                            Authorization: token 
                        }
                    }
                );

                if (Array.isArray(response.data)) {
                    setAttendances(response.data);
                }
            } catch (error) {
                console.error("Error fetching attendances:", error);
                setError('Failed to fetch attendances. Please try again.');
            }
        };

        if (event_id) {
            fetchAttendances();
        }
    }, [bar_id, event_id]);

    // Función para manejar solicitud de amistad
    const handleAddFriend = async (user_id) => {
        const token = localStorage.getItem('token');
        const current_user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        console.log(current_user.id);
        console.log(user_id);   
        
        try {
            await axios.post(
                `http://127.0.0.1:3001/api/v1/users/${user_id}/friendships`, {
                    friendship: {
                        friend_id: current_user.id,
                        bar_id: bar_id,
                        event_id: event_id,
                    }
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            alert('Solicitud de amistad enviada.');
        } catch (error) {
            console.error('Error al enviar solicitud de amistad:', error);
            alert('Error al enviar solicitud de amistad.');
        }
    };

    return (
        <Box sx={{ backgroundColor: '#3A2B2A', color: '#FFF', padding: 2, minHeight: '100vh' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    marginBottom: 3, 
                    textAlign: 'center', 
                    color: '#FFF', 
                    fontFamily: 'Arial, sans-serif', 
                    fontWeight: 'bold' 
                }}
            >
                Attendances for Event
            </Typography>
            
            {error && <Typography color="error">{error}</Typography>}
            
            {attendances.length > 0 ? (
                <Grid container spacing={3}>
                    {attendances.map((attendance) => (
                        <Grid item xs={12} sm={6} md={4} key={attendance.user_id}>
                            <Card sx={{ backgroundColor: '#593D30', color: '#FFF', borderRadius: '15px', border: '2px solid #C0874F' }}>
                                <CardContent>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            marginBottom: 2, 
                                            color: '#C0874F', 
                                            fontFamily: 'Arial, sans-serif',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {attendance.first_name} {attendance.last_name} ({attendance.handle})
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#FFF', fontFamily: 'Arial, sans-serif' }}>
                                        Checked In: {attendance.checked_in ? 'Yes' : 'No'}
                                    </Typography>

                                    {/* Botón para agregar amigo */}
                                    <Button 
                                        variant="contained" 
                                        sx={{ marginTop: 2, backgroundColor: '#C0874F', color: '#FFF' }}
                                        onClick={() => handleAddFriend(attendance.user_id)}
                                    >
                                        Agregar Amigo
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container justifyContent="center" sx={{ marginTop: 4 }}>
                    <CircularProgress sx={{ color: '#C0874F' }} />
                </Grid>
            )}
        </Box>
    );
};

export default Attendance;
