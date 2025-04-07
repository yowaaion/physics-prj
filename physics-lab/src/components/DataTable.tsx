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
    TextField,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Measurement } from '../types';
import * as XLSX from 'xlsx';

/**
 * Интерфейс пропсов компонента DataTable
 * onDataChange вызывается при любом изменении данных в таблице
 */
interface DataTableProps {
    onDataChange: (data: Measurement[]) => void;
}

// Физические константы
const k = 1.380649e-23; // Постоянная Больцмана в Дж/К

// Константы для валидации входных данных
const TEMP_MIN = 0;      // Минимальная температура в °C
const TEMP_MAX = 200;    // Максимальная температура в °C
const R_MIN = 0.0001;    // Минимальное сопротивление в Ом
const R_MAX = 1000000;   // Максимальное сопротивление в Ом

/**
 * Компонент таблицы для ввода и отображения данных измерений
 * 
 * Возможные улучшения:
 * 1. Добавить возможность удаления строк
 * 2. Добавить возможность сохранения/загрузки данных в JSON
 * 3. Добавить экспорт в Excel
 * 4. Добавить возможность отмены последнего действия (undo/redo)
 * 5. Добавить всплывающие подсказки с формулами расчета
 * 6. Добавить визуализацию погрешностей измерений
 * 7. Добавить возможность выбора единиц измерения
 */
export const DataTable: React.FC<DataTableProps> = ({ onDataChange }) => {
    // Состояние для хранения всех измерений
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

    // Состояние для хранения ошибок валидации
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    /**
     * Проверяет корректность введенного значения
     * @param field - Поле для проверки (температура или сопротивление)
     * @param value - Проверяемое значение
     * @returns Текст ошибки или null, если значение корректно
     */
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

    /**
     * Рассчитывает производные значения на основе введенных данных
     * - Температуру в Кельвинах
     * - Обратную температуру
     * - Проводимость
     * - Натуральный логарифм проводимости
     */
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

    /**
     * Рассчитывает энергию ионизации примесей
     * Использует формулы:
     * (12.21): A = (lnG₁ - lnG₂)/(1/T₁ - 1/T₂)
     * (12.22): ΔEᵢ = 2kA
     * 
     * Для лучшей точности использует точки с максимальной разницей температур
     */
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

    /**
     * Проверяет, заполнены ли все обязательные поля в последней строке
     * и нет ли ошибок валидации
     */
    const isLastRowFilled = () => {
        const lastMeasurement = measurements[measurements.length - 1];
        return lastMeasurement.temperature_c !== null && 
               lastMeasurement.resistance !== null &&
               Object.keys(errors).length === 0;
    };

    /**
     * Обработчик добавления новой строки измерений
     * Добавляет строку только если текущая заполнена корректно
     */
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

    /**
     * Обработчик удаления строки измерений
     * @param id - ID строки для удаления
     */
    const handleDeleteRow = (id: number) => {
        // Не позволяем удалить последнюю строку
        if (measurements.length <= 1) {
            alert('Нельзя удалить последнюю строку');
            return;
        }

        const newMeasurements = measurements
            .filter(m => m.id !== id)
            .map((m, index) => ({ ...m, id: index + 1 })); // Пересчитываем ID

        setMeasurements(newMeasurements);
        onDataChange(newMeasurements);
    };

    /**
     * Экспортирует данные в Excel
     */
    const exportToExcel = () => {
        // Подготавливаем данные для экспорта
        const exportData = measurements.map(m => ({
            '№': m.id,
            't (°C)': m.temperature_c ?? '',
            'T (K)': m.temperature_k?.toFixed(2) ?? '',
            '1/T (K⁻¹)': m.inverse_temperature?.toExponential(4) ?? '',
            'R (Ом)': m.resistance ?? '',
            'G (Ом⁻¹)': m.conductance?.toExponential(4) ?? '',
            'lnG': m.ln_conductance?.toFixed(4) ?? '',
            'ΔEᵢ (Дж)': m.ionization_energy?.toExponential(4) ?? ''
        }));

        // Создаем рабочую книгу
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Измерения');

        // Экспортируем файл
        XLSX.writeFile(wb, 'физика_измерения.xlsx');
    };

    /**
     * Обработчик изменения значений в полях ввода
     * Выполняет валидацию, расчет производных значений и энергии ионизации
     */
    const handleChange = (id: number, field: keyof Measurement, value: string) => {
        const numValue = parseFloat(value);
        const errorKey = `${id}-${field}`;

        // Проверяем введенное значение на корректность
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

        // Обновляем значения и рассчитываем производные
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Tooltip title="Экспорт в Excel">
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FileDownloadIcon />}
                        onClick={exportToExcel}
                        disabled={measurements.length === 0 || measurements.every(m => m.temperature_c === null && m.resistance === null)}
                    >
                        Экспорт в Excel
                    </Button>
                </Tooltip>
            </Box>
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
                            <TableCell>Действия</TableCell>
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
                                <TableCell>
                                    <Tooltip title="Удалить строку">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleDeleteRow(measurement.id)}
                                            disabled={measurements.length <= 1}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
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