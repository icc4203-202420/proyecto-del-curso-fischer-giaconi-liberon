import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native'; // Importación para navegación
import { API_URL } from '@env';
import axios from 'axios';

const Feed = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation(); // Hook para manejar navegación

  const fetchData = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const user = JSON.parse(await SecureStore.getItemAsync('user'));

      // Fetch imágenes
      const picturesResponse = await axios.get(`${API_URL}/api/v1/event_pictures?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pictures = picturesResponse.data;

      // Fetch reviews
      const reviewsResponse = await axios.get(`${API_URL}/api/v1/reviews?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviews = reviewsResponse.data.reviews;

      // Combinar ambos tipos de posts en una sola lista
      const combinedData = [
        ...pictures.map((pic) => ({ ...pic, type: 'picture' })),
        ...reviews.map((review) => ({ ...review, type: 'review' })),
      ];

      // Ordenar por fecha de creación (descendente)
      combinedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setData(combinedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleImagePress = (event_id) => {
    navigation.navigate('EventTabs', { event_id });
  };

  const handleReviewPress = (id) => {
    navigation.navigate('BeerTabs', { id });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c0874f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data: {error.message}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    if (item.type === 'picture') {
      return (
        <TouchableOpacity style={styles.card} onPress={() => handleImagePress(item.event_id)}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.created_at}</Text>
            <Text style={styles.cardDescription}>{item.description || 'No description available.'}</Text>
            <Text style={styles.cardSubtitle}>By: {item.user.handle || 'Anonymous'}</Text>
            <Text style={styles.cardSubtitle}>Evento: {item.event.name}</Text>
            <Text style={styles.cardSubtitle}>Bar: {item.bar.name}</Text>
            <Text style={styles.cardSubtitle}>Pais: {item.country.name}</Text>
            <Text style={styles.cardSubtitle}>Usuarios etiquetados:</Text>
            {item.tagged_users && item.tagged_users.length > 0 ? (
              item.tagged_users.map((user, index) => (
                <Text key={index} style={styles.cardDetail}>@{user.handle} </Text>
              ))
            ) : (
              <Text style={styles.cardDetail}>No tagged users.</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    } else if (item.type === 'review') {
      return (
        <TouchableOpacity style={styles.card} onPress={() => handleReviewPress(item.beer_id)}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.created_at}</Text>
            <Text style={styles.cardDescription}>{item.text}</Text>
            <Text style={styles.cardSubtitle}>Global rating: {item.beer.avg_rating}</Text>
            <Text style={styles.cardSubtitle}>Rating: {item.rating}</Text>
            <Text style={styles.cardSubtitle}>By: {item.user.handle}</Text>
            <Text style={styles.cardDescription}>{item.beer.name}</Text>
            <Text style={styles.cardHeader}>Bares donde se sirve:</Text>
            {item.bars && item.bars.length > 0 ? (
              item.bars.map((bar, index) => (
                <Text key={index} style={styles.cardDetail}>- {bar.name} ({bar.address.line1}{bar.address.line2}, {bar.address.city}, {bar.address.country.name})</Text>
              ))
            ) : (
              <Text style={styles.cardDetail}>No bars found for this beer.</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#c0874f']} />
        }
      />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#c0874f',
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#c0874f',
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6e4c3e',
  },
  cardDescription: {
    fontSize: 14,
    color: '#5d3a29',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#5d3a29',
    marginBottom: 4,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  cardDetail: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },
});

export default Feed;
