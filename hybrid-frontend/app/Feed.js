import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

const Feed = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        
        // Fetch imágenes
        const picturesResponse = await fetch(`${API_URL}/api/v1/event_pictures`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pictures = await picturesResponse.json();

        // Fetch reviews
        const reviewsResponse = await fetch(`${API_URL}/api/v1/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reviews_aux = await reviewsResponse.json();
        const reviews = reviews_aux.reviews;

        // Combinar ambos tipos de posts en una sola lista
        const combinedData = [
          ...pictures.map((pic) => ({ ...pic, type: 'picture' })),
          ...reviews.map((review) => ({ ...review, type: 'review' })),
        ];

        // Ordenar por fecha de creación (asumiendo que ambos tipos tienen `created_at`)
        combinedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setData(combinedData);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error fetching data: {error.message}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    if (item.type === 'picture') {
      return (
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.description}>{item.description || 'No description available.'}</Text>
            <Text style={styles.userName}>By: {item.user?.name || 'Anonymous'}</Text>
          </View>
        </View>
      );
    } else if (item.type === 'review') {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.reviewText}>{item.text}</Text>
            <Text style={styles.rating}>Rating: {item.rating}</Text>
            <Text style={styles.userName}>By: User {item.user_id}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
    />
  );
};

const styles = StyleSheet.create({
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
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  rating: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
});

export default Feed;
