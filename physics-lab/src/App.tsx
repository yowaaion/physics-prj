// Импортируем необходимые компоненты и хуки
import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import { DataTable } from './components/lab/DataTable';
import { ResistanceChart } from './components/lab/ResistanceChart';
import LabDescription from './components/lab/LabDescription';
import { LabStats } from './components/lab/LabStats';

// Интерфейс для свойств компонента TabPanel
interface TabPanelProps {
    children?: React.ReactNode;  // Содержимое вкладки
    index: number;  // Индекс вкладки
    value: number;  // Текущее значение активной вкладки
}

// Компонент TabPanel - отвечает за отображение содержимого вкладки
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

// Главный компонент приложения
function App() {
    // Состояние для хранения индекса активной вкладки
    const [tabValue, setTabValue] = useState(0);

    // Обработчик изменения вкладки
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        // Контейнер с максимальной шириной lg
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                {/* Заголовок приложения */}
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Физическая лаборатория
                </Typography>
                
                {/* Компоненты описания и статистики лаборатории */}
                <LabDescription />
                <LabStats />

                {/* Панель вкладок */}
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

                {/* Содержимое вкладок */}
                <TabPanel value={tabValue} index={0}>
                    <DataTable />  {/* Таблица для ввода данных */}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <ResistanceChart />  {/* График сопротивления */}
                </TabPanel>
            </Box>
        </Container>
    );
}

export default App;
