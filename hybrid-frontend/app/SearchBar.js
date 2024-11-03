import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ data, setFilteredData, placeholder }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (data) {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [query, data, setFilteredData]);

  const handleSearch = (text) => {
    setQuery(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleSearch}
        placeholder={placeholder}
        placeholderTextColor="#000" // Change the placeholder text color
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 600,
    marginHorizontal: 'auto', // Center the search bar
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    color: '#000', // Text color
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
});

export default SearchBar;
