import React, { useState } from 'react';
import { Box, Tabs, Tab, Container } from '@mui/material';
import Beers from './Beer';
import Bars from './Bar';

const Explore = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{
            borderBottom: '1px solid #c0874f', // Bottom border color
            '& .MuiTabs-indicator': {
              backgroundColor: 'transparent', // Hide default indicator
            },
            '& .MuiTab-root': {
              borderRadius: '8px',
              color: '#c0874f', // Default tab text color
              backgroundColor: '#fff', // Default tab background color
              margin: '0 4px', // Spacing between tabs
              textTransform: 'none', // Prevent uppercase transformation
              '&:hover': {
                backgroundColor: '#f5f5f5', // Hover background color
                color: '#c0874f', // Hover text color
              },
            },
            '& .Mui-selected': {
              backgroundColor: '#c0874f', // Selected tab background color
              color: '#fff !important', // Force selected tab text color to white
              '&:hover': {
                backgroundColor: '#c0874f', // Maintain selected tab background color on hover
              },
            },
          }}
        >
          <Tab label="Beers" />
          <Tab label="Bars" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {value === 0 && <Beers />}
          {value === 1 && <Bars />}
        </Box>
      </Box>
    </Container>
  );
};

export default Explore;
