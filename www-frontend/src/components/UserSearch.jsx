import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, List, ListItem, ListItemText, CircularProgress, Grid } from '@mui/material';
import SearchBar from './SearchBar';

const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/api/v1/users');
                console.log("Usuarios obtenidos:", response.data);
                setUsers(response.data);
                setFilteredUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (query) => {
        if (query) {
            const filtered = users.filter(user => 
                user.handle.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    return (
        <Container>
            <SearchBar onSearch={handleSearch} placeholder="Buscar usuarios..." />
            {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress />
                </Grid>
            ) : (
                <List>
                    {filteredUsers.map(user => (
                        <ListItem key={user.id}>
                            <ListItemText
                                primary={<Typography variant="h6">{user.first_name} {user.last_name}</Typography>}
                                secondary={<Typography variant="body2">{user.email}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default UserSearch;
