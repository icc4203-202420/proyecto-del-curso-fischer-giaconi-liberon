import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, CircularProgress, Card, CardContent, Box } from '@mui/material';
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

    return (
        <Box sx={{ backgroundColor: '#3A2B2A', color: '#FFF', padding: 2, minHeight: '100vh' }}>
            <Typography 
                variant="h4" 
                sx={{ 
                    marginBottom: 3, 
                    textAlign: 'center', 
                    color: '#FFF', 
                    fontFamily: 'Arial, sans-serif', // Fuente similar a la usada en el primer código 
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
                                            fontFamily: 'Arial, sans-serif', // Usamos 'Arial' como en las reviews
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {attendance.first_name} {attendance.last_name} ({attendance.handle})
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#FFF', fontFamily: 'Arial, sans-serif' }}>
                                        Checked In: {attendance.checked_in ? 'Yes' : 'No'}
                                    </Typography>
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
