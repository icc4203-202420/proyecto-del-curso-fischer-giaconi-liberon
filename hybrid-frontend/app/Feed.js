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
      console.log(reviews)

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

  const handleImagePress = ( event_id ) => {
    navigation.navigate("EventTabs", { event_id });
  };

  const handleReviewPress = ( id ) => {
    navigation.navigate('BeerTabs', { id });
  }

  if (loading && !refreshing) {
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
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={ () => handleImagePress(item.event_id) }
        >
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.description}>{item.description || 'No description available.'}</Text>
            <Text style={styles.userName}>By: {item.user?.name || 'Anonymous'}</Text>
          </View>
        </TouchableOpacity>
      );
    } else if (item.type === 'review') {
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={ () => handleReviewPress(item.beer_id) } // Navega a la cerveza
        >
          <View style={styles.textContainer}>
            <Text style={styles.reviewText}>{item.created_at}</Text>
            <Text style={styles.reviewText}>{item.text}</Text>
            <Text style={styles.rating}>Rating: {item.rating}</Text>
            <Text style={styles.userName}>By: User {item.user_id}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0000ff']}
        />
      }
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
