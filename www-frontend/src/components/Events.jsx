import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Typography,
    Container,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Paper,
    CircularProgress,
    Button,
    Snackbar,
    ImageList,
    ImageListItem,
    ImageListItemBar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import AddAttendance from './AddAttendance';
import Attendance from './Attendance';
import UploadImage from './UploadImage'; 

const Events = () => {
    const [events, setEvents] = useState(null);
    const { bar_id } = useParams();
    const [bar, setBar] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [eventPictures, setEventPictures] = useState([]);
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null; // Replace with the actual user ID from your context or state

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const event_url = `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events`;
                const response = await axios.get(event_url);
                const data = await response.data;

                if (data.events) {
                    setEvents(data.events);
                    setBar(data.bar);
                    // Optionally fetch event pictures for the first event or handle it differently
                    if (data.events.length > 0) {
                        fetchEventPictures(data.events[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, [bar_id]);

    const fetchEventPictures = async (eventId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/api/v1/event_pictures?event_id=${eventId}`);
            console.log(response.data);
            setEventPictures(response.data);
        } catch (error) {
            console.error('Error fetching event pictures:', error);
        }
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        return { formattedDate, formattedTime };
    };

    const handleCheckIn = (attendance) => {
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            <Paper
                elevation={3}
                style={{ padding: '16px', marginBottom: '16px', position: 'relative', backgroundColor: '#3A2B2A' }}
            >
                <IconButton
                    component={Link}
                    to="/explore"
                    style={{ position: 'absolute', top: '16px', left: '16px', color: '#FFFFFF' }}
                >
                    <ArrowBackIcon />
                </IconButton>
                {bar ? (
                    <Typography variant="h2" gutterBottom align="center" style={{ color: '#FFFFFF' }}>
                        Eventos de {bar.name}
                    </Typography>
                ) : (
                    <Typography variant="h2" gutterBottom align="center" style={{ color: '#FFFFFF' }}>
                        Eventos de bar
                    </Typography>
                )}
            </Paper>

            {events ? (
                <List>
                    {events.map((event) => {
                        const { formattedDate, formattedTime } = formatDateTime(event.date);
                        return (
                            <ListItem key={event.id} style={{ backgroundColor: '#3A2B2A', color: '#FFFFFF', marginBottom: '8px', paddingLeft: '25px' }}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={`path/to/your/image/${event.id}.jpg`}
                                        alt={event.name}
                                        style={{ width: 100, height: 100 }}
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
                                            <AddAttendance bar_id={bar_id} event_id={event.id} onCheckIn={handleCheckIn} />
                                            <Attendance event_id={event.id} />
                                            <Snackbar
                                                open={openSnackbar}
                                                autoHideDuration={6000}
                                                onClose={handleSnackbarClose}
                                                message="Has confirmado tu asistencia."
                                                action={
                                                    <Button color="inherit" onClick={handleSnackbarClose}>
                                                        OK
                                                    </Button>
                                                }
                                                anchorOrigin={{
                                                    vertical: 'center',
                                                    horizontal: 'center',
                                                }}
                                                style={{
                                                    position: 'fixed',
                                                    bottom: 'auto',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                }}
                                            />
                                        </>
                                    }
                                    style={{ marginLeft: '50px' }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <CircularProgress style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }} />
            )}

            {/* Upload Image Section */}
            {events && events.map(event => (
                <UploadImage key={event.id} eventId={event.id} userId={currentUser} />
            ))}

            {/* Gallery Section */}
            <Typography variant="h4" style={{ marginTop: '20px' }}>
                Galería de Imágenes
            </Typography>
            <ImageList sx={{ width: '100%', height: 'auto' }}>
                {eventPictures.map((item) => (
                    <ImageListItem key={item.image_url}>
                        <img
                            src={item.image_url}
                            alt={item.title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.description}
                            subtitle={<span>by: {item.user.handle}</span>}
                            position="below"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Container>
    );
};

export default Events;
