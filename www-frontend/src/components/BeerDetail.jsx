import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Container, CircularProgress, TextField, Button, Snackbar, Card, CardContent, Alert } from '@mui/material';

const BeerDetail = () => {
    const { id } = useParams();
    const [beer, setBeer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ text: '', rating: '' });
    const [user, setUser] = useState(null); // Assume you have a way to fetch the current user
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);
                setBeer(response.data.beer);
                setReviews(response.data.reviews);
                // Fetch the current user to check if they are logged in
                const userResponse = await axios.get('/api/v1/users/current'); // Adjust the endpoint as needed
                setUser(userResponse.data.user);
            } catch (error) {
                console.error("Error fetching beer details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBeerDetails();
    }, [id]);

    const handleReviewChange = (e) => {
        setNewReview({
            ...newReview,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitReview = async () => {
        if (!user) {
            setError('You must be logged in to leave a review.');
            return;
        }

        try {
            await axios.post(`http://127.0.0.1:3001/api/v1/reviews`, {
                review: {
                    text: newReview.text,
                    rating: newReview.rating,
                    beer_id: id,
                }
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setSuccess('Review submitted successfully!');
            setNewReview({ text: '', rating: '' });
            // Refresh reviews
            const response = await axios.get(`http://127.0.0.1:3001/api/v1/beers/${id}`);
            setReviews(response.data.reviews);
        } catch (error) {
            setError('Error submitting review.');
            console.error("Error submitting review:", error);
        }
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
        <Container>
            <Typography variant="h4">{beer.name}</Typography>
            <Typography variant="h6">Yeast: {beer.yeast}</Typography>
            <Typography variant="body1">Malts: {beer.malts}</Typography>
            <Typography variant="body1">IBU: {beer.ibu}</Typography>
            <Typography variant="body1">Alcohol level: {beer.alcohol}</Typography>

            {/* Form and Alert */}
            {user ? (
                <div>
                    <Typography variant="h6" gutterBottom>Write a Review</Typography>
                    <TextField
                        label="Review Text"
                        name="text"
                        value={newReview.text}
                        onChange={handleReviewChange}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Rating (1-5)"
                        name="rating"
                        type="number"
                        value={newReview.rating}
                        onChange={handleReviewChange}
                        fullWidth
                        inputProps={{ min: 1, max: 5 }}
                        sx={{ mb: 2 }}
                    />
                    <Button onClick={handleSubmitReview} variant="contained" color="primary">
                        Submit Review
                    </Button>
                </div>
            ) : (
                <Card sx={{ opacity: 1, marginTop: 2, backgroundColor: '#887c78', borderColor: '#f5c6cb' }}>
                    <CardContent>
                        <Typography variant="body1" color="#c5292e">
                            You must be logged in to leave a review.
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Reviews Section */}
            <Typography variant="h5" sx={{ marginTop: 4 }}>Reviews</Typography>
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id}>
                        <Typography variant="body1"><strong>{review.user.name}:</strong> {review.text} (Rating: {review.rating})</Typography>
                    </div>
                ))
            ) : (
                <Typography variant="body1">No reviews yet</Typography>
            )}

            {/* Snackbar for Error and Success Messages */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error">
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success">
                    {success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default BeerDetail;
