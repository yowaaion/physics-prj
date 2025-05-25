import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine
} from 'recharts';
import { Paper, Typography, Box, Fade, Switch, FormControlLabel, Alert } from '@mui/material';
import { useMeasurements } from '../../context/MeasurementsContext';

/**
 * Компонент для отображения графика зависимости lnG от 1/T
 * Строит график на основе измерений и рассчитывает линию тренда
 */
export const ResistanceChart: React.FC = () => {
    // Получаем данные измерений из контекста
    const { measurements } = useMeasurements();
    // Состояния для управления отображением элементов графика
    const [showGrid, setShowGrid] = useState(true);
    const [showPoints, setShowPoints] = useState(true);

    // Фильтруем и подготавливаем данные для графика
    const { validData, trendLineData, error } = useMemo(() => {
        try {
            // Фильтруем валидные измерения
            const validMeasurements = measurements
                .filter(m => 
                    m.inverse_temperature !== null && 
                    m.ln_conductance !== null &&
                    !isNaN(m.inverse_temperature) &&
                    !isNaN(m.ln_conductance)
                )
                .map(m => ({
                    id: m.id,
                    inverseTemp: m.inverse_temperature!,
                    lnConductance: m.ln_conductance!,
                    tooltip: {
                        temp: m.temperature_c?.toFixed(1),
                        resistance: m.resistance?.toFixed(2)
                    }
                }))
                .sort((a, b) => a.inverseTemp - b.inverseTemp);

            console.log('Valid measurements:', validMeasurements); // Отладочный вывод

            // Если недостаточно точек для построения графика
            if (validMeasurements.length < 2) {
                console.log('Not enough measurements'); // Отладочный вывод
                return {
                    validData: [],
                    trendLineData: [],
                    error: 'Необходимо минимум 2 измерения для построения графика'
                };
            }

            // Рассчитываем линию тренда методом наименьших квадратов
            const n = validMeasurements.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            validMeasurements.forEach(point => {
                sumX += point.inverseTemp;
                sumY += point.lnConductance;
                sumXY += point.inverseTemp * point.lnConductance;
                sumX2 += point.inverseTemp * point.inverseTemp;
            });

            // Вычисляем коэффициенты линии тренда
            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            // Создаем данные для линии тренда
            const trendData = [
                { 
                    inverseTemp: validMeasurements[0].inverseTemp, 
                    trendLnG: slope * validMeasurements[0].inverseTemp + intercept,
                    lnConductance: null // Добавляем это поле для совместимости
                },
                { 
                    inverseTemp: validMeasurements[validMeasurements.length - 1].inverseTemp, 
                    trendLnG: slope * validMeasurements[validMeasurements.length - 1].inverseTemp + intercept,
                    lnConductance: null // Добавляем это поле для совместимости
                }
            ];

            console.log('Trend data:', trendData); // Отладочный вывод

            return {
                validData: validMeasurements,
                trendLineData: trendData,
                error: null
            };
        } catch (err) {
            console.error('Error in data processing:', err); // Отладочный вывод
            return {
                validData: [],
                trendLineData: [],
                error: 'Ошибка при построении графика'
            };
        }
    }, [measurements]);

    // Если есть ошибка, показываем сообщение
    if (error) {
        return (
            <Fade in={true}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        Добавьте измерения в таблицу
                    </Typography>
                </Paper>
            </Fade>
        );
    }

    // Объединяем все данные для графика
    const allData = [...validData, ...trendLineData];
    console.log('All chart data:', allData); // Отладочный вывод

    return (
        <Fade in={true}>
            <Paper 
                sx={{ 
                    p: 3,
                    borderRadius: 2,
                    boxShadow: (theme) => theme.shadows[3],
                    '&:hover': {
                        boxShadow: (theme) => theme.shadows[6]
                    },
                    transition: 'box-shadow 0.3s ease-in-out'
                }}
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        color: 'text.primary',
                        fontWeight: 500,
                        textAlign: 'center'
                    }}
                >
                    График зависимости ln(G) от 1/T
                </Typography>
                
                <Box 
                    sx={{ 
                        mb: 2,
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        pb: 2
                    }}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                                color="primary"
                                size="small"
                            />
                        }
                        label={
                            <Typography variant="body2" color="text.secondary">
                                Сетка
                            </Typography>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showPoints}
                                onChange={(e) => setShowPoints(e.target.checked)}
                                color="primary"
                                size="small"
                            />
                        }
                        label={
                            <Typography variant="body2" color="text.secondary">
                                Точки измерений
                            </Typography>
                        }
                    />
                </Box>
                <Box sx={{ 
                    width: '100%', 
                    height: 400,
                    '.recharts-default-tooltip': {
                        borderRadius: 1,
                        boxShadow: (theme) => theme.shadows[2],
                        border: 'none'
                    },
                    '.recharts-legend-item': {
                        marginRight: '20px !important'
                    }
                }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={allData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 20
                            }}
                        >
                            {showGrid && (
                                <CartesianGrid 
                                    strokeDasharray="3 3"
                                    stroke="#ccc"
                                />
                            )}
                            <XAxis
                                dataKey="inverseTemp"
                                type="number"
                                domain={['auto', 'auto']}
                                label={{ 
                                    value: '1/T (K⁻¹)', 
                                    position: 'bottom',
                                    offset: 0,
                                    style: {
                                        textAnchor: 'middle',
                                        fill: 'rgba(0, 0, 0, 0.87)',
                                        fontSize: 14,
                                        fontWeight: 500
                                    }
                                }}
                                tickFormatter={(value: number) => value.toExponential(2)}
                                tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12 }}
                            />
                            <YAxis
                                type="number"
                                domain={['auto', 'auto']}
                                label={{ 
                                    value: 'ln(G)', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    offset: 0,
                                    style: {
                                        textAnchor: 'middle',
                                        fill: 'rgba(0, 0, 0, 0.87)',
                                        fontSize: 14,
                                        fontWeight: 500
                                    }
                                }}
                                tickFormatter={(value: number) => value.toFixed(2)}
                                tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12 }}
                            />
                            <Tooltip 
                                content={<CustomTooltip />}
                                wrapperStyle={{
                                    outline: 'none',
                                    zIndex: 1000
                                }}
                            />
                            <Legend 
                                verticalAlign="top"
                                height={36}
                                wrapperStyle={{
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                                formatter={(value: string) => {
                                    return <span style={{ 
                                        color: value === 'Измерения' ? '#1976d2' : '#dc004e',
                                        padding: '4px 12px',
                                        borderRadius: '16px',
                                        backgroundColor: value === 'Измерения' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(220, 0, 78, 0.08)',
                                        transition: 'all 0.2s ease-in-out',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 
                                            value === 'Измерения' ? 'rgba(25, 118, 210, 0.12)' : 'rgba(220, 0, 78, 0.12)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 
                                            value === 'Измерения' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(220, 0, 78, 0.08)';
                                    }}
                                    >
                                        {value}
                                    </span>;
                                }}
                            />
                            {showPoints && (
                                <Line
                                    type="monotone"
                                    dataKey="lnConductance"
                                    name="Измерения"
                                    stroke="#1976d2"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#1976d2', strokeWidth: 1 }}
                                    activeDot={{ 
                                        r: 6, 
                                        fill: '#1976d2', 
                                        strokeWidth: 2,
                                        stroke: '#fff'
                                    }}
                                    isAnimationActive={false}
                                />
                            )}
                            <Line
                                type="monotone"
                                dataKey="trendLnG"
                                name="Линия тренда"
                                stroke="#dc004e"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Fade>
    );
};

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        dataKey: string;
        payload: {
            id: number;
            inverseTemp: number;
            lnConductance: number;
            trendLnG?: number;
            tooltip?: {
                temp: string;
                resistance: string;
            };
        };
    }>;
}

/**
 * Компонент всплывающей подсказки для графика
 * Отображает детальную информацию о точке при наведении
 */
const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        // Находим данные измерения (если есть)
        const measurementPoint = payload.find(p => p.dataKey === 'lnConductance');
        // Находим данные линии тренда (если есть)
        const trendPoint = payload.find(p => p.dataKey === 'trendLnG');

        // Если это точка измерения
        if (measurementPoint) {
            const data = measurementPoint.payload;
            return (
                <Paper sx={{ p: 1.5, minWidth: '200px' }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                        Измерение №{data.id}
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 0.5 }}>
                        <Typography variant="body2">
                            Температура: {data.tooltip?.temp}°C
                        </Typography>
                        <Typography variant="body2">
                            Сопротивление: {data.tooltip?.resistance} Ом
                        </Typography>
                        <Typography variant="body2">
                            1/T: {data.inverseTemp.toExponential(4)} K⁻¹
                        </Typography>
                        <Typography variant="body2">
                            ln(G): {data.lnConductance.toFixed(4)}
                        </Typography>
                    </Box>
                </Paper>
            );
        }
        
        // Если это точка линии тренда
        if (trendPoint) {
            const data = trendPoint.payload;
            return (
                <Paper sx={{ p: 1.5, minWidth: '200px' }}>
                    <Typography variant="subtitle2" color="#dc004e" gutterBottom>
                        Линия тренда
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 0.5 }}>
                        <Typography variant="body2">
                            1/T: {data.inverseTemp.toExponential(4)} K⁻¹
                        </Typography>
                        <Typography variant="body2">
                            ln(G): {data.trendLnG?.toFixed(4)}
                        </Typography>
                    </Box>
                </Paper>
            );
        }
    }
    return null;
}; 