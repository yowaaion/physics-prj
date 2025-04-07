import React, { useState } from 'react';
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
import { Paper, Typography, Box, Fade, Switch, FormControlLabel } from '@mui/material';
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
    const validData = measurements
        .filter(m => m.inverse_temperature !== null && m.ln_conductance !== null)
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

    // Если нет данных, показываем сообщение
    if (validData.length === 0) {
        return (
            <Fade in={true}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        Нет данных для построения графика
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Добавьте измерения в таблицу
                    </Typography>
                </Paper>
            </Fade>
        );
    }

    // Рассчитываем линию тренда методом наименьших квадратов
    const n = validData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    validData.forEach(point => {
        sumX += point.inverseTemp;
        sumY += point.lnConductance;
        sumXY += point.inverseTemp * point.lnConductance;
        sumX2 += point.inverseTemp * point.inverseTemp;
    });

    // Вычисляем коэффициенты линии тренда
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Создаем данные для линии тренда
    const trendLineData = [
        { inverseTemp: validData[0].inverseTemp, trendLnG: slope * validData[0].inverseTemp + intercept },
        { inverseTemp: validData[validData.length - 1].inverseTemp, trendLnG: slope * validData[validData.length - 1].inverseTemp + intercept }
    ];

    return (
        <Fade in={true}>
            <Paper sx={{ p: 3 }}>
                {/* Заголовок графика */}
                <Typography variant="h6" align="center" gutterBottom>
                    График зависимости ln(G) от 1/T
                </Typography>

                {/* Переключатели отображения элементов графика */}
                <Box sx={{ mb: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showGrid}
                                onChange={(e) => setShowGrid(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Сетка"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showPoints}
                                onChange={(e) => setShowPoints(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Точки"
                    />
                </Box>

                {/* Контейнер графика */}
                <Box sx={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={validData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            {/* Сетка графика */}
                            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                            {/* Ось X */}
                            <XAxis
                                dataKey="inverseTemp"
                                tickFormatter={value => value.toExponential(2)}
                                label={{
                                    value: '1/T, K⁻¹',
                                    position: 'bottom',
                                    offset: 0
                                }}
                            />
                            {/* Ось Y */}
                            <YAxis
                                label={{
                                    value: 'ln(G)',
                                    angle: -90,
                                    position: 'insideLeft'
                                }}
                            />
                            {/* Всплывающая подсказка */}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            
                            {/* Линия данных */}
                            <Line
                                type="monotone"
                                dataKey="lnConductance"
                                name="ln(G)"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={showPoints ? { r: 4, strokeWidth: 2 } : false}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />

                            {/* Линия тренда */}
                            <Line
                                data={trendLineData}
                                type="linear"
                                dataKey="trendLnG"
                                name="Линия тренда"
                                stroke="#82ca9d"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Отображение углового коэффициента */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Угловой коэффициент: {slope.toExponential(4)}
                    </Typography>
                </Box>
            </Paper>
        </Fade>
    );
};

/**
 * Компонент всплывающей подсказки для графика
 * Отображает детальную информацию о точке при наведении
 */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper sx={{ p: 1.5, minWidth: '200px' }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                    Измерение №{data.id}
                </Typography>
                <Box sx={{ display: 'grid', gap: 0.5 }}>
                    <Typography variant="body2">
                        Температура: {data.tooltip.temp}°C
                    </Typography>
                    <Typography variant="body2">
                        Сопротивление: {data.tooltip.resistance} Ом
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
    return null;
}; 