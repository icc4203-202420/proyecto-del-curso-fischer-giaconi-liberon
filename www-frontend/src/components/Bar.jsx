import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, Paper, CircularProgress, List, ListItem, ListItemText, Divider, ListItemAvatar, Avatar, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Bars = () => {
    const [bars, setBars] = useState(null);
    const navigate = useNavigate(); // Hook to programmatically navigate

    useEffect(() => {
        const fetchBars = async () => { 
            try {
                const bar_url = `http://127.0.0.1:3001/api/v1/bars`;
                const response = await axios.get(bar_url); 
                const data = await response.data;

                if (data.bars) { 
                    setBars(data.bars);
                }
            } catch (error) {
                console.error("Error fetching bars:", error);
            }
        };
        fetchBars();
    }, []);

    const handlePaperClick = (barId) => {
        navigate(`/bars/${barId}/events`); // Redirect to the events page for the bar
    };

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            {bars ? (
                <List>
                    {bars.map((bar) => (
                        <div key={bar.id}>
                            <ListItem alignItems="flex-start">
                                <Paper
                                    elevation={3}
                                    style={{ padding: '16px', width: '100%', backgroundColor: '#3A2B2A', color: '#FFFFFF', cursor: 'pointer' }}
                                    onClick={() => handlePaperClick(bar.id)}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar
                                                variant="rounded"
                                                src={`path/to/your/image/${bar.id}.jpg`} // Replace with actual image path
                                                alt={bar.name}
                                                style={{ width: 80, height: 80 }}
                                            />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h6" style={{ marginBottom: '10px' }}>
                                                {bar.name}
                                            </Typography>
                                            <ListItemText
                                                primary={`Dirección ID: ${bar.address_id}`}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </div>
            )}
        </Container>
    );
};

export default Bars;
