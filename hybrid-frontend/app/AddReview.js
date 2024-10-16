import React, { useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet } from 'react-native';
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
                minimumTrackTintColor="#A020F0"
                maximumTrackTintColor="#000000"
            />
            <TextInput
                style={styles.textInput}
                placeholder="Your Review"
                multiline
                numberOfLines={4}
                value={reviewText}
                onChangeText={setReviewText}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button
                onPress={handleSubmit}
                title="Submit Review"
                color="#A020F0"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    slider: {
        marginBottom: 20,
    },
    textInput: {
        height: 100,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
    },
});

export default AddReview;
