import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@env';

const Beer = () => {
    const [beers, setBeers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBeers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/beers`);
                const data = await response.json();
                if (data.beers) {
                    setBeers(data.beers);
                }
            } catch (error) {
                console.error("Error fetching beers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBeers();
    }, []);

    const handleCardClick = (id) => {
        navigation.navigate('BeerTabs', { id });

        // navigation.navigate('BeerDetail', { id });
    };

    const filteredBeers = beers.filter(beer =>
        beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Cervezas</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar cervezas"
                placeholderTextColor="#5d3a29"
                onChangeText={setSearchTerm}
                value={searchTerm}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#A020F0" />
            ) : (
                <FlatList
                    data={filteredBeers}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleCardClick(item.id)} style={styles.card}>
                            <MaterialCommunityIcons name="beer" size={48} color="#A020F0" />
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardDetail}>Yeast: {item.yeast}</Text>
                            <Text style={styles.cardDetail}>Malts: {item.malts}</Text>
                            <Text style={styles.cardDetail}>Alcohol level: {item.alcohol}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffe5b4', 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#6e4c3e',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#c0874f', 
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        color: '#5d3a29',
    },
    card: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#c0874f', 
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: '#fff', 
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#6e4c3e',
    },
    cardDetail: {
        fontSize: 14,
        color: '#5d3a29',
    },
});

export default Beer;
