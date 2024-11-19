import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { API_URL, WS_URL } from '@env';
import axios from 'axios';
import ActionCable from 'react-native-actioncable';

// Crear consumidor único
const cable = ActionCable.createConsumer(`${WS_URL}/cable`);

const Feed = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting');
  const navigation = useNavigation();

  const fetchData = useCallback(async (token, user) => {
    try {
      const picturesResponse = await axios.get(`${API_URL}/api/v1/event_pictures?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pictures = picturesResponse.data;

      const reviewsResponse = await axios.get(`${API_URL}/api/v1/reviews?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviews = reviewsResponse.data.reviews;

      const combinedData = [
        ...pictures.map((pic) => ({ ...pic, type: 'event_picture' })),
        ...reviews.map((review) => ({ ...review, type: 'review' })),
      ];

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
    let subscription;

    const setupCable = async (token, user) => {
      subscription = cable.subscriptions.create(
        { channel: 'FeedChannel', user_id: user.id },
        {
          connected() {
            console.log('Connected to ActionCable');
            setConnectionStatus('Connected');
          },
          disconnected() {
            console.log('Disconnected from ActionCable');
            setConnectionStatus('Disconnected');
          },
          received(newData) {
            console.log('Received new data:', newData);

            const itemType = newData.review ? 'review' : 'event_picture';
            const newItem = { ...newData[itemType], type: itemType };

            setData((prevData) => {
              const exists = prevData.some(
                (item) => item.id === newItem.id && item.type === newItem.type
              );
              if (!exists) {
                const updatedData = [newItem, ...prevData];
                return updatedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
              }
              return prevData;
            });
          },
        }
      );
    };

    const initialize = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const userJSON = await SecureStore.getItemAsync('user');

        if (token && userJSON) {
          const user = JSON.parse(userJSON);
          await fetchData(token, user);
          setupCable(token, user);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();

    return () => {
      if (subscription) {
        console.log('Unsubscribing from ActionCable');
        subscription.unsubscribe();
      }
    };
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    const token = await SecureStore.getItemAsync('token');
    const userJSON = await SecureStore.getItemAsync('user');

    if (token && userJSON) {
      const user = JSON.parse(userJSON);
      await fetchData(token, user);
    }
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
    if (item.type === 'event_picture') {
      return (
        <TouchableOpacity style={styles.card} onPress={() => handleImagePress(item.event.id)}>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#c0874f']} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, padding: 16, backgroundColor: '#ffe5b4' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#c0874f' },
  card: { flexDirection: 'row', padding: 16, borderWidth: 1, borderColor: '#c0874f', borderRadius: 10, marginBottom: 16, backgroundColor: '#fff' },
  image: { width: 100, height: 100, marginRight: 16, borderRadius: 8 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#6e4c3e' },
  cardDescription: { fontSize: 14, color: '#5d3a29', marginBottom: 4 },
  cardDetail: { fontSize: 12, color: '#7a5e4a' },
});

export default Feed;
