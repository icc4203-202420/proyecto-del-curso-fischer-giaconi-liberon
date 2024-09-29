import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

const UploadImage = ({ eventId, userId }) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState(''); // Estado para la descripción

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value); // Actualiza el valor de la descripción
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('event_picture[image]', file);
        formData.append('event_picture[event_id]', eventId);
        formData.append('event_picture[user_id]', userId.id);
        formData.append('event_picture[handle]', userId.handle);
        formData.append('event_picture[description]', description); // Incluye la descripción en el formData

        try {
            await axios.post('http://127.0.0.1:3001/api/v1/event_pictures', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Image uploaded successfully!');
            
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleChange} />
            <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={handleDescriptionChange} // Input para la descripción
                margin="normal"
            />
            <Button onClick={handleUpload} variant="contained" color="primary">
                Upload Image
            </Button>
        </div>
    );
};

export default UploadImage;
