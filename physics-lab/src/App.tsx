// Импортируем необходимые компоненты и хуки
import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Tabs, 
    Tab, 
    Paper, 
    Divider,
    Grid,
    Card,
    CardContent,
    Button,
    Collapse,
    IconButton,
    useTheme
} from '@mui/material';
import { DataTable } from './components/lab/DataTable';
import { ResistanceChart } from './components/lab/ResistanceChart';
import { AcousticChart } from './components/lab/AcousticChart';
import { LabTheory } from './components/lab/LabTheory';
import { FrequencyDependenceChart } from './components/lab/FrequencyDependenceChart';
import { LabStats } from './components/lab/LabStats';
import { MeasurementsProvider } from './context/MeasurementsContext';

// Иконки
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DataArrayIcon from '@mui/icons-material/DataArray';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    const theme = useTheme();
    // Состояние для хранения индекса активной вкладки
    const [tabValue, setTabValue] = useState(0);
    const [theoryExpanded, setTheoryExpanded] = useState(false);

    // Обработчик изменения вкладки
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const toggleTheory = () => {
        setTheoryExpanded(!theoryExpanded);
    };

    return (
        <MeasurementsProvider>
            <Container maxWidth="lg">
                <Box sx={{ my: 4 }}>
                    {/* Заголовок приложения */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 3, 
                            mb: 4, 
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 500 }}>
                            Акустооптический метод измерения скорости распространения и затухания ультразвуковых волн
                        </Typography>
                        
                        {/* Компоненты описания и статистики лаборатории */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <ScienceIcon color="primary" /> Лабораторная работа
                                        </Typography>
                                        <Typography variant="body2">
                                            Данная лабораторная работа предназначена для изучения акустооптических свойств кристаллов и 
                                            измерения затухания ультразвуковых волн при различных условиях. Работа включает измерение 
                                            зависимости электрического сопротивления от температуры и акустооптические измерения затухания.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LabStats />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Научный контекст и теория */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            mb: 4, 
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                            <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MenuBookIcon color="primary" /> Теоретическая основа и опытные данные
                            </Typography>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={toggleTheory}
                                endIcon={<ExpandMoreIcon sx={{ transform: theoryExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />}
                            >
                                {theoryExpanded ? 'Свернуть' : 'Развернуть'} теорию
                            </Button>
                        </Box>
                        <Collapse in={theoryExpanded}>
                            <Box sx={{ p: 3 }}>
                                <LabTheory />
                            </Box>
                        </Collapse>
                        <Divider />
                        <Box sx={{ p: 3 }}>
                            <FrequencyDependenceChart />
                        </Box>
                    </Paper>

                    {/* Панель вкладок для практической части */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider',
                            bgcolor: 'rgba(25, 118, 210, 0.05)',
                            '& .MuiTabs-flexContainer': {
                                justifyContent: 'center'
                            },
                            '& .MuiTab-root': {
                                fontWeight: 'medium',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                },
                                py: 2
                            }
                        }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="lab tabs"
                                centered
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        height: 3,
                                        borderTopLeftRadius: 3,
                                        borderTopRightRadius: 3
                                    }
                                }}
                            >
                                <Tab 
                                    label="Ввод данных" 
                                    id="lab-tab-0" 
                                    icon={<DataArrayIcon />}
                                    iconPosition="start"
                                />
                                <Tab 
                                    label="График сопротивления" 
                                    id="lab-tab-1" 
                                    icon={<ShowChartIcon />}
                                    iconPosition="start"
                                />
                                <Tab 
                                    label="График затухания" 
                                    id="lab-tab-2" 
                                    icon={<ShowChartIcon />}
                                    iconPosition="start"
                                />
                            </Tabs>
                        </Box>

                        {/* Содержимое вкладок */}
                        <Box sx={{ p: 3 }}>
                            <TabPanel value={tabValue} index={0}>
                                <DataTable />  {/* Таблица для ввода данных */}
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <ResistanceChart />  {/* График сопротивления */}
                            </TabPanel>
                            <TabPanel value={tabValue} index={2}>
                                <AcousticChart />  {/* График затухания */}
                            </TabPanel>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </MeasurementsProvider>
    );
}

export default App;
