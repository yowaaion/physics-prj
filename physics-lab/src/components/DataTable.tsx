import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField
} from '@mui/material';
import { Measurement } from '../types';

interface DataTableProps {
    onDataChange: (data: Measurement[]) => void;
}

const k = 1.380649e-23; // Постоянная Больцмана в Дж/К

// Константы для валидации
const TEMP_MIN = 0;      // Минимальная температура в °C
const TEMP_MAX = 200;    // Максимальная температура в °C
const R_MIN = 0.0001;    // Минимальное сопротивление в Ом
const R_MAX = 1000000;   // Максимальное сопротивление в Ом

export const DataTable: React.FC<DataTableProps> = ({ onDataChange }) => {
    const [measurements, setMeasurements] = useState<Measurement[]>([
        {
            id: 1,
            temperature_c: null,
            temperature_k: null,
            inverse_temperature: null,
            resistance: null,
            conductance: null,
            ln_conductance: null,
            ionization_energy: null
        }
    ]);

    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const validateValue = (field: keyof Measurement, value: number): string | null => {
        if (field === 'temperature_c') {
            if (value < TEMP_MIN) {
                return `Температура не может быть ниже ${TEMP_MIN}°C`;
            }
            if (value > TEMP_MAX) {
                return `Температура не может быть выше ${TEMP_MAX}°C`;
            }
        }
        if (field === 'resistance') {
            if (value < R_MIN) {
                return `Сопротивление не может быть меньше ${R_MIN} Ом`;
            }
            if (value > R_MAX) {
                return `Сопротивление не может быть больше ${R_MAX} Ом`;
            }
        }
        return null;
    };

    const calculateDerivedValues = (measurement: Measurement): Measurement => {
        const temperature_k = measurement.temperature_c !== null 
            ? measurement.temperature_c + 273 
            : null;
        
        const inverse_temperature = temperature_k !== null 
            ? 1 / temperature_k 
            : null;
        
        const conductance = measurement.resistance !== null 
            ? 1 / measurement.resistance 
            : null;
        
        const ln_conductance = conductance !== null 
            ? Math.log(conductance) 
            : null;

        return {
            ...measurement,
            temperature_k,
            inverse_temperature,
            conductance,
            ln_conductance
        };
    };

    const calculateIonizationEnergy = (measurements: Measurement[]) => {
        // Находим две точки с наибольшей разницей температур для лучшей точности
        const validPoints = measurements.filter(m => 
            m.inverse_temperature !== null && 
            m.ln_conductance !== null
        ).sort((a, b) => (a.temperature_k || 0) - (b.temperature_k || 0));

        if (validPoints.length >= 2) {
            const point1 = validPoints[0];
            const point2 = validPoints[validPoints.length - 1];

            if (point1.inverse_temperature && point2.inverse_temperature &&
                point1.ln_conductance && point2.ln_conductance) {
                
                // Формула (12.21): A = (lnG₁ - lnG₂)/(1/T₁ - 1/T₂)
                const A = (point1.ln_conductance - point2.ln_conductance) / 
                         (point1.inverse_temperature - point2.inverse_temperature);
                
                // Формула (12.22): ΔEᵢ = 2kA
                const deltaE = 2 * k * A;

                // Обновляем все измерения с вычисленной энергией ионизации
                return measurements.map(m => ({
                    ...m,
                    ionization_energy: deltaE
                }));
            }
        }
        return measurements;
    };

    const isLastRowFilled = () => {
        const lastMeasurement = measurements[measurements.length - 1];
        return lastMeasurement.temperature_c !== null && 
               lastMeasurement.resistance !== null &&
               Object.keys(errors).length === 0;
    };

    const handleAddRow = () => {
        if (!isLastRowFilled()) {
            alert('Пожалуйста, заполните все поля в текущей строке корректными значениями перед добавлением новой');
            return;
        }

        const newMeasurement: Measurement = {
            id: measurements.length + 1,
            temperature_c: null,
            temperature_k: null,
            inverse_temperature: null,
            resistance: null,
            conductance: null,
            ln_conductance: null,
            ionization_energy: null
        };
        const newMeasurements = [...measurements, newMeasurement];
        setMeasurements(newMeasurements);
        onDataChange(newMeasurements);
    };

    const handleChange = (id: number, field: keyof Measurement, value: string) => {
        const numValue = parseFloat(value);
        const errorKey = `${id}-${field}`;

        if (value !== '') {
            const error = validateValue(field, numValue);
            if (error) {
                setErrors(prev => ({ ...prev, [errorKey]: error }));
                return;
            }
        }

        // Очищаем ошибку для этого поля, если она была
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
        });

        let newMeasurements = measurements.map(measurement => {
            if (measurement.id === id) {
                const updatedMeasurement = {
                    ...measurement,
                    [field]: value === '' ? null : numValue
                };
                return calculateDerivedValues(updatedMeasurement);
            }
            return measurement;
        });

        // Рассчитываем энергию ионизации после обновления значений
        newMeasurements = calculateIonizationEnergy(newMeasurements);
        
        setMeasurements(newMeasurements);
        onDataChange(newMeasurements);
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>№</TableCell>
                            <TableCell>t (°C)</TableCell>
                            <TableCell>T (K)</TableCell>
                            <TableCell>1/T (K⁻¹)</TableCell>
                            <TableCell>R (Ом)</TableCell>
                            <TableCell>G (Ом⁻¹)</TableCell>
                            <TableCell>lnG</TableCell>
                            <TableCell>ΔEᵢ (Дж)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {measurements.map((measurement) => (
                            <TableRow key={measurement.id}>
                                <TableCell>{measurement.id}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={measurement.temperature_c ?? ''}
                                        onChange={(e) => handleChange(measurement.id, 'temperature_c', e.target.value)}
                                        size="small"
                                        error={!!errors[`${measurement.id}-temperature_c`]}
                                        helperText={errors[`${measurement.id}-temperature_c`]}
                                        inputProps={{
                                            min: TEMP_MIN,
                                            max: TEMP_MAX,
                                            step: "0.1"
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {measurement.temperature_k?.toFixed(2) ?? ''}
                                </TableCell>
                                <TableCell>
                                    {measurement.inverse_temperature?.toExponential(4) ?? ''}
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={measurement.resistance ?? ''}
                                        onChange={(e) => handleChange(measurement.id, 'resistance', e.target.value)}
                                        size="small"
                                        error={!!errors[`${measurement.id}-resistance`]}
                                        helperText={errors[`${measurement.id}-resistance`]}
                                        inputProps={{
                                            min: R_MIN,
                                            max: R_MAX,
                                            step: "0.0001"
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {measurement.conductance?.toExponential(4) ?? ''}
                                </TableCell>
                                <TableCell>
                                    {measurement.ln_conductance?.toFixed(4) ?? ''}
                                </TableCell>
                                <TableCell>
                                    {measurement.ionization_energy?.toExponential(4) ?? ''}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                style={{ marginTop: '1rem' }}
                disabled={!isLastRowFilled()}
            >
                Добавить измерение
            </Button>
        </div>
    );
}; 