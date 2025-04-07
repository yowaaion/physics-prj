import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Measurement } from '../types/measurement';
import { calculateDerivedValues, calculateIonizationEnergy } from '../utils/calculations';
import { validateValue } from '../utils/validation';
import { loadMeasurements, saveMeasurements } from '../utils/storage';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

// Интерфейс определяет структуру контекста измерений
interface MeasurementsContextType {
    measurements: Measurement[];  // Массив всех измерений
    errors: {[key: string]: string};  // Объект для хранения ошибок валидации
    isLastRowFilled: () => boolean;  // Проверка заполнения последней строки
    handleAddRow: () => void;  // Добавление новой строки
    handleDeleteRow: (id: number) => void;  // Удаление строки по ID
    handleChange: (id: number, field: keyof Measurement, value: string) => void;  // Изменение значения в строке
}

// Создаем контекст с начальным значением undefined
const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

// Провайдер контекста измерений
export const MeasurementsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    // Инициализация состояния измерений с загрузкой данных из localStorage
    const [measurements, setMeasurements] = useState<Measurement[]>(() => {
        const savedMeasurements = loadMeasurements();
        return savedMeasurements.length > 0 ? savedMeasurements : [{
            id: 1,
            temperature_c: null,  // Температура в Цельсиях
            temperature_k: null,  // Температура в Кельвинах
            inverse_temperature: null,  // Обратная температура
            resistance: null,  // Сопротивление
            conductance: null,  // Проводимость
            ln_conductance: null,  // Логарифм проводимости
            ionization_energy: null  // Энергия ионизации
        }];
    });

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
               Object.keys(errors).length === 0;
    };

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
        
        setMeasurements(prevMeasurements => {
            const newMeasurements = [...prevMeasurements, newMeasurement];
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

    // Объект с данными и методами для контекста
    const value = {
        measurements,
        errors,
        isLastRowFilled,
        handleAddRow,
        handleDeleteRow,
        handleChange
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