import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const UploadImage = ({ eventId, userId }) => {
    const [file, setFile] = useState(null);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('event_picture[image]', file);
        formData.append('event_picture[event_id]', eventId);
        formData.append('event_picture[user_id]', userId.id);
        formData.append('event_picture[handle]', userId.handle);

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
            <Button onClick={handleUpload} variant="contained" color="primary">
                Upload Image
            </Button>
        </div>
    );
};

export default UploadImage;
