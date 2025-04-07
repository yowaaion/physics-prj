import React, { useState, useMemo } from 'react';
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

            // Если недостаточно точек для построения графика
            if (validMeasurements.length < 2) {
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
                    trendLnG: slope * validMeasurements[0].inverseTemp + intercept 
                },
                { 
                    inverseTemp: validMeasurements[validMeasurements.length - 1].inverseTemp, 
                    trendLnG: slope * validMeasurements[validMeasurements.length - 1].inverseTemp + intercept 
                }
            ];

            return {
                validData: validMeasurements,
                trendLineData: trendData,
                error: null
            };
        } catch (err) {
            console.error('Ошибка при построении графика:', err);
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

    return (
        <Fade in={true}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Показать сетку"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showPoints}
                                onChange={(e) => setShowPoints(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Показать точки"
                    />
                </Box>
                <Box sx={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={validData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                            <XAxis
                                dataKey="inverseTemp"
                                label={{ value: '1/T (K⁻¹)', position: 'bottom' }}
                                tickFormatter={(value) => value.toExponential(2)}
                            />
                            <YAxis
                                dataKey="lnConductance"
                                label={{ value: 'ln(G)', angle: -90, position: 'insideLeft' }}
                                tickFormatter={(value) => value.toFixed(2)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {showPoints && (
                                <Line
                                    type="monotone"
                                    dataKey="lnConductance"
                                    name="Измерения"
                                    stroke="#1976d2"
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            )}
                            <Line
                                type="monotone"
                                data={trendLineData}
                                dataKey="trendLnG"
                                name="Линия тренда"
                                stroke="#dc004e"
                                strokeWidth={2}
                                dot={false}
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