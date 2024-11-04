import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Modal, FlatList, Alert, TextInput, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const EventGallery = () => {
    const [ openUploadModal, setOpenUploadModal ] = useState(false);
    const event_id = useRoute().params.event_id;
    const [selectedImage, setSelectedImage] = useState(false);
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
    }, [event_id])

    useEffect(() => {
        fetchAvailableUsers();
    }, [])

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
            // AGREGAR FUNCIONALIDAD PARA RENDERIZAR LAS IMÁGENES
            setEventPictures(response.data);
            console.log(response.data[0])
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
    
        // Asegúrate de que el URI esté correctamente formateado
        formData.append('event_picture[image]', {
            uri: selectedImage,
            name: 'image.jpg', // Asegúrate de usar un nombre de archivo correcto
            type: 'image/jpeg', // El tipo de contenido que estás subiendo
        });
        formData.append('event_picture[event_id]', eventId);
        formData.append('event_picture[user_id]', currentUser.id);
        formData.append('event_picture[description]', description);
    
        // Adjuntar usuarios etiquetados
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
    
    const renderItem = ({ item }) => {
        // console.log("Image URL:", item.image_url);  // Verificar que la URL se imprima correctamente en consola

        return (
            <TouchableOpacity onPress={() => openImageDialog(item)} style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image_url }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={(error) => console.error("Error loading image:", error)}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{item.description}</Text>
                    <Text style={styles.subtitle}>
                        by: <Text style={styles.link}>{item.user.handle}</Text>
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderTaggedUser = ({ user }) => {
        console.log(user);
        // return (
        //     <Text style={styles.subtitle}>{user.handle}</Text>
        // )
    }

    return (
        <>
            <Modal
                visible={openUploadModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setOpenUploadModal(false)}
            >
                <View style={styles.modalContainer}>
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
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    )}
                    <Button title="Cargar Imagen" onPress={() => handleImageUpload(event_id)} />
                    <Button title="Cerrar" onPress={() => setOpenUploadModal(false)} />
                </View>
            </Modal>

            <View style={styles.detailBox}>
                <Button title="SubirImagen" onPress={() => setOpenUploadModal(true)} />
            </View>
            <View style={styles.detailBox}>
                <FlatList
                    data={eventPictures}
                    keyExtractor={(item) => item.id.toString()}  // Usa el ID como clave única
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
                {detailedImage && (
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={closeModal}
                    >
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
                                <Text style={styles.modalTagTitle}>Tagged Users:</Text>
                                {detailedImage.tagged_users.length > 0 ? (
                                    detailedImage.tagged_users.map((user) => (
                                        <Text key={user.id} style={styles.taggedUser}>
                                            @{user.handle} {user.name}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={styles.notTaggedUsers}>No tagged users</Text>
                                )}
                                <Button title="Close" onPress={closeModal} color="#c0874f" />
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        </>
    )
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
    descriptionInput: {
        width: '80%',
        borderColor: '#c0874f',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        backgroundColor: '#fff',
        color: '#5d3a29',
    },
    imagePreview: {
        width: '80%',
        height: 200,
        marginVertical: 16,
    },
    listContainer: {
        width: '100%',
        paddingVertical: 10,
    },
    imageContainer: {
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: '#fff2e5',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1.5,
    },
    infoContainer: {
        padding: 10,
        backgroundColor: '#ffe5b4',
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5d3a29',
    },
    subtitle: {
        fontSize: 14,
        color: '#5d3a29',
    },
    link: {
        color: '#c0874f',
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para el modal
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#5d3a29',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#5d3a29',
        marginBottom: 20,
    },

    modalTagTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5d3a29',
        marginBottom: 10,
    },
    taggedUser: {
        fontSize: 14,
        color: '#5d3a29',
    },
    noTaggedUsers: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
        marginBottom: 10,
    },
})