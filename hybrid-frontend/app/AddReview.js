import React, { useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const AddReview = ({ id, onNewReview }) => {
    const [rating, setRating] = useState(3);
    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (reviewText.length <= 15) {
            setError('The review must be at least 15 characters long.');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        const aux_user = await AsyncStorage.getItem('user');
        user = aux_user ? JSON.parse(aux_user) : null;

        try {
            const response = await axios.post(
                `${API_URL}/api/v1/beers/${id}/reviews`,
                {
                    review: {
                        text: reviewText,
                        rating: rating,
                    },
                    user_id: user.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }         
                }
            );
            console.log(response);
            onNewReview(response.data);
            setReviewText('');
            setRating(3);  
        } catch (error) {
            console.error("Error submitting review:", error);
            setError('Failed to submit review. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Your Review</Text>
            
            <Slider
                style={styles.slider}
                value={rating}
                onValueChange={setRating}
                minimumValue={1}
                maximumValue={5}
                step={0.1}
                minimumTrackTintColor="#c0874f"
                maximumTrackTintColor="#000000"
                thumbTintColor="#c0874f"
            />
            <Text style={styles.ratingText}>Rating: {rating.toFixed(1)}</Text>
            
            <TextInput
                style={styles.textInput}
                placeholder="Your Review"
                multiline
                numberOfLines={4}
                value={reviewText}
                onChangeText={setReviewText}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Review</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#ffe5b4',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6e4c3e',
        marginBottom: 20,
        textAlign: 'center',
    },
    slider: {
        marginBottom: 20,
    },
    ratingText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#5d3a29',
    },
    textInput: {
        height: 100,
        borderColor: '#c0874f',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff2e5',
        marginBottom: 10,
        color: '#5d3a29',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#c0874f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddReview;
