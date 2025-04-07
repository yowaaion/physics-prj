import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Measurement, ChartData } from '../types';

interface ResistanceChartProps {
    data: Measurement[];
}

export const ResistanceChart: React.FC<ResistanceChartProps> = ({ data }) => {
    const chartData: ChartData[] = data
        .filter(measurement => 
            measurement.inverse_temperature !== null && 
            measurement.ln_conductance !== null
        )
        .map(measurement => ({
            inverse_temperature: measurement.inverse_temperature!,
            ln_conductance: measurement.ln_conductance!
        }));

    // Сортируем данные по возрастанию 1/T для правильного отображения линии
    chartData.sort((a, b) => a.inverse_temperature - b.inverse_temperature);

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="inverse_temperature"
                        label={{ value: '1/T (K⁻¹)', position: 'bottom' }}
                        tickFormatter={(value) => value.toExponential(2)}
                    />
                    <YAxis
                        dataKey="ln_conductance"
                        label={{ value: 'lnG', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => value.toFixed(2)}
                    />
                    <Tooltip 
                        formatter={(value: number, name: string) => {
                            if (name === 'ln_conductance') {
                                return [value.toFixed(4), 'lnG'];
                            }
                            return [value.toExponential(4), '1/T'];
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="ln_conductance"
                        stroke="#8884d8"
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}; 