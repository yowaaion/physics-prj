import React, { useState, useMemo } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    useTheme, 
    Divider, 
    Tabs, 
    Tab,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    FormControlLabel,
    Switch,
    Stack
} from '@mui/material';
import { Scatter } from 'react-chartjs-2';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DataArrayIcon from '@mui/icons-material/DataArray';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScienceIcon from '@mui/icons-material/Science';
import TuneIcon from '@mui/icons-material/Tune';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip as ChartTooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    ChartTooltip,
    Legend
);

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
            id={`frequency-tabpanel-${index}`}
            aria-labelledby={`frequency-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
}

/**
 * Компонент для отображения графика частотной зависимости коэффициентов затухания
 * в соответствии с рисунком из документа
 */
export const FrequencyDependenceChart: React.FC = () => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [selectedSeries, setSelectedSeries] = useState<number[]>([0, 1, 2, 3]);
    const [showFittingCurves, setShowFittingCurves] = useState(true);
    const [frequencyRange, setFrequencyRange] = useState<[number, number]>([3, 13]);

    // Данные для графика из рисунка 21 в документе
    // Частотные зависимости коэффициентов α^2_L при разных условиях
    const experimentalData = [
        {
            label: 'Комнатная температура, окрашенный кристалл',
            symbol: '●',
            color: '#1976d2',
            pointStyle: 'circle',
            data: [
                { x: 3, y: 1.5 },
                { x: 5, y: 3 },
                { x: 7, y: 5 },
                { x: 9, y: 8 },
                { x: 11, y: 11 },
                { x: 13, y: 14 }
            ]
        },
        {
            label: 'Комнатная температура, бесцветный кристалл',
            symbol: '▲',
            color: '#e91e63',
            pointStyle: 'triangle',
            data: [
                { x: 3, y: 1.2 },
                { x: 5, y: 2.5 },
                { x: 7, y: 4 },
                { x: 9, y: 6 },
                { x: 11, y: 9 },
                { x: 13, y: 12 }
            ]
        },
        {
            label: '250°C, легированный натрием до 0.5 мол.%',
            symbol: '+',
            color: '#4caf50',
            pointStyle: 'cross',
            data: [
                { x: 3, y: 1.3 },
                { x: 5, y: 2.8 },
                { x: 7, y: 4.5 },
                { x: 9, y: 7 },
                { x: 11, y: 10 },
                { x: 13, y: 13 }
            ]
        },
        {
            label: '250°C, легированный натрием до 0.1 мол.%',
            symbol: '■',
            color: '#ff9800',
            pointStyle: 'rect',
            data: [
                { x: 3, y: 1 },
                { x: 5, y: 2 },
                { x: 7, y: 3.5 },
                { x: 9, y: 5.5 },
                { x: 11, y: 8 },
                { x: 13, y: 11 }
            ]
        }
    ];

    // Исправленная логика для расчета квадратичных аппроксимаций
    const quadraticFits = useMemo(() => {
        return experimentalData.map(series => {
            const points = series.data;
            
            // Для квадратичной зависимости α = af² используем регрессию вида y = bx²
            // Для минимизации ошибки, находим коэффициент b, который дает минимальную сумму квадратов разностей
            let sumXSq = 0;
            let sumXSqY = 0;
            
            points.forEach(point => {
                sumXSq += Math.pow(point.x, 4);  // x^4 для квадратичной модели
                sumXSqY += Math.pow(point.x, 2) * point.y;  // x^2 * y
            });
            
            // Коэффициент b для модели y = bx²
            const b = sumXSqY / sumXSq;
            
            // Генерируем точки для квадратичной кривой
            const fitPoints = [];
            // Используем диапазон частот для отображения кривой
            for (let x = frequencyRange[0]; x <= frequencyRange[1]; x += 0.1) {
                fitPoints.push({
                    x: x,
                    y: b * Math.pow(x, 2)
                });
            }
            
            return {
                data: fitPoints,
                color: series.color,
                equation: `α²ₗ = ${b.toFixed(4)}·f²`
            };
        });
    }, [experimentalData, frequencyRange]);

    // Обновленные данные для графика с учетом выбранных серий и настроек
    const chartData = useMemo(() => ({
        datasets: [
            ...selectedSeries.map(index => ({
                label: experimentalData[index].label,
                data: experimentalData[index].data.filter(
                    point => point.x >= frequencyRange[0] && point.x <= frequencyRange[1]
                ),
                backgroundColor: experimentalData[index].color,
                borderColor: experimentalData[index].color,
                pointStyle: experimentalData[index].pointStyle,
                pointRadius: 6,
                pointHoverRadius: 8,
            })),
            ...(showFittingCurves ? selectedSeries.map(index => ({
                label: `Квадратичная зависимость (${experimentalData[index].label})`,
                data: quadraticFits[index].data,
                backgroundColor: 'transparent',
                borderColor: experimentalData[index].color,
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                pointHoverRadius: 0,
                showLine: true
            })) : [])
        ]
    }), [experimentalData, quadraticFits, selectedSeries, showFittingCurves, frequencyRange]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Частота f (МГц × 10²)',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                },
                beginAtZero: false,
                min: frequencyRange[0],
                max: frequencyRange[1],
                grid: {
                    color: theme.palette.divider
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Коэффициент затухания α²ₗ × 10⁵',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                },
                beginAtZero: true,
                grid: {
                    color: theme.palette.divider
                }
            }
        },
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    pointStyleWidth: 10,
                    padding: 15,
                    filter: function(item: any) {
                        // Показываем только легенду для экспериментальных данных, скрываем легенду для квадратичных зависимостей
                        return !item.text.includes('Квадратичная зависимость');
                    },
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        if (context.dataset.label.includes('Квадратичная')) {
                            const datasetIndex = context.datasetIndex;
                            const seriesIndex = showFittingCurves ? 
                                selectedSeries[datasetIndex - selectedSeries.length] : 
                                selectedSeries[datasetIndex];
                            return `${experimentalData[seriesIndex].label}: ${quadraticFits[seriesIndex].equation} при f=${context.parsed.x.toFixed(1)}`;
                        }
                        return `${context.dataset.label}: (${context.parsed.x.toFixed(1)}, ${context.parsed.y.toFixed(2)})`;
                    }
                }
            }
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleFrequencyRangeChange = (event: Event, newValue: number | number[]) => {
        setFrequencyRange(newValue as [number, number]);
    };

    const handleSeriesToggle = (index: number) => {
        setSelectedSeries(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index].sort()
        );
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                mt: 4,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 6
                }
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
            }}>
                <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 500
                    }}
                >
                    <ShowChartIcon color="primary" /> Частотные зависимости коэффициентов затухания
                </Typography>
                <Tooltip
                    title="Данные соответствуют рисунку 21 из документа по исследованию акустооптических свойств кристаллов PbMoO₄"
                    arrow
                >
                    <InfoOutlinedIcon color="primary" sx={{ cursor: 'pointer' }} />
                </Tooltip>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary" paragraph>
                Рис. 21. Частотные зависимости коэффициентов α²ₗ (1, 3 - 5) и α²ₜ (2) при комнатной температуре (1-3) 
                и при 250°C (4, 5) в образцах PbMoO₄: 1 - слабо окрашенном кристалле; 2 - бесцветном кристалле; 
                3, 5 - легированном натрием до 0.5 мол.%; 4 - легированном натрием до 0.1 мол.%. 
                Прямыми показана квадратичная зависимость.
            </Typography>

            <Box sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                mb: 2
            }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="frequency dependence tabs"
                    variant="fullWidth"
                    centered
                >
                    <Tab label="График зависимости" icon={<ShowChartIcon />} iconPosition="start" />
                    <Tab label="Таблица данных" icon={<DataArrayIcon />} iconPosition="start" />
                    <Tab label="Анализ результатов" icon={<ScienceIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 3, p: 2, borderRadius: 1, bgcolor: theme.palette.background.default }}>
                    <Typography 
                        variant="subtitle2" 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            mb: 2, 
                            fontWeight: 500 
                        }}
                    >
                        <TuneIcon fontSize="small" /> Настройки отображения
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Диапазон частот:
                            </Typography>
                            <Slider
                                value={frequencyRange}
                                onChange={handleFrequencyRangeChange}
                                min={1}
                                max={15}
                                step={0.5}
                                marks
                                valueLabelDisplay="auto"
                                sx={{ mt: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" gutterBottom>
                                Отображаемые образцы:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {experimentalData.map((series, index) => (
                                    <Tooltip key={index} title={series.label} arrow>
                                        <Box
                                            onClick={() => handleSeriesToggle(index)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                border: `1px solid ${series.color}`,
                                                bgcolor: selectedSeries.includes(index) 
                                                    ? `${series.color}22` 
                                                    : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: `${series.color}11`
                                                }
                                            }}
                                        >
                                            <Typography sx={{ 
                                                color: series.color, 
                                                fontSize: '16px', 
                                                fontWeight: 'bold' 
                                            }}>
                                                {series.symbol}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={showFittingCurves}
                                        onChange={(e) => setShowFittingCurves(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        Показать квадратичную аппроксимацию
                                    </Typography>
                                }
                                sx={{ mt: 1 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                
                <Box sx={{ height: '450px' }}>
                    {selectedSeries.length > 0 ? (
                        <Scatter data={chartData} options={chartOptions as any} />
                    ) : (
                        <Box sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                            borderRadius: 2
                        }}>
                            <Typography variant="body1" color="text.secondary">
                                Выберите хотя бы один образец для отображения данных
                            </Typography>
                        </Box>
                    )}
                </Box>
                
                {selectedSeries.length > 0 && showFittingCurves && (
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {selectedSeries.map((seriesIndex) => (
                                <Grid item xs={12} md={6} key={seriesIndex}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                color: experimentalData[seriesIndex].color,
                                                fontWeight: 500
                                            }}>
                                                <span style={{ 
                                                    fontSize: '20px', 
                                                    lineHeight: 1 
                                                }}>{experimentalData[seriesIndex].symbol}</span>
                                                {experimentalData[seriesIndex].label}
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="body2">
                                                Квадратичная аппроксимация: {quadraticFits[seriesIndex].equation}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Коэффициент затухания пропорционален квадрату частоты (α ∝ f²), 
                                                что соответствует теоретическим предсказаниям для пьезоэлектрических кристаллов.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                                <TableCell>Частота f (МГц × 10²)</TableCell>
                                {experimentalData.map((series, index) => (
                                    <TableCell key={index} align="center">
                                        <Tooltip title={series.label} arrow>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                gap: 0.5 
                                            }}>
                                                <span style={{ 
                                                    color: series.color,
                                                    fontSize: '16px',
                                                    fontWeight: 'bold'
                                                }}>{series.symbol}</span>
                                                <Typography variant="caption" color="text.secondary">
                                                    (обр. {index + 1})
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[3, 5, 7, 9, 11, 13].map((frequency, fidx) => (
                                <TableRow key={fidx} sx={{ 
                                    '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                                }}>
                                    <TableCell component="th" scope="row">
                                        {frequency}
                                    </TableCell>
                                    {experimentalData.map((series, sidx) => (
                                        <TableCell key={sidx} align="center">
                                            {series.data.find(d => d.x === frequency)?.y.toFixed(2)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Математическая модель:
                    </Typography>
                    <Typography variant="body2" paragraph>
                        Для каждого образца мы наблюдаем квадратичную зависимость коэффициента затухания от частоты:
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
                        <Typography sx={{ fontFamily: 'monospace' }}>
                            α²ₗ = k·f²
                        </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                        где:
                    </Typography>
                    <Stack spacing={1} sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body2">
                            • α²ₗ - квадрат коэффициента затухания продольной волны (× 10⁵)
                        </Typography>
                        <Typography variant="body2">
                            • k - коэффициент пропорциональности, зависящий от свойств материала
                        </Typography>
                        <Typography variant="body2">
                            • f - частота ультразвуковой волны (МГц × 10²)
                        </Typography>
                    </Stack>
                    <Typography variant="body2">
                        Полученные значения коэффициента k для разных образцов:
                    </Typography>
                    <Box sx={{ mt: 1, ml: 2 }}>
                        {experimentalData.map((series, index) => {
                            const b = parseFloat(quadraticFits[index].equation.split('=')[1].split('·')[0].trim());
                            return (
                                <Typography key={index} variant="body2" sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    color: series.color,
                                    mb: 0.5
                                }}>
                                    <span>{series.symbol}</span> k = {b.toFixed(4)} для образца "{series.label}"
                                </Typography>
                            );
                        })}
                    </Box>
                </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
                <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Научные выводы:
                    </Typography>
                    <Typography variant="body2" paragraph>
                        1. Наблюдается квадратичная зависимость коэффициента затухания от частоты для всех образцов, 
                        что соответствует теоретическим предсказаниям рэлеевского рассеяния.
                    </Typography>
                    <Typography variant="body2" paragraph>
                        2. Окрашенные кристаллы показывают более высокий коэффициент затухания по сравнению с бесцветными, 
                        что связано с дополнительным поглощением звука на дефектах структуры.
                    </Typography>
                    <Typography variant="body2" paragraph>
                        3. Легирование натрием до 0.5 мол.% приводит к более высокому затуханию, чем легирование до 0.1 мол.%,
                        что указывает на прямую зависимость затухания от концентрации примеси.
                    </Typography>
                    <Typography variant="body2" paragraph>
                        4. При повышенной температуре (250°C) затухание для легированных образцов несколько снижается 
                        по сравнению с комнатной температурой, что может быть связано с изменением взаимодействия 
                        акустических фононов с тепловыми колебаниями решётки.
                    </Typography>
                </Box>
                
                <Card variant="outlined" sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScienceIcon color="primary" fontSize="small" /> Связь с вашими измерениями
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Сравнение ваших результатов из вкладки "Расчет затухания" с представленными здесь данными 
                            позволяет оценить соответствие вашего образца одному из исследованных типов кристаллов.
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Для полного анализа рекомендуется:
                        </Typography>
                        <Box component="ul" sx={{ ml: 2 }}>
                            <Typography component="li" variant="body2">
                                Провести измерения на разных частотах для построения собственной частотной зависимости
                            </Typography>
                            <Typography component="li" variant="body2">
                                Сравнить коэффициент затухания вашего образца с эталонными значениями
                            </Typography>
                            <Typography component="li" variant="body2">
                                Проверить соответствие квадратичной зависимости для вашего образца
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </TabPanel>
        </Paper>
    );
}; 