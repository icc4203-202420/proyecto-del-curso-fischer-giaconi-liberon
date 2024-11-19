import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Modal, FlatList, Alert, TextInput, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const EventGallery = () => {
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const event_id = useRoute().params.event_id;
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [eventPictures, setEventPictures] = useState([]);
    const [detailedImage, setDetailedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchEventPictures(event_id);
    }, [event_id]);

    useEffect(() => {
        fetchAvailableUsers();
    }, []);

    const fetchAvailableUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/users`);
            setAvailableUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const addTaggedUser = (user) => {
        if (!taggedUsers.some(taggedUser => taggedUser.id === user.id)) {
            setTaggedUsers([...taggedUsers, user]);
        }
        setSearchText('');
        setFilteredUsers([]);
    };

    const removeTaggedUser = (userId) => {
        setTaggedUsers(taggedUsers.filter(user => user.id !== userId));
    };

    const fetchEventPictures = async (eventId) => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/event_pictures?event_id=${eventId}`);
            setEventPictures(response.data);
        } catch (error) {
            console.error('Error fetching event pictures:', error);
        }
    };

    const handleImageUpload = async (eventId) => {
        if (!selectedImage) {
            Alert.alert('Error', 'Por favor, selecciona una imagen antes de cargarla.');
            return;
        }

        const currentUser = JSON.parse(await SecureStore.getItemAsync('user'));
        const formData = new FormData();

        formData.append('event_picture[image]', {
            uri: selectedImage,
            name: 'image.jpg',
            type: 'image/jpeg',
        });
        formData.append('event_picture[event_id]', eventId);
        formData.append('event_picture[user_id]', currentUser.id);
        formData.append('event_picture[description]', description);

        taggedUsers.forEach((user) => {
            formData.append('event_picture[tagged_users][]', user.id);
        });

        try {
            const response = await axios.post(`${API_URL}/api/v1/event_pictures`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Imagen cargada exitosamente', `Imagen ID: ${response.data.id}`);
            setOpenUploadModal(false);
            setSelectedImage(null);
            setDescription('');
            setTaggedUsers([]);
        } catch (error) {
            console.error('Error uploading image:', error.response.data);
            Alert.alert('Error', 'No se pudo cargar la imagen. Intenta nuevamente.');
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = availableUsers.filter(user => 
            user.handle.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const openImageDialog = (item) => {
        setDetailedImage(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setDetailedImage(null);
        setModalVisible(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openImageDialog(item)} style={styles.imageContainer}>
            <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.description}</Text>
                <Text style={styles.subtitle}>
                    by: <Text style={styles.link}>{item.user.handle}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <Modal visible={openUploadModal} animationType="slide" transparent={true} onRequestClose={() => setOpenUploadModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Descripción"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar usuario para etiquetar"
                            value={searchText}
                            onChangeText={handleSearch}
                        />
                        {filteredUsers.length > 0 && (
                            <View style={styles.dropdown}>
                                {filteredUsers.map((user) => (
                                    <TouchableOpacity
                                        key={user.id}
                                        style={styles.dropdownItem}
                                        onPress={() => addTaggedUser(user)}
                                    >
                                        <Text>{user.handle}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        <View style={styles.taggedUsersContainer}>
                            {taggedUsers.map((user) => (
                                <View key={user.id} style={styles.taggedUser}>
                                    <Text>{user.handle}</Text>
                                    <TouchableOpacity onPress={() => removeTaggedUser(user.id)}>
                                        <MaterialCommunityIcons name="close" size={16} color="red" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                        <Button title="Seleccionar Imagen" onPress={pickImage} />
                        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
                        <Button title="Cargar Imagen" onPress={() => handleImageUpload(event_id)} />
                        <Button title="Cerrar" onPress={() => setOpenUploadModal(false)} />
                    </View>
                </View>
            </Modal>

            <View style={styles.detailBox}>
                <Button title="Subir Imagen" onPress={() => setOpenUploadModal(true)} />
            </View>

            <FlatList
                data={eventPictures}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            {detailedImage && (
                <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: detailedImage.image_url }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.modalTitle}>{detailedImage.description}</Text>
                            <Text style={styles.modalSubtitle}>
                                by: <Text style={styles.link}>{detailedImage.user.handle}</Text>
                            </Text>
                            <Button title="Cerrar" onPress={closeModal} color="#c0874f" />
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};

export default EventGallery;

const styles = StyleSheet.create({
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    descriptionInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    dropdown: {
        maxHeight: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        padding: 8,
    },
    dropdownItem: {
        padding: 8,
    },
    taggedUsersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    taggedUser: {
        backgroundColor: '#ddd',
        padding: 5,
        margin: 5,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginVertical: 10,
        borderRadius: 8,
    },
    listContainer: {
        padding: 16,
    },
    imageContainer: {
        marginBottom: 16,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
    },
    infoContainer: {
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtitle: {
        color: '#777',
        fontSize: 14,
    },
    link: {
        color: '#3498db',
    },
    modalImage: {
        width: '100%',
        height: 300,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalSubtitle: {
        color: '#777',
    },
});
