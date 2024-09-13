import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Container, CircularProgress, TextField, Button, Snackbar, Card, CardContent, Alert, Box, Slider, Tabs, Tab, Grid } from '@mui/material';
import ReactStars from 'react-rating-stars-component';
import { styled } from '@mui/system';

const CustomTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `2px solid #C0874F`,
  borderTop: `2px solid #C0874F`,
  '.MuiTabs-indicator': {
    backgroundColor: '#C0874F',
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  color: '#FFF',
  '&.Mui-selected': {
    color: '#C0874F',
  },
}));

const AvgRating = ({ rating }) => {
    const formattedRating = rating ? rating.toFixed(1) : 'N/A';
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReactStars
                count={5}
                value={rating || 0}
                size={24}
                isHalf={true}
                edit={false}
                activeColor="#ffd700"
            />
            <Typography variant="body1" sx={{ ml: 2 }}>{formattedRating}</Typography>
        </Box>
    );
};

const BeerDetail = () => {
    const { id } = useParams();
    const [beer, setBeer] = useState(null);
    const [brewery, setBrewery] = useState(null);
    const [bars, setBars] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ text: '', rating: 5 });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);
                const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

                const sortedReviews = response.data.reviews.sort((a, b) => {
                    if (user) {
                        if (a.user.id === user.id) return -1;
                        if (b.user.id === user.id) return 1;
                    }
                    return 0;
                });

                setBrewery(response.data.brewery);
                setBeer(response.data.beer);
                setReviews(sortedReviews);
                setBars(response.data.bars);
            } catch (error) {
                console.error("Error fetching beer details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBeerDetails();
    }, [id]);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prevState => ({
            ...prevState,
            [name]: name === 'rating' ? Number(value) : value
        }));
    };

    const handleSliderChange = (event, newValue) => {
        setNewReview(prevState => ({
            ...prevState,
            rating: newValue
        }));
    };

    const handleSubmitReview = async () => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        
        if (!user) {
            setError('You must be logged in to leave a review.');
            return;
        }

        try {
            const aux_token = localStorage.getItem('token');
            const token = aux_token.trim('\n');
            console.log(token)

            await axios.post(`http://127.0.0.1:3001/api/v1/beers/${id}/reviews`, {
                review: {
                    text: newReview.text,
                    rating: newReview.rating
                },
                user_id: user.id
            }, {
                headers: { Authorization: token }
            });

            setSuccess('Review submitted successfully!');
            setNewReview({ text: '', rating: 5 });

            const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);

            const sortedReviews = response.data.reviews.sort((a, b) => {
                if (user) {
                    if (a.user.id === user.id) return -1;
                    if (b.user.id === user.id) return 1;
                }
                return 0;
            });

            setReviews(sortedReviews);
        } catch (error) {
            setError('Error submitting review.');
            console.error("Error submitting review:", error);
        }
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

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
        <Box sx={{ backgroundColor: '#3A271F', color: '#FFF', padding: 2, minHeight: '100vh' }}>
            {/* Pestañas de navegación */}
            <CustomTabs value={tabValue} onChange={handleChange} textColor="secondary" centered>
                <CustomTab label="DISPONIBLE" />
                <CustomTab label="PRODUCIDO" />
                <CustomTab label="DETALLES" />
                <CustomTab label="COMENTARIOS" />
            </CustomTabs>

            {/* Contenido según la pestaña seleccionada */}
            {tabValue === 0 && (
                <Box>
                    <Typography variant="h4" sx={{ margin: 2 }}>Disponible</Typography>
                    <Typography variant="h5" sx={{ margin: 2 }}>Average Rating</Typography><AvgRating rating={beer.avg_rating} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card sx={{ backgroundColor: '#593D30', color: '#FFF' }}>
                                <CardContent>
                                    <Typography variant="h6">Bars: {bars.map(bar => bar.name).join(', ')}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    <Typography variant="h4" sx={{ margin: 2 }}>Producido</Typography>
                    <Typography variant="h5" sx={{ margin: 2 }}>Average Rating</Typography><AvgRating rating={beer.avg_rating} />
                    <Card sx={{ backgroundColor: '#593D30', color: '#FFF', padding: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Brewer: {brewery.name}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {tabValue === 2 && (
                <Box>
                    <Typography variant="h4" sx={{ margin: 2 }}>Detalles</Typography>
                    <Typography variant="h5" sx={{ margin: 2 }}>Average Rating</Typography><AvgRating rating={beer.avg_rating} />
                    <Card sx={{ backgroundColor: '#593D30', color: '#FFF', padding: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Yeast: {beer.yeast}</Typography>
                            <Typography variant="body1">Malts: {beer.malts}</Typography>
                            <Typography variant="body1">IBU: {beer.ibu}</Typography>
                            <Typography variant="body1">Alcohol level: {beer.alcohol}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {tabValue === 3 && (
                <Box>
                    <Typography variant="h4" sx={{ margin: 2 }}>Comentarios</Typography>
                    <Typography variant="h5" sx={{ margin: 2 }}>Average Rating</Typography><AvgRating rating={beer.avg_rating} />
                    {localStorage.getItem('token') ? (
                        <div>
                            <TextField
                                label="Review Text"
                                name="text"
                                value={newReview.text}
                                onChange={handleReviewChange}
                                fullWidth
                                multiline
                                rows={4}
                                sx={{ mb: 2, backgroundColor: '#FFF', borderRadius: 1 }}
                            />
                            <Box sx={{ width: 300 }}>
                                <Slider
                                    value={newReview.rating}
                                    onChange={handleSliderChange}
                                    min={1}
                                    max={5}
                                    step={0.1}
                                    aria-label="Rating"
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                            <Button onClick={handleSubmitReview} variant="contained" sx={{ backgroundColor: '#c0874f' }}>
                                Submit Review
                            </Button>
                        </div>
                    ) : (
                        <Card sx={{ opacity: 1, marginTop: 2, backgroundColor: '#887c78', borderColor: '#f5cce0' }}>
                            <CardContent>
                                <Typography variant="body1">You must be logged in to leave a review.</Typography>
                            </CardContent>
                        </Card>
                    )}
                    <Grid container spacing={2} sx={{ marginTop: 4 }}>
                        
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <Grid item xs={12} key={review.id}>
                                    <Card sx={{ backgroundColor: '#593D30', color: '#FFF' }}>
                                        <CardContent>
                                            <Typography variant="h6"><strong>{review.user.handle}:</strong></Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ReactStars
                                                    count={5}
                                                    value={review.rating}
                                                    size={24}
                                                    isHalf={true}
                                                    edit={false}
                                                    activeColor="#C0874F"
                                                />
                                                <Typography variant="body1" sx={{ ml: 1 }}>
                                                    {review.rating}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">{review.text}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1">No reviews yet.</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}

            {/* Snackbar for error and success messages */}
            <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">{error}</Alert>
            </Snackbar>
            <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success">{success}</Alert>
            </Snackbar>
        </Box>
    );
};

export default BeerDetail;

