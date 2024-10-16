import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const BeerDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params; 
    const [beer, setBeer] = useState(null);
    const [brewery, setBrewery] = useState(null);
    const [bars, setBars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchBeerDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/beers/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBeer(data.beer);
                setBrewery(data.brewery);
                setBars(data.bars);
            } catch (error) {
                console.error("Error fetching beer details:", error);
                setError("Error fetching beer details. Please try again later."); 
            } finally {
                setLoading(false);
            }
        };
        fetchBeerDetails();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A020F0" />
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
        <ScrollView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
                    
            {beer ? (
                <>
                    <Text style={styles.title}>Beer Details</Text>
                    <Text style={styles.detail}><strong>Name:</strong> {beer.name}</Text>
                    <Text style={styles.detail}><strong>Style:</strong> {beer.style}</Text>
                    <Text style={styles.detail}><strong>Hop:</strong> {beer.hop}</Text>
                    <Text style={styles.detail}><strong>Yeast:</strong> {beer.yeast}</Text>
                    <Text style={styles.detail}><strong>Malts:</strong> {beer.malts}</Text>
                    <Text style={styles.detail}><strong>IBU:</strong> {beer.ibu}</Text>
                    <Text style={styles.detail}><strong>Alcohol Level:</strong> {beer.alcohol}</Text>
                    <Text style={styles.detail}><strong>BLG:</strong> {beer.blg}</Text>
                    <Text style={styles.detail}>
                        <strong>Average Rating:</strong> {beer.avg_rating ? beer.avg_rating.toFixed(1) : 'No ratings yet'}
                    </Text>

                    {brewery && (
                        <Text style={styles.detail}>
                            <strong>Brewery:</strong> {brewery.name} (Established: {brewery.estdate})
                        </Text>
                    )}

                    {bars.length > 0 ? (
                        <View>
                            <Text style={styles.detail}><strong>Bars Serving This Beer:</strong></Text>
                            {bars.map(bar => (
                                <Text key={bar.id} style={styles.detail}>
                                    - {bar.name} (Location: {bar.latitude}, {bar.longitude})
                                </Text>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.detail}>No bars serving this beer.</Text>
                    )}
                    
                    <TouchableOpacity 
                        style={styles.reviewButton} 
                        onPress={() => navigation.navigate('BeerReview', { id })}
                    >
                        <Text style={styles.reviewButtonText}>View Reviews</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.detail}>No details available for this beer.</Text>
            )}
        </ScrollView>
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
        backgroundColor: '#ffe5b4',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe5b4',
    },
    errorText: {
        color: 'red',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#6e4c3e',
    },
    detail: {
        fontSize: 16,
        marginBottom: 8,
        color: '#5d3a29',
    },
    backButton: {
        padding: 10,
        backgroundColor: '#c0874f',
        borderRadius: 5,
        marginBottom: 16,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    reviewButton: {
        backgroundColor: '#c0874f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    reviewButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BeerDetail;
