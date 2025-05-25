import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Fade,
    Divider,
    Tooltip,
    Chip
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import { useMeasurements } from '../../context/MeasurementsContext';

/**
 * Компонент для отображения статистики эксперимента
 * Показывает количество измерений, диапазоны значений и энергию активации
 */
export const LabStats: React.FC = () => {
    // Получаем данные измерений из контекста
    const { measurements } = useMeasurements();

    // Фильтруем валидные измерения (с заполненными температурой и сопротивлением)
    const validMeasurements = measurements.filter(m => 
        m.temperature_c !== null && 
        m.resistance !== null
    );

    // Проверяем наличие достаточного количества измерений
    const hasValidData = validMeasurements.length >= 2;
    // Получаем значение энергии ионизации из первого измерения
    const ionizationEnergy = measurements[0]?.ionization_energy;

    // Рассчитываем статистику измерений
    const stats = {
        measurementsCount: validMeasurements.length,  // Количество валидных измерений
        tempRange: hasValidData ? {  // Диапазон температур
            min: Math.min(...validMeasurements.map(m => m.temperature_c!)),
            max: Math.max(...validMeasurements.map(m => m.temperature_c!))
        } : null,
        resistanceRange: hasValidData ? {  // Диапазон сопротивлений
            min: Math.min(...validMeasurements.map(m => m.resistance!)),
            max: Math.max(...validMeasurements.map(m => m.resistance!))
        } : null
    };

    return (
        // Анимация появления компонента
        <Fade in={true} timeout={1000}>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    mb: 3,
                    background: 'linear-gradient(45deg, rgba(25,118,210,0.05) 0%, rgba(255,255,255,1) 100%)'
                }}
            >
                {/* Заголовок секции */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScienceIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                        Результаты эксперимента
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Чипы со статистикой */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {/* Количество измерений */}
                    <Tooltip title="Количество проведенных измерений">
                        <Chip
                            label={`Измерений: ${stats.measurementsCount}`}
                            color="primary"
                            variant="outlined"
                        />
                    </Tooltip>

                    {/* Диапазон температур */}
                    {stats.tempRange && (
                        <Tooltip title="Диапазон температур">
                            <Chip
                                label={`Температура: ${stats.tempRange.min.toFixed(1)}...${stats.tempRange.max.toFixed(1)}°C`}
                                color="primary"
                                variant="outlined"
                            />
                        </Tooltip>
                    )}

                    {/* Диапазон сопротивлений */}
                    {stats.resistanceRange && (
                        <Tooltip title="Диапазон сопротивлений">
                            <Chip
                                label={`Сопротивление: ${stats.resistanceRange.min.toFixed(1)}...${stats.resistanceRange.max.toFixed(1)}Ом`}
                                color="primary"
                                variant="outlined"
                            />
                        </Tooltip>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Секция с энергией активации */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                        Энергия активации примесей:
                    </Typography>
                    {ionizationEnergy ? (
                        // Отображение значения энергии активации
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="h4">
                                {(ionizationEnergy * 6.242e18).toFixed(3)}  {/* Конвертация в электронвольты */}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                эВ
                            </Typography>
                        </Box>
                    ) : (
                        // Сообщение при недостаточном количестве измерений
                        <Typography color="text.secondary">
                            Для расчета энергии активации необходимо минимум 2 измерения
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Fade>
    );
}; 