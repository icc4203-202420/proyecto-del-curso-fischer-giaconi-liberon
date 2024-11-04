import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Button } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

const AddAttendance = ({ bar_id, event_id, isCheckedIn, setIsCheckedIn }) => {
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    // const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [error, setError] = useState('');

    const handleCheckIn = async () => {
        setIsCheckingIn(true);
        const token = await SecureStore.getItemAsync('token');

        try {
            const response = await axios.post(
                `${API_URL}/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            setIsCheckedIn(true);
        } catch (error) {
            console.error("Error checking in:", error);
            setError('No se pudo registrar. Por favor, inténtalo de nuevo.');
        } finally {
            setIsCheckingIn(false);
        }
    };

    return (
        <View style={styles.container}>
            {isCheckingIn ? (
                <ActivityIndicator size="small" color="#c0874f" />
            ) : (
                <Button
                    title="Registrar Asistencia"
                    onPress={handleCheckIn}
                    color="#c0874f"
                />
            )}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
});

export default AddAttendance;
