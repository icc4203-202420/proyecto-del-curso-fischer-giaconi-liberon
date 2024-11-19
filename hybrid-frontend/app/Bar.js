import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import SearchBar from './SearchBar';
import { API_URL } from '@env';

const Bars = ({ navigation }) => {
    const [bars, setBars] = useState(null);
    const [filteredBars, setFilteredBars] = useState(null);

    useEffect(() => {
        const fetchBars = async () => {
            try {
                const bar_url = `${API_URL}/api/v1/bars`;
                const response = await axios.get(bar_url);
                const data = await response.data;

                if (data.bars) {
                    setBars(data.bars);
                    setFilteredBars(data.bars);
                }
            } catch (error) {
                console.error("Error fetching bars:", error);
            }
        };

        fetchBars();
    }, []);

    const handleBarPress = (barId) => {
        navigation.navigate('Events', { bar_id: barId });
    };

    return (
        <View style={styles.container}>
            <SearchBar data={bars} setFilteredData={setFilteredBars} placeholder="Search bars..." />
            {filteredBars ? (
                <FlatList
                    data={filteredBars}
                    keyExtractor={(bar) => bar.id.toString()}
                    renderItem={({ item: bar }) => (
                        <TouchableOpacity
                            style={styles.barItem}
                            onPress={() => handleBarPress(bar.id)}
                        >
                            <Image source={{ uri: bar.image_url }} style={styles.avatar} />
                            <View style={styles.textContainer}>
                                <Text style={styles.barName}>{bar.name}</Text>
                                <Text style={styles.barAddress}>Address: {bar.address_id}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        padding: 20,
        backgroundColor: '#ffe5b4',
    },
    barItem: {
        flexDirection: 'row',
        backgroundColor: '#3A2B2A',
        color: '#FFFFFF',
        marginBottom: 8,
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    barName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    barAddress: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Bars;
