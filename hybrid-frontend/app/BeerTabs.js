import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BeerDetail from './BeerDetail';
import BeerReview from './BeerReview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const initialLayout = { width: Dimensions.get('window').width };

const BeerTabs = () => {
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
        console.error('Error fetching beer details:', error);
        setError('Error fetching beer details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBeerDetails();
  }, [id]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'details', title: 'Details' },
    { key: 'reviews', title: 'Reviews' },
  ]);

  const renderScene = SceneMap({
    details: () => <BeerDetail id={id} />,
    reviews: () => <BeerReview id={id} />,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Display Beer Name as Title */}
        {beer && <Text style={styles.title}>{beer.name}</Text>}
      </View>

      {/* Error Handling */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5b4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    padding: 10,
    backgroundColor: '#c0874f',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#fff2e5',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center', 
  },
  tabBar: {
    backgroundColor: '#c0874f',
  },
  tabLabel: {
    fontWeight: 'bold',
    color: '#fff',
  },
  indicator: {
    backgroundColor: '#ffe5b4',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 10,
  },
});

export default BeerTabs;
