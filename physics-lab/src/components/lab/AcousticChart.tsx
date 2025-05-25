import React, { useMemo, useState } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    useTheme, 
    Button, 
    Tooltip as MuiTooltip, 
    Divider,
    Grid,
    Card,
    CardContent,
    Tabs,
    Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CalculateIcon from '@mui/icons-material/Calculate';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Line, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LinearScale as LinearScaleElement
} from 'chart.js';
import { useMeasurements } from '../../context/MeasurementsContext';
import { FrequencyDependenceChart } from './FrequencyDependenceChart';

// Регистрация необходимых компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LinearScaleElement
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
            id={`acoustic-tabpanel-${index}`}
            aria-labelledby={`acoustic-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
        </div>
    );
}

export const AcousticChart: React.FC = () => {
    const theme = useTheme();
    const { acousticMeasurements, handleAddAcousticRow } = useMeasurements();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Подготовка данных для графика
    const validMeasurements = acousticMeasurements
        .filter(m => m.x1 != null && m.x2 != null && m.deltaI != null && m.alpha != null)
        .sort((a, b) => (a.x2 ?? 0) - (b.x2 ?? 0)); // Сортировка по X2 для правильного отображения графика

    // Расчет метрик и линейной регрессии
    const {
        primaryData,
        regressionData,
        meanAlpha,
        stdDeviation,
        regressionEquation,
        correlationCoefficient
    } = useMemo(() => {
        if (validMeasurements.length === 0) {
            return {
                primaryData: [],
                regressionData: [],
                meanAlpha: 0,
                stdDeviation: 0,
                regressionEquation: '',
                correlationCoefficient: 0
            };
        }

        // Рассчитываем средний коэффициент затухания
        const alphaValues = validMeasurements.map(m => m.alpha ?? 0);
        const mean = alphaValues.reduce((sum, val) => sum + val, 0) / alphaValues.length;

        // Рассчитываем стандартное отклонение
        const variance = alphaValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / alphaValues.length;
        const stdDev = Math.sqrt(variance);

        // Рассчитываем линейную регрессию для X2 и Alpha
        const points = validMeasurements.map(m => ({
            x: m.x2 ?? 0,
            y: m.alpha ?? 0
        }));

        let slope = 0;
        let intercept = 0;
        let correlation = 0;

        if (points.length > 1) {
            // Линейная регрессия
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
            points.forEach(point => {
                sumX += point.x;
                sumY += point.y;
                sumXY += point.x * point.y;
                sumX2 += point.x * point.x;
                sumY2 += point.y * point.y;
            });
            const n = points.length;
            
            slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            intercept = (sumY - slope * sumX) / n;
            
            // Корреляция Пирсона
            const numerator = n * sumXY - sumX * sumY;
            const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
            correlation = denominator !== 0 ? numerator / denominator : 0;
        }

        // Формируем данные для линии регрессии
        const regressionPoints = [];
        if (points.length > 0) {
            const minX = Math.min(...points.map(p => p.x));
            const maxX = Math.max(...points.map(p => p.x));
            regressionPoints.push({ x: minX, y: minX * slope + intercept });
            regressionPoints.push({ x: maxX, y: maxX * slope + intercept });
        }

        return {
            primaryData: points,
            regressionData: regressionPoints,
            meanAlpha: mean,
            stdDeviation: stdDev,
            regressionEquation: `α = ${slope.toFixed(4)} × X₂ + ${intercept.toFixed(4)}`,
            correlationCoefficient: correlation
        };
    }, [validMeasurements]);

    const primaryColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;

    const data = {
        datasets: [
            {
                label: 'Коэффициент затухания α (дБ/мм)',
                type: 'scatter' as const,
                data: primaryData,
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                pointStyle: 'circle',
                pointRadius: 6,
                pointHoverRadius: 8,
                order: 1
            },
            {
                label: 'Линия регрессии',
                type: 'line' as const,
                data: regressionData,
                borderColor: secondaryColor,
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                tension: 0,
                order: 0
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14
                    },
                    usePointStyle: true
                }
            },
            title: {
                display: true,
                text: 'Зависимость коэффициента затухания от расстояния',
                font: {
                    size: 16,
                    weight: 'bold' as const
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        if (context.dataset.type === 'line') {
                            return `Регрессия: α = ${context.parsed.y.toFixed(4)} дБ/мм`;
                        }
                        
                        const pointIndex = context.dataIndex;
                        const measurement = validMeasurements[pointIndex];
                        
                        return [
                            `α: ${context.parsed.y.toFixed(4)} дБ/мм`,
                            `X₁: ${measurement.x1?.toFixed(2)} мм`,
                            `X₂: ${measurement.x2?.toFixed(2)} мм`,
                            `ΔI/I₀: ${measurement.deltaI?.toFixed(4)}`
                        ];
                    },
                    title: (tooltipItems: any) => {
                        if (tooltipItems[0].dataset.type === 'line') {
                            return `Точка на линии регрессии`;
                        }
                        const index = tooltipItems[0].dataIndex;
                        return `Измерение №${validMeasurements[index].id}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Расстояние X₂ (мм)',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    },
                    padding: {
                        top: 10
                    }
                },
                grid: {
                    color: theme.palette.divider
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Коэффициент затухания α (дБ/мм)',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    },
                    padding: {
                        bottom: 10
                    }
                },
                grid: {
                    color: theme.palette.divider
                }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            intersect: true
        }
    };

    return (
        <Box>
            <Paper 
                elevation={3} 
                sx={{ 
                    mb: 4,
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(25, 118, 210, 0.08)', 
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <ShowChartIcon color="primary" /> Анализ акустооптических свойств материалов
                    </Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="acoustic analysis tabs"
                        variant="fullWidth"
                    >
                        <Tab 
                            label="Расчет затухания" 
                            icon={<CalculateIcon />} 
                            iconPosition="start" 
                        />
                        <Tab 
                            label="Частотная зависимость" 
                            icon={<CompareArrowsIcon />} 
                            iconPosition="start" 
                        />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ 
                            mb: 3, 
                            p: 2, 
                            borderRadius: 1, 
                            bgcolor: 'rgba(25, 118, 210, 0.04)', 
                            border: '1px dashed rgba(25, 118, 210, 0.5)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2
                        }}>
                            <InfoIcon color="primary" sx={{ mt: 0.5 }} />
                            <Box>
                                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                                    Акустооптический метод измерения затухания ультразвука
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Коэффициент затухания α рассчитывается по формуле: α = 10 lg(ΔI/I₀) / (X₂-X₁) [дБ/мм], где
                                    ΔI/I₀ - отношение интенсивностей дифрагированного света, X₁ и X₂ - координаты измерений в мм.
                                    График показывает зависимость α от расстояния X₂ и линейную регрессию для оценки 
                                    затухания в материале.
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box sx={{ height: 'calc(100% - 40px)', minHeight: '400px' }}>
                            {validMeasurements.length > 0 ? (
                                <Scatter data={data as any} options={options} />
                            ) : (
                                <Box
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        gap: 2,
                                        p: 3,
                                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography variant="h6" color="text.secondary">
                                        Нет данных для отображения графика
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Перейдите на вкладку "Ввод данных" и заполните таблицу акустооптических измерений.<br/>
                                        Для расчета необходимо указать X₁, X₂ и ΔI/I₀.
                                    </Typography>
                                    {acousticMeasurements.length === 0 && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddAcousticRow}
                                            startIcon={<AddIcon />}
                                            sx={{
                                                mt: 2,
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: 4
                                                }
                                            }}
                                        >
                                            Добавить измерение
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {validMeasurements.length > 0 && (
                        <Box sx={{ p: 3, pt: 0 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                                Среднее значение коэффициента затухания
                                            </Typography>
                                            <Typography variant="h5" component="div" color="primary.main">
                                                {meanAlpha.toFixed(4)} дБ/мм
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Стандартное отклонение: {stdDeviation.toFixed(4)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                                Уравнение линейной регрессии
                                            </Typography>
                                            <Typography variant="h5" component="div" color="secondary.main">
                                                {regressionEquation}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Коэффициент корреляции: {correlationCoefficient.toFixed(4)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalculateIcon fontSize="small" /> Интерпретация результатов
                                            </Typography>
                                            <Typography variant="body1">
                                                {correlationCoefficient > 0.7 ? (
                                                    "Наблюдается сильная положительная корреляция между расстоянием и коэффициентом затухания, что указывает на устойчивую зависимость в образце."
                                                ) : correlationCoefficient > 0.3 ? (
                                                    "Наблюдается средняя корреляция между расстоянием и коэффициентом затухания. Возможно наличие неоднородностей в образце."
                                                ) : (
                                                    "Слабая корреляция между расстоянием и коэффициентом затухания указывает на значительные неоднородности в образце или возможные ошибки измерений."
                                                )}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                                Измеренное среднее значение коэффициента затухания ({meanAlpha.toFixed(4)} дБ/мм) 
                                                {meanAlpha > 0.5 ? " значительно" : meanAlpha > 0.2 ? " умеренно" : " слабо"} 
                                                влияет на распространение ультразвуковых волн в исследуемом материале.
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                                Сравните полученные данные с теоретическими значениями, представленными на вкладке "Частотная зависимость".
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Частотные зависимости коэффициентов затухания для различных образцов и условий
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Данные ниже позволяют сравнить полученные вами результаты с теоретическими и эмпирическими данными для образцов PbMoO₄ 
                            при различных условиях (температура, легирование). Квадратичная зависимость коэффициента затухания от частоты (α ∝ f²) 
                            характерна для многих кристаллических материалов.
                        </Typography>
                        
                        <FrequencyDependenceChart />
                    </Box>
                </TabPanel>
            </Paper>
        </Box>
    );
}; 