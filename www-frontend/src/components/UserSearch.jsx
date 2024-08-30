import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const UserSearch = () => {
    const [handle, setHandle] = useState("");

    const handleInputChange = (event) => {
        setHandle(event.target.value);
    };

    const handleSearch = () => {
        console.log("Buscando usuario:", handle);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Search User by Handle
            </Typography>
            <Box sx={{ mb: 4 }}>
                <TextField
                    label="User's Handle"
                    variant="outlined"
                    value={handle}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{
                        '& .MuiInputLabel-root': { color: '#ffffff' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#ffffff' },
                            '&:hover fieldset': { borderColor: '#ffffff' },
                            '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                        },
                        '& .MuiInputBase-root': { color: '#ffffff' },
                    }}
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={<AccountCircleIcon />}
                sx={{ width: '100%', py: 1 }}
            >
                Search
            </Button>
        </Container>
    );
};

export default UserSearch;
