import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, Button, ScrollView, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AddReview from './AddReview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const BeerReview = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) {
                setError("No beer ID provided.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/v1/beers/${id}`);
                setReviews(response.data.reviews);
            } catch (error) {
                setError("Error fetching reviews");
                Alert.alert("Error", "No se pudieron cargar las reseñas. Inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [id]);

    const handleNewReview = (newReview) => {
        setReviews((prevReviews) => [newReview, ...prevReviews]);
        setTabIndex(0);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#c0874f" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {tabIndex === 0 ? (
                <ScrollView>
                    <Text style={styles.title}>Reviews</Text>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <View key={index} style={styles.reviewContainer}>
                                <Text style={styles.reviewUser}>{review.user.handle} | Rating: {review.rating} / 5</Text>
                                <Text>{review.text}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>No reviews yet.</Text>
                    )}
                </ScrollView>
            ) : (
                <AddReview id={id} onNewReview={handleNewReview} />
            )}

            {/* Button for toggling between reviews and add review form */}
            <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setTabIndex(tabIndex === 0 ? 1 : 0)}
            >
                <Text style={styles.buttonText}>
                    {tabIndex === 0 ? "Add Review" : "View Reviews"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffe5b4',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#6e4c3e',
        textAlign: 'center',
    },
    reviewContainer: {
        backgroundColor: '#fff2e5',
        padding: 16,
        marginBottom: 16,
        borderRadius: 10,
        borderLeftWidth: 5,
        borderColor: '#c0874f',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    reviewUser: {
        fontWeight: 'bold',
        color: '#5d3a29',
        marginBottom: 8,
    },
    toggleButton: {
        backgroundColor: '#c0874f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        backgroundColor: '#c0874f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BeerReview;
