import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import { useMeasurements } from '../../context/MeasurementsContext';

/**
 * Компонент для отображения графика зависимости lnG от 1/T
 */
export const ResistanceChart: React.FC = () => {
    const { measurements } = useMeasurements();

    const chartData = measurements
        .filter(m => m.inverse_temperature !== null && m.ln_conductance !== null)
        .map(m => ({
            inverse_temperature: m.inverse_temperature,
            ln_conductance: m.ln_conductance,
            temperature_c: m.temperature_c // добавляем для отображения в подсказке
        }))
        .sort((a, b) => (a.inverse_temperature || 0) - (b.inverse_temperature || 0));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{ p: 1.5, boxShadow: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Температура: {payload[0].payload.temperature_c?.toFixed(1)}°C
                    </Typography>
                    <Typography variant="body2">
                        1/T: {payload[0].payload.inverse_temperature.toExponential(4)} K⁻¹
                    </Typography>
                    <Typography variant="body2">
                        lnG: {payload[0].payload.ln_conductance.toFixed(4)}
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
                Зависимость натурального логарифма проводимости от обратной температуры
            </Typography>
            <Box sx={{ width: '100%', height: 500 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis
                            dataKey="inverse_temperature"
                            label={{
                                value: 'Обратная температура 1/T (K⁻¹)',
                                position: 'bottom',
                                offset: 20
                            }}
                            tickFormatter={(value) => value.toExponential(2)}
                            stroke="#666"
                        />
                        <YAxis
                            dataKey="ln_conductance"
                            label={{
                                value: 'Логарифм проводимости lnG',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10
                            }}
                            tickFormatter={(value) => value.toFixed(2)}
                            stroke="#666"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            name="lnG(1/T)"
                            type="monotone"
                            dataKey="ln_conductance"
                            stroke="#1976d2"
                            strokeWidth={2}
                            dot={{ r: 5, fill: "#1976d2" }}
                            activeDot={{
                                r: 7,
                                stroke: "#1976d2",
                                strokeWidth: 2,
                                fill: "#fff"
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
            {chartData.length === 0 && (
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 3 }}>
                    Добавьте измерения для отображения графика
                </Typography>
            )}
        </Paper>
    );
}; 