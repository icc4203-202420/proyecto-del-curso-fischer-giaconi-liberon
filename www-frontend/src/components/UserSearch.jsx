import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container, List, ListItem, ListItemText, CircularProgress, Grid, Avatar } from '@mui/material';
import SearchUserBar from './SearchUserBar';
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const user_url = 'http://127.0.0.1:3001/api/v1/users';
                const response = await axios.get(user_url);
                const data = response.data;

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
        navigate(`/users/${userId}`);
    };

    return (
        <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
            <SearchUserBar data={users} setFilteredData={setFilteredUsers} placeholder="Search users..." />
            {loading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
                    <CircularProgress />
                </Grid>
            ) : (
                <List>
                    {filteredUsers.map((user) => (
                        <ListItem
                            key={user.id}
                            style={{ backgroundColor: '#3A2B2A', color: '#FFFFFF', marginBottom: '8px', paddingLeft: '25px' }}
                            onClick={() => handleUserClick(user.id)}
                            alignItems="center"
                        >
                            <Avatar
                                src={user.image_url}
                                alt={user.first_name}
                                style={{ marginRight: '16px' }}
                            />
                            <ListItemText
                                primary={
                                    <Typography variant="h6" style={{ color: '#FFFFFF' }}>
                                        {`${user.first_name} ${user.last_name}`}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" style={{ color: '#FFFFFF' }}>
                                        Handle: {user.handle}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default UserSearch;
