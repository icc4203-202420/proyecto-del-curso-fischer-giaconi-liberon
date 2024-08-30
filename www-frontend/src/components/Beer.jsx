import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, List, ListItem, ListItemText, CircularProgress, Grid } from '@mui/material';

const Beers = () => {
    const [beers, setBeers] = useState(null);

    useEffect(() => {
        const fetchBeers = async () => {
            try {
                const beer_url = `http://127.0.0.1:3001/api/v1/beers`;
                const response = await axios.get(beer_url);
                const data = await response.data;

                if (data.beers) {
                    setBeers(data.beers);
                }
            } catch (error) {
                console.error("Error fetching beers:", error);
            }
        };

        fetchBeers();
    }, []);

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            {beers ? (
                <List>
                    {beers.map((beer) => (
                        <ListItem key={beer.id} style={{ backgroundColor: '#3A2B2A', color: '#FFFFFF', marginBottom: '8px', paddingLeft: '25px' }}>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" style={{ color: '#FFFFFF' }}>
                                        {beer.name}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" style={{ color: '#FFFFFF' }}>
                                            Yeast: {beer.yeast}
                                        </Typography>
                                        <Typography variant="body2" style={{ color: '#bfbfbf' }}>
                                            Malts: {beer.malts}
                                        </Typography>
                                        <Typography variant="body2" style={{ color: '#bfbfbf' }}>
                                            IBU: {beer.ibu}
                                        </Typography>
                                        <Typography variant="body2" style={{ color: '#bfbfbf' }}>
                                            Alcohol level: {beer.alcohol}
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

export default Beers;
