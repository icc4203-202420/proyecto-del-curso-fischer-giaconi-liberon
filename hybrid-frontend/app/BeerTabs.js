import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BeerDetail from './BeerDetail';
import BeerReview from './BeerReview';
import { useRoute, useNavigation } from '@react-navigation/native';

const initialLayout = { width: Dimensions.get('window').width };

const BeerTabs = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

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
      {/* Botón "Back" */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
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
  backButton: {
    padding: 10,
    backgroundColor: '#c0874f',
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BeerTabs;
