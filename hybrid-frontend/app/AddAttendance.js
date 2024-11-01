import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Button } from 'react-native';

const AddAttendance = ({ bar_id, event_id, onCheckIn }) => {
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [error, setError] = useState('');

    const handleCheckIn = async () => {
        setIsCheckingIn(true);
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `${API_URL}/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setHasCheckedIn(true);
            onCheckIn(response.data.attendance);
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
