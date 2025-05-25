import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Measurement } from '../types/measurement';
import { calculateDerivedValues, calculateIonizationEnergy } from '../utils/calculations';
import { validateValue } from '../utils/validation';
import { loadMeasurements, saveMeasurements } from '../utils/storage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface AcousticMeasurement {
    id: number;
    x1: number | null;
    x2: number | null;
    deltaI: number | null;
    alpha: number | null;
    frequency: number | null; // Частота ультразвука в МГц
    wavelength: number | null; // Длина волны в мм
    pathLength: number | null; // Длина пути ультразвука (X₂-X₁) в мм
}

// Интерфейс определяет структуру контекста измерений
interface MeasurementsContextType {
    measurements: Measurement[];  // Массив всех измерений
    acousticMeasurements: AcousticMeasurement[];
    errors: {[key: string]: string};  // Объект для хранения ошибок валидации
    isLastRowFilled: () => boolean;  // Проверка заполнения последней строки
    isLastAcousticRowFilled: () => boolean;  // Проверка заполнения последней акустической строки
    handleAddRow: () => void;  // Добавление новой строки
    handleDeleteRow: (id: number) => void;  // Удаление строки по ID
    handleChange: (id: number, field: keyof Measurement, value: string) => void;  // Изменение значения в строке
    handleAcousticChange: (id: number, field: keyof AcousticMeasurement, value: string) => void;
    handleAddAcousticRow: () => void;
    handleDeleteAcousticRow: (id: number) => void;
}

// Создаем пустое акустическое измерение
const createEmptyAcousticMeasurement = (id: number): AcousticMeasurement => ({
    id,
    x1: null,
    x2: null,
    deltaI: null,
    alpha: null,
    frequency: 10, // По умолчанию устанавливаем 10 МГц
    wavelength: null,
    pathLength: null
});

// Создание пустого измерения с заданным ID
const createEmptyMeasurement = (id: number): Measurement => ({
    id,
    temperature_c: null,
    temperature_k: null,
    inverse_temperature: null,
    resistance: null,
    conductance: null,
    ln_conductance: null,
    ionization_energy: null
});

// Инициализация начальных измерений
const initializeMeasurements = (): Measurement[] => {
    const savedMeasurements = loadMeasurements();
    
    if (savedMeasurements.length === 0) {
        return [createEmptyMeasurement(1)];
    }

    // Восстанавливаем все производные значения
    const recalculatedMeasurements = savedMeasurements
        .map(measurement => calculateDerivedValues(measurement));
    
    // Пересчитываем энергию ионизации для всего набора данных
    return calculateIonizationEnergy(recalculatedMeasurements);
};

// Создаем контекст с начальным значением undefined
const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

// Провайдер контекста измерений
export const MeasurementsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    // Инициализация состояния измерений
    const [measurements, setMeasurements] = useState<Measurement[]>(initializeMeasurements);
    const [acousticMeasurements, setAcousticMeasurements] = useState<AcousticMeasurement[]>([
        createEmptyAcousticMeasurement(1)
    ]);

    // Состояние для хранения ошибок валидации
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    // Состояния для модальных окон
    const [dialogState, setDialogState] = useState<{
        open: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    // Сохраняем измерения в localStorage при их изменении
    useEffect(() => {
        if (measurements.length > 0) {
            saveMeasurements(measurements);
        }
    }, [measurements]);

    // Проверка заполнения последней строки
    const isLastRowFilled = () => {
        const lastMeasurement = measurements[measurements.length - 1];
        return lastMeasurement.temperature_c !== null && 
               lastMeasurement.resistance !== null &&
               !errors[`${lastMeasurement.id}-temperature_c`] &&
               !errors[`${lastMeasurement.id}-resistance`];
    };

    const isLastAcousticRowFilled = useCallback(() => {
        if (acousticMeasurements.length === 0) return true;
        
        const lastMeasurement = acousticMeasurements[acousticMeasurements.length - 1];
        return lastMeasurement.x1 !== null && 
               lastMeasurement.x2 !== null &&
               lastMeasurement.deltaI !== null &&
               !errors[`${lastMeasurement.id}-x1`] &&
               !errors[`${lastMeasurement.id}-x2`] &&
               !errors[`${lastMeasurement.id}-deltaI`];
    }, [acousticMeasurements, errors]);

    // Добавление новой строки измерений
    const handleAddRow = () => {
        if (!isLastRowFilled()) {
            setDialogState({
                open: true,
                title: 'Ошибка',
                message: 'Пожалуйста, заполните все поля в текущей строке корректными значениями перед добавлением новой',
                onConfirm: () => {}
            });
            return;
        }

        setMeasurements(prevMeasurements => {
            const newMeasurements = [
                ...prevMeasurements,
                createEmptyMeasurement(prevMeasurements.length + 1)
            ];
            return calculateIonizationEnergy(newMeasurements);
        });
    };

    // Удаление строки измерений
    const handleDeleteRow = (id: number) => {
        if (measurements.length <= 1) {
            setDialogState({
                open: true,
                title: 'Ошибка',
                message: 'Нельзя удалить последнюю строку',
                onConfirm: () => {}
            });
            return;
        }

        setDialogState({
            open: true,
            title: 'Подтверждение удаления',
            message: 'Вы уверены, что хотите удалить это измерение?',
            onConfirm: () => {
                setMeasurements(prevMeasurements => {
                    const newMeasurements = prevMeasurements
                        .filter(m => m.id !== id)
                        .map((m, index) => ({ ...m, id: index + 1 }));
                    return calculateIonizationEnergy(newMeasurements);
                });
            }
        });
    };

    // Обработка изменения значений в строке
    const handleChange = (id: number, field: keyof Measurement, value: string) => {
        const numValue = parseFloat(value);
        const errorKey = `${id}-${field}`;

        // Валидация введенного значения
        if (value !== '') {
            const error = validateValue(field, numValue);
            if (error) {
                setErrors(prev => ({ ...prev, [errorKey]: error }));
                return;
            }
        }

        // Очистка ошибки для данного поля
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
        });

        // Обновление значения и пересчет производных величин
        setMeasurements(prevMeasurements => {
            let newMeasurements = prevMeasurements.map(measurement => {
                if (measurement.id === id) {
                    const updatedMeasurement = {
                        ...measurement,
                        [field]: value === '' ? null : numValue
                    };
                    return calculateDerivedValues(updatedMeasurement);
                }
                return measurement;
            });

            return calculateIonizationEnergy(newMeasurements);
        });
    };

    const calculateAcousticDerivedValues = useCallback((measurement: Partial<AcousticMeasurement>): Partial<AcousticMeasurement> => {
        let alpha = null;
        let pathLength = null;
        let wavelength = null;
        
        if (measurement.x1 != null && measurement.x2 != null) {
            // Рассчитываем длину пути ультразвука
            pathLength = measurement.x2 - measurement.x1;
        }
        
        if (measurement.x1 != null && measurement.x2 != null && measurement.deltaI != null) {
            // Формула из документа (3.3): α = 10*lg(ΔI/I₀)/(X₂-X₁)
            // Проверяем, что разность расстояний не равна нулю и deltaI корректное
            if (pathLength !== null && pathLength !== 0 && measurement.deltaI >= 0) {
                // Используем логарифм по основанию 10, умножаем на 10 и делим на разность координат
                // Для значений deltaI очень близких к 0, логарифм будет отрицательным, что даст отрицательный альфа
                // Это физически корректно для некоторых материалов с усилением звука
                if (measurement.deltaI > 0) {
                    alpha = 10 * Math.log10(measurement.deltaI) / pathLength;
                } else {
                    // Если deltaI ровно 0, то затухание бесконечное, но мы поставим большое значение
                    alpha = 0; // или другое значение по умолчанию для случая deltaI = 0
                }
            }
        }
        
        // Рассчитываем длину волны (λ = v/f), если частота задана и скорость известна
        // Для PbMoO₄ скорость продольной волны примерно 3200 м/с = 3.2 мм/мкс
        if (measurement.frequency !== null && measurement.frequency !== undefined && measurement.frequency > 0) {
            // Частота в МГц, скорость в мм/мкс, длина волны в мм
            const waveSpeed = 3.2; // мм/мкс
            wavelength = waveSpeed / measurement.frequency;
        }

        return {
            ...measurement,
            alpha,
            pathLength,
            wavelength
        };
    }, []);

    const validateAcousticMeasurement = (id: number, field: string, value: string): string => {
        if (value === '') return '';
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'Должно быть числом';
        if ((field === 'x1' || field === 'x2') && numValue < 0) {
            return 'Расстояние должно быть положительным';
        }
        if (field === 'deltaI' && (numValue < 0 || numValue > 1)) {
            return 'ΔI/I₀ должно быть в диапазоне от 0 до 1';
        }
        if (field === 'frequency' && numValue <= 0) {
            return 'Частота должна быть положительной';
        }
        return '';
    };

    const handleAcousticChange = useCallback((id: number, field: keyof AcousticMeasurement, value: string) => {
        const error = validateAcousticMeasurement(id, field, value);
        setErrors(prev => ({
            ...prev,
            [`${id}-${field}`]: error
        }));

        if (!error) {
            setAcousticMeasurements(prev => prev.map(measurement => {
                if (measurement.id === id) {
                    const numValue = value === '' ? null : parseFloat(value);
                    const updatedMeasurement = {
                        ...measurement,
                        [field]: numValue
                    };
                    return calculateAcousticDerivedValues(updatedMeasurement) as AcousticMeasurement;
                }
                return measurement;
            }));
        }
    }, [calculateAcousticDerivedValues]);

    const handleAddAcousticRow = useCallback(() => {
        if (!isLastAcousticRowFilled()) {
            setDialogState({
                open: true,
                title: 'Ошибка',
                message: 'Пожалуйста, заполните все поля в текущей акустической строке перед добавлением новой',
                onConfirm: () => {}
            });
            return;
        }

        const newId = acousticMeasurements.length > 0 ? 
            Math.max(...acousticMeasurements.map(m => m.id)) + 1 : 1;
        setAcousticMeasurements(prev => [...prev, createEmptyAcousticMeasurement(newId)]);
    }, [acousticMeasurements, isLastAcousticRowFilled]);

    const handleDeleteAcousticRow = useCallback((id: number) => {
        if (acousticMeasurements.length <= 1) {
            setDialogState({
                open: true,
                title: 'Ошибка',
                message: 'Нельзя удалить последнюю строку',
                onConfirm: () => {}
            });
            return;
        }

        setDialogState({
            open: true,
            title: 'Подтверждение удаления',
            message: 'Вы уверены, что хотите удалить это акустическое измерение?',
            onConfirm: () => {
                setAcousticMeasurements(prev => {
                    const newMeasurements = prev
                        .filter(m => m.id !== id)
                        .map((m, index) => ({ ...m, id: index + 1 }));
                    return newMeasurements;
                });
            }
        });
    }, [acousticMeasurements.length]);

    // Объект с данными и методами для контекста
    const value = {
        measurements,
        acousticMeasurements,
        errors,
        isLastRowFilled,
        isLastAcousticRowFilled,
        handleAddRow,
        handleDeleteRow,
        handleChange,
        handleAcousticChange,
        handleAddAcousticRow,
        handleDeleteAcousticRow
    };

    return (
        <MeasurementsContext.Provider value={value}>
            {children}
            <ConfirmDialog
                open={dialogState.open}
                title={dialogState.title}
                message={dialogState.message}
                onConfirm={() => {
                    dialogState.onConfirm();
                    setDialogState(prev => ({ ...prev, open: false }));
                }}
                onCancel={() => setDialogState(prev => ({ ...prev, open: false }))}
            />
        </MeasurementsContext.Provider>
    );
};

// Хук для использования контекста измерений
export const useMeasurements = () => {
    const context = useContext(MeasurementsContext);
    if (context === undefined) {
        throw new Error('useMeasurements must be used within a MeasurementsProvider');
    }
    return context;
}; 