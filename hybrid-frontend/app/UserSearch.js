import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const SearchUserBar = ({ data, setFilteredData, placeholder }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (data) {
            const filtered = data.filter(item =>
                item.handle.toLowerCase().includes(query.toLowerCase())
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
                placeholderTextColor="#888"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        width: '100%',
        maxWidth: 600,
        marginHorizontal: 'auto',
        marginBottom: 16,
    },
    input: {
        height: 40,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderColor: '#ccc',
        borderWidth: 1,
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default SearchUserBar;
