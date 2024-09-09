import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Paper, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const Events = () => {
    const [events, setEvents] = useState(null);
    const { bar_id } = useParams();
    console.log(useParams())

    useEffect(() => {
        const fetchEvents = async () => { 
            try {
                const event_url = `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events`;
                const response = await axios.get(event_url); 
                const data = await response.data;

                if (data.events) { 
                    setEvents(data.events);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, [bar_id]);

    // Helper function to format the date and time
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        return { formattedDate, formattedTime };
    };

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            {/* Top flyer and button */}
            <Paper 
                elevation={3} 
                style={{ padding: '16px', marginBottom: '16px', position: 'relative', backgroundColor: '#3A2B2A' }}
            >
                <IconButton
                    component={Link}
                    to="/explore"
                    style={{ position: 'absolute', top: '16px', left: '16px', color: '#FFFFFF' }} // White icon color
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h2" gutterBottom align="center" style={{ color: '#FFFFFF' }}>
                    Eventos del bar
                </Typography>
            </Paper>

            {/* Events list */}
            {events ? (
                <List>
                    {events.map((event) => {
                        const { formattedDate, formattedTime } = formatDateTime(event.date);
                        return (
                            <ListItem key={event.id} style={{ backgroundColor: '#3A2B2A', color: '#FFFFFF', marginBottom: '8px', paddingLeft: '25px' }}>
                                <ListItemAvatar>
                                    <Avatar 
                                        src={`path/to/your/image/${event.id}.jpg`} // Replace with actual image path
                                        alt={event.name}
                                        style={{ width: 100, height: 100 }} // Squared and larger
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" style={{ color: '#FFFFFF' }}>
                                            Nombre: {event.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography style={{ color: '#FFFFFF' }}>Fecha: {formattedDate}</Typography>
                                            <Typography style={{ color: '#FFFFFF' }}>Hora: {formattedTime}</Typography>
                                            <Typography style={{ color: '#FFFFFF' }}>ID del Bar: {event.bar_id}</Typography>
                                        </>
                                    }
                                    style={{ marginLeft: '50px' }} // Push text to the right
                                />
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <CircularProgress style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }} />
            )}
        </Container>
    );
};

export default Events;
