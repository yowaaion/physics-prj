import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import { DataTable } from './components/lab/DataTable';
import { ResistanceChart } from './components/lab/ResistanceChart';
import LabDescription from './components/lab/LabDescription';
import { LabStats } from './components/lab/LabStats';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`lab-tabpanel-${index}`}
            aria-labelledby={`lab-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function App() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Физическая лаборатория
                </Typography>
                
                <LabDescription />
                <LabStats />

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="lab tabs"
                        centered
                    >
                        <Tab label="Ввод данных" id="lab-tab-0" />
                        <Tab label="График" id="lab-tab-1" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <DataTable />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <ResistanceChart />
                </TabPanel>
            </Box>
        </Container>
    );
}

export default App;
