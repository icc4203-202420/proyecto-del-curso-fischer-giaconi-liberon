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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import AddAttendance from './AddAttendance';
import Attendance from './Attendance';

const Events = () => {
    const [events, setEvents] = useState(null);
    const { bar_id } = useParams();
    const [bar, setBar] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [eventPictures, setEventPictures] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]); // State for available users
    const [taggedUsers, setTaggedUsers] = useState([]); // State for tagged users
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const [selectedFile, setSelectedFile] = useState(null); // State for the selected file
    const [description, setDescription] = useState(''); // State for image description
    const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
    const [selectedImage, setSelectedImage] = useState(null); // State for enlarged image dialog

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const event_url = `http://127.0.0.1:3001/api/v1/bars/${bar_id}/events`;
                const response = await axios.get(event_url);
                const data = await response.data;

                if (data.events) {
                    setEvents(data.events);
                    setBar(data.bar);
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
            setEventPictures(response.data);
            
        } catch (error) {
            console.error('Error fetching event pictures:', error);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:3001/api/v1/users`); // Endpoint to fetch users
            setAvailableUsers(response.data); // Set available users
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchAvailableUsers(); // Fetch available users when the component mounts
    }, []);

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

    // Function to handle image upload
    const handleUpload = async (eventId) => {
        const formData = new FormData();
        formData.append('event_picture[image]', selectedFile);
        formData.append('event_picture[event_id]', eventId);
        formData.append('event_picture[user_id]', currentUser.id);
        formData.append('event_picture[description]', description);
    
        // Append tagged users to the form data if there are any
        taggedUsers.forEach((user) => {
            if (user.id) {
                formData.append('event_picture[tagged_users][]', user.id); // Assuming each user has an id
            }
        });
    
        try {
            const response = await axios.post(`http://127.0.0.1:3001/api/v1/event_pictures`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchEventPictures(eventId);
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', response.data);
            setSelectedFile(null); // Reset selected file
            setDescription(''); // Reset description
            setTaggedUsers([]); // Reset tagged users
            setDialogOpen(false); // Close dialog
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };
    

    const openUploadDialog = () => {
        setDialogOpen(true);
    };

    const closeUploadDialog = () => {
        setDialogOpen(false);
        setSelectedFile(null); // Reset selected file
        setDescription(''); // Reset description
        setTaggedUsers([]); // Reset tagged users
    };

    const openImageDialog = (image) => {
        setSelectedImage(image);
    };

    const closeImageDialog = () => {
        setSelectedImage(null);
    };

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px', position: 'relative', backgroundColor: '#3A2B2A' }}>
                <IconButton component={Link} to="/explore" style={{ position: 'absolute', top: '16px', left: '16px', color: '#FFFFFF' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h2" gutterBottom align="center" style={{ color: '#FFFFFF' }}>
                    {bar ? `Eventos de ${bar.name}` : 'Eventos de bar'}
                </Typography>
            </Paper>

            {events ? (
                <List>
                    {events.map((event) => {
                        const { formattedDate, formattedTime } = formatDateTime(event.date);
                        return (
                            <ListItem key={event.id} style={{ backgroundColor: '#3A2B2A', color: '#FFFFFF', marginBottom: '8px', paddingLeft: '25px' }}>
                                <ListItemAvatar>
                                    <Avatar src={`path/to/your/image/${event.id}.jpg`} alt={event.name} style={{ width: 100, height: 100 }} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Typography variant="h6" style={{ color: '#FFFFFF' }}>Nombre: {event.name}</Typography>}
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
                                                action={<Button color="inherit" onClick={handleSnackbarClose}>OK</Button>}
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
                                <Button variant="contained" color="primary" onClick={openUploadDialog} style={{ backgroundColor: '#c0874f', color: '#fff' }}>
                                    Upload Image
                                </Button>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <CircularProgress style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }} />
            )}

            {/* Dialog for Uploading Image */}
            <Dialog 
                open={dialogOpen} 
                onClose={closeUploadDialog} 
                PaperProps={{ style: { backgroundColor: '#3a271f', color: '#fff' } }} // Set dialog background color
            >
                <DialogTitle style={{ color: '#c0874f' }}>Upload Image</DialogTitle> {/* Set dialog title color */}
                <DialogContent>
                    <input 
                        type="file" 
                        onChange={(e) => setSelectedFile(e.target.files[0])} 
                        accept="image/*" 
                        style={{ marginTop: '16px' }} 
                    />
                    {selectedFile && (
                        <img 
                            src={URL.createObjectURL(selectedFile)} 
                            alt="Preview" 
                            style={{ width: '100%', height: 'auto', marginTop: '16px' }} 
                        />
                    )}
                    <TextField 
                        fullWidth 
                        variant="outlined" 
                        label="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        style={{ marginTop: '16px', backgroundColor: '#ffffff' }} // Set input background color
                    />
                    {/* Autocomplete for tagging users */}
                    <Autocomplete
                        multiple
                        options={availableUsers}
                        getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.handle})`}
                        value={taggedUsers}
                        onChange={(event, newValue) => {
                            setTaggedUsers(newValue); // Set the entire user object
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Tag Users"
                                placeholder="Select users"
                                style={{ backgroundColor: '#ffffff' }} // Set input background color
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeUploadDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleUpload(events[0].id)} color="primary" disabled={!selectedFile || !description}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Enlarged Image Dialog */}
            {selectedImage && (
                <Dialog open={Boolean(selectedImage)} onClose={closeImageDialog}>
                    <DialogContent>
                        <img 
                            src={selectedImage.image_url} 
                            alt={selectedImage.description} 
                            style={{ width: '100%' }} 
                        />
                        <div>
                            Tagged: {selectedImage.tagged_users.map(user => {
                                console.log("Tagged User:", user); // Optional: log user
                                return (
                                    <Link 
                                        key={user.id} 
                                        to={`/users/${user.id}`} 
                                        style={{ color: '#c0874f', marginLeft: '4px' }}
                                    >
                                        {user.name} (@{user.handle}) {/* Use name and handle */}
                                    </Link>
                                );
                            })}
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Gallery of Event Pictures */}
                <ImageList sx={{ width: '100%', height: 'auto' }}>
                    {eventPictures.map((item) => (
                        <ImageListItem key={item.image_url} onClick={() => openImageDialog(item)}>
                            <img src={item.image_url} alt={item.description} loading="lazy" />
                            <ImageListItemBar 
                                title={item.description} 
                                subtitle={
                                    <span>
                                        by: <Link to={`/users/${item.user.id}`} style={{ color: '#c0874f' }}>{item.user.handle}</Link>
                                        <br />
                                    </span>
                                } 
                                position="below" 
                            />

                        </ImageListItem>
                    ))}
                </ImageList>
        </Container>
    );
};

export default Events;
