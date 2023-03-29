import {  useState } from 'react';
import './App.css';
import { Box } from '@mui/system';
import { Tab, Tabs } from '@mui/material';
import { TabPanel } from './components/tabPanel';
import { Applications } from './components/applications';
import { Resources } from './components/resurces';

function App() {
  const [value, setValue] = useState(0);
  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Application" {...a11yProps(0)} />
          <Tab label="Resources" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Applications />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Resources />
        </TabPanel>
      </Box>
    </div>
  );
}

export default App;
