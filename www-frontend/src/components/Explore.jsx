import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Beers from './Beer';
import Bars from './Bar';

const CustomTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `2px solid #C0874F`,
  borderTop: `2px solid #C0874F`,
  '.MuiTabs-indicator': {
    backgroundColor: '#C0874F',
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  color: '#FFF',
  '&.Mui-selected': {
    color: '#C0874F',
  },
}));

const Explore = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%' }}>
        <CustomTabs
          value={value}
          onChange={handleChange}
          centered
          textColor="secondary"
        >
          <CustomTab label="Beers" />
          <CustomTab label="Bars" />
        </CustomTabs>
        <Box sx={{ p: 3 }}>
          {value === 0 && <Beers />}
          {value === 1 && <Bars />}
        </Box>
      </Box>
    </Container>
  );
};

export default Explore;
