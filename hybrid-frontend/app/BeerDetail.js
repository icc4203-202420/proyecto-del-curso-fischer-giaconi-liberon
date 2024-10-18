import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
            {beer ? (
                <>

                    {/* Beer Details */}
                    <View style={styles.detailBox}>
                        <Text style={styles.sectionTitle}>Beer Info</Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="beer" size={20} color="#c0874f" />
                            <Text style={styles.bold}> Style:</Text> {beer.style}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="leaf" size={20} color="#c0874f" />
                            <Text style={styles.bold}> Hop:</Text> {beer.hop}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="yeast" size={20} color="#c0874f" />
                            <Text style={styles.bold}> Yeast:</Text> {beer.yeast}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="grain" size={20} color="#c0874f" />
                            <Text style={styles.bold}> Malts:</Text> {beer.malts}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="gauge" size={20} color="#c0874f" />
                            <Text style={styles.bold}> IBU:</Text> {beer.ibu}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="glass-pint-outline" size={20} color="#c0874f" />
                            <Text style={styles.bold}> Alcohol Level:</Text> {beer.alcohol}%
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="water-outline" size={20} color="#c0874f" />
                            <Text style={styles.bold}> BLG:</Text> {beer.blg}
                        </Text>
                        <Text style={styles.detail}>
                            <MaterialCommunityIcons name="star-outline" size={20} color="#c0874f" />
                            <Text style={styles.bold}> Average Rating:</Text> {beer.avg_rating ? beer.avg_rating.toFixed(1) : 'No ratings yet'}
                        </Text>

                        {brewery && (
                            <Text style={styles.detail}>
                                <MaterialCommunityIcons name="factory" size={20} color="#c0874f" />
                                <Text style={styles.bold}> Brewery:</Text> {brewery.name} (Established: {brewery.estdate})
                            </Text>
                        )}
                    </View>

                    {/* Bars Serving the Beer */}
                    <View style={styles.detailBox}>
                        <Text style={styles.sectionTitle}>Bars Serving This Beer</Text>
                        {bars.length > 0 ? (
                            <>
                                {bars.map(bar => (
                                    <Text key={bar.id} style={styles.detail}>
                                        <MaterialCommunityIcons name="map-marker" size={20} color="#c0874f" /> {bar.name} (Location: {bar.latitude}, {bar.longitude})
                                    </Text>
                                ))}
                            </>
                        ) : (
                            <Text style={styles.detail}>No bars serving this beer.</Text>
                        )}
                    </View>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#6e4c3e',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#c0874f',
        textAlign: 'center',
    },
    detailBox: {
        backgroundColor: '#fff2e5',
        padding: 16,
        marginBottom: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center',
        borderLeftWidth: 5,
        borderColor: '#c0874f',
    },
    detail: {
        fontSize: 16,
        color: '#5d3a29',
        marginBottom: 8,
        textAlign: 'left',
        width: '100%',
    },
    bold: {
        fontWeight: 'bold',
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
