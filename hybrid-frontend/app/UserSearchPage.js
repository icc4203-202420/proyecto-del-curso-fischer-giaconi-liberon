import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(JSON.parse(SecureStore.getItem('user')));
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/v1/users`);
                const data = await response.json();
                if (data) {
                    setUsers(data);
                    setFilteredUsers(data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {
        console.log(currentUser.id);
        console.log(userId);
        if (currentUser.id === userId) {
            navigation.navigate('UserProfile');
        } else {
            navigation.navigate('UserDetail', { userId: userId });
        }
    };

    const filtered = filteredUsers.filter(user =>
        user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Usuarios</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar usuarios"
                placeholderTextColor="#5d3a29"
                onChangeText={setSearchTerm}
                value={searchTerm}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#c0874f" />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleUserClick(item.id)} style={styles.card}>
                            <Avatar.Image
                                source={{ uri: item.image_url }}
                                size={50}
                                style={styles.avatar}
                            />
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{`${item.first_name} ${item.last_name}`}</Text>
                                <Text style={styles.cardDetail}>Handle: {item.handle}</Text>
                            </View>
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
        paddingTop: 50,
        padding: 16,
        backgroundColor: '#ffe5b4',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#6e4c3e',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#c0874f',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        backgroundColor: '#fff2e5',
        color: '#5d3a29',
        fontSize: 16,
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
    avatar: {
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#6e4c3e',
    },
    cardDetail: {
        fontSize: 14,
        color: '#5d3a29',
        marginBottom: 4,
    },
});

export default UserSearch;
