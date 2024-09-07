import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, List, ListItem, ListItemText, CircularProgress, Grid, Avatar } from '@mui/material';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

const Bars = () => {
    const [bars, setBars] = useState(null);
    const [filteredBars, setFilteredBars] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBars = async () => {
            try {
                const bar_url = `http://127.0.0.1:3001/api/v1/bars`;
                const response = await axios.get(bar_url);
                const data = await response.data;

                if (data.bars) {
                    setBars(data.bars);
                    setFilteredBars(data.bars); // Set initial filtered bars
                }
            } catch (error) {
                console.error("Error fetching bars:", error);
            }
        };

        fetchBars();
    }, []);

    const handlePaperClick = (barId) => {
        navigate(`/bars/${barId}/events`);
    };

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            <SearchBar data={bars} setFilteredData={setFilteredBars} placeholder="Search bars..." />
            {filteredBars ? (
                <List>
                    {filteredBars.map((bar) => (
                        <ListItem
                            key={bar.id}
                            style={{ backgroundColor: '#3A2B2A', color: '#FFFFFF', marginBottom: '8px', paddingLeft: '25px' }}
                            onClick={() => handlePaperClick(bar.id)}
                            alignItems="center"
                        >
                            <Avatar
                                src={bar.image_url} // Replace with the field that contains the image URL
                                alt={bar.name}
                                style={{ marginRight: '16px' }}
                            />
                            <ListItemText
                                primary={
                                    <Typography variant="h6" style={{ color: '#FFFFFF' }}>
                                        {bar.name}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" style={{ color: '#FFFFFF' }}>
                                            Address: {bar.address_id}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress />
                </Grid>
            )}
        </Container>
    );
};

export default Bars;
