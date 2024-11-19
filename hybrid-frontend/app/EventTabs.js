import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { View, Dimensions, StyleSheet } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { API_URL } from '@env';

import EventDetail from "./EventDetail";
import EventGallery from "./EventGallery";
// import axios from "axios";


const initialLayout = { width: Dimensions.get('window').width };


const EventTabs = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const id = route.params.event_id;

    const [ event, setEvent ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/api/v1/events/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEvent(data.event);
        } catch (error) {
            console.error('Error fething event details:', error);
            setError('Error fetching event details. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const [ index, setIndex ] = useState(0);
    const [ routes ] = useState([
        { key: 'details', title: 'Details' },
        { key: 'gallery', title: 'Gallery' },
    ]);

    const renderScene = SceneMap({
        details: () => <EventDetail id={id} />,
        gallery: () => <EventGallery id={id} />,
    });

    const renderTabEvent = props => (
        <TabBar
            {...props}
            indicatorStyle={[styles.indicator, { backgroundColor: '#c0874f' }]} // Cambiar el color del indicador
            style={styles.tabBar}
            labelStyle={[styles.tabLabel, { color: '#c0874f' }]} // Cambiar el color del texto de las tabs
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                {event && <Text style={styles.title}>{event.name}</Text>}
            
            </View>
            
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabEvent={renderTabEvent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 35,
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
        color: '#c0874f',
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
        backgroundColor: '#ffe5b4', // Mantén el fondo de la tabBar en un color claro
    },
    tabLabel: {
        fontWeight: 'bold',
    },
    indicator: {
        backgroundColor: '#c0874f', // Color del indicador
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        margin: 10,
    },
});

export default EventTabs;

