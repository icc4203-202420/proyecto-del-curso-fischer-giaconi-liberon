import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Container, CircularProgress } from '@mui/material';

const BeerDetail = () => {
    const { beerId } = useParams(); // Obtén el ID de la cerveza de la URL
    const [beer, setBeer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${beerId}`);
                setBeer(response.data.beer); // Asegúrate de que `response.data.beer` sea el camino correcto
            } catch (error) {
                console.error("Error fetching beer details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBeerDetails();
    }, [beerId]);

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (!beer) {
        return (
            <Container>
                <Typography variant="h6">Beer not found</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4">{beer.name}</Typography>
            <Typography variant="h6">Yeast: {beer.yeast}</Typography>
            <Typography variant="body1">Malts: {beer.malts}</Typography>
            <Typography variant="body1">IBU: {beer.ibu}</Typography>
            <Typography variant="body1">Alcohol level: {beer.alcohol}</Typography>
            {/* Aquí puedes agregar la sección de reviews */}
        </Container>
    );
};

export default BeerDetail;
