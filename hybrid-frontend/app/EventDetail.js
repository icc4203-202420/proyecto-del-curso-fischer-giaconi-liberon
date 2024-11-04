import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@env';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

import Attendance from './Attendance';
import AddAttendance from './AddAttendance';

const EventDetail = ( route ) => {
    const [ event, setEvent ] = useState(null);
    const [ bar, setBar ] = useState(null);
    const id = useRoute().params.event_id;
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ isCheckedIn, setIsCheckedIn] = useState(false);

    useEffect(() => {
        // console.log(id);
        fetchEventDetails();
    }, [id])

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`${ API_URL}/api/v1/events/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEvent(data.event);
            setBar(data.bar);
        } catch (error) {
            console.error("Error fetching event details:", error);
            setError("Error fetching event details. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A020F0"/>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {event ? (
                <>

                    {/* Event Details */}
                    <View style={styles.detailBox}>
                        <Text style={styles.sectionTitle}>Event Info</Text>
                        <Text style={styles.detail}>
                            {/* <MaterialCommunityIcons name="beer" size={20} color="#c0874f" /> */}
                            <Text style={styles.bold}> Name:</Text> {event.name}
                        </Text>
                        <Text style={styles.detail}>
                            {/* <MaterialCommunityIcons name="leaf" size={20} color="#c0874f" /> */}
                            <Text style={styles.bold}> Date:</Text> {event.date}
                        </Text>
                        <Text style={styles.detail}>
                            {/* <MaterialCommunityIcons name="yeast" size={20} color="#c0874f" /> */}
                            <Text style={styles.bold}> Description:</Text> {event.description}
                        </Text>
                        <Text style={styles.detail}>
                            {/* <MaterialCommunityIcons name="grain" size={20} color="#c0874f" /> */}
                            <Text style={styles.bold}> Bar:</Text> {bar.name}
                        </Text>
                    </View>
                    <View style={styles.detailBox}>
                        {!isCheckedIn && (
                            <AddAttendance bar_id={bar.id} event_id={event.id} isCheckedIn={isCheckedIn} setIsCheckedIn={setIsCheckedIn}/>
                        )}
                        <Attendance event_id={ id } isCheckedIn={isCheckedIn} />
                    </View>
                </>
            ) : (
                <Text style={styles.detail}>No details available for this event.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffe5b4',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe5b4',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe5b4',
    },
    errorText: {
        color: 'red',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#6e4c3e',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#c0874f',
        textAlign: 'center',
    },
    detailBox: {
        backgroundColor: '#fff2e5',
        padding: 16,
        marginBottom: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center',
        borderLeftWidth: 5,
        borderColor: '#c0874f',
    },
    detail: {
        fontSize: 16,
        color: '#5d3a29',
        marginBottom: 8,
        textAlign: 'left',
        width: '100%',
    },
    bold: {
        fontWeight: 'bold',
    },
    reviewButton: {
        backgroundColor: '#c0874f',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    reviewButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EventDetail;