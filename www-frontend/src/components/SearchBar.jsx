import React, { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';

const SearchBar = ({ data, setFilteredData, placeholder }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (data) {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [query, data, setFilteredData]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',          
        justifyContent: 'center', 
        width: '100%',
        maxWidth: 600,             
        mx: 'auto',               
        mb: 4,
      }}
    >
      <TextField
        variant="outlined"
        value={query}
        onChange={handleSearch}
        placeholder={placeholder}
        fullWidth
        sx={{
          '& .MuiInputLabel-root': { color: '#000000' },
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            '& fieldset': { borderColor: '#ccc' },
            '&:hover fieldset': { borderColor: '#aaa' },
            '&.Mui-focused fieldset': { borderColor: '#000' },
          },
          '& .MuiInputBase-root': { color: '#000000' },
          backgroundColor: '#ffffff', 
          borderRadius: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        }}
      />
    </Box>
  );
};

export default SearchBar;
