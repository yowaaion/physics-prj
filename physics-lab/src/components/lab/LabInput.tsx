import React, { useState, useEffect } from 'react';
import { Measurement } from '../../types/measurement';
import { validateValue } from '../../utils/validation';
import { calculateDerivedValues, calculateIonizationEnergy } from '../../utils/calculations';
import { saveMeasurements, loadMeasurements, clearMeasurements } from '../../utils/storage';

interface LabInputProps {
    onMeasurementsChange: (measurements: Measurement[]) => void;
}

export const LabInput: React.FC<LabInputProps> = ({ onMeasurementsChange }) => {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [currentMeasurement, setCurrentMeasurement] = useState<Measurement>({
        id: 1,
        temperature_c: null,
        temperature_k: null,
        inverse_temperature: null,
        resistance: null,
        conductance: null,
        ln_conductance: null,
        ionization_energy: null
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Загружаем сохраненные измерения при монтировании компонента
    useEffect(() => {
        const savedMeasurements = loadMeasurements();
        if (savedMeasurements.length > 0) {
            setMeasurements(savedMeasurements);
            onMeasurementsChange(savedMeasurements);
        }
    }, [onMeasurementsChange]);

    // Сохраняем измерения при их изменении
    useEffect(() => {
        if (measurements.length > 0) {
            saveMeasurements(measurements);
        }
    }, [measurements]);

    const handleInputChange = (field: keyof Measurement, value: string) => {
        const numValue = value === '' ? null : Number(value);
        const error = validateValue(field, numValue);
        
        setErrors(prev => ({
            ...prev,
            [field]: error || ''
        }));

        setCurrentMeasurement(prev => ({
            ...prev,
            [field]: numValue
        }));
    };

    const handleAddMeasurement = () => {
        // Проверяем наличие ошибок
        const hasErrors = Object.values(errors).some(error => error !== '');
        if (hasErrors) {
            return;
        }

        // Проверяем обязательные поля
        if (currentMeasurement.temperature_c === null || currentMeasurement.resistance === null) {
            return;
        }

        const newMeasurement = calculateDerivedValues(currentMeasurement);
        const updatedMeasurements = [...measurements, newMeasurement];
        const measurementsWithEnergy = calculateIonizationEnergy(updatedMeasurements);

        setMeasurements(measurementsWithEnergy);
        onMeasurementsChange(measurementsWithEnergy);

        // Очищаем форму для следующего измерения
        setCurrentMeasurement({
            id: measurements.length + 2,
            temperature_c: null,
            temperature_k: null,
            inverse_temperature: null,
            resistance: null,
            conductance: null,
            ln_conductance: null,
            ionization_energy: null
        });
        setErrors({});
    };

    const handleClearData = () => {
        setMeasurements([]);
        onMeasurementsChange([]);
        clearMeasurements();
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Температура (°C)
                    </label>
                    <input
                        type="number"
                        value={currentMeasurement.temperature_c ?? ''}
                        onChange={(e) => handleInputChange('temperature_c', e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.temperature_c ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.temperature_c && (
                        <p className="mt-1 text-sm text-red-600">{errors.temperature_c}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Сопротивление (Ом)
                    </label>
                    <input
                        type="number"
                        value={currentMeasurement.resistance ?? ''}
                        onChange={(e) => handleInputChange('resistance', e.target.value)}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors.resistance ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.resistance && (
                        <p className="mt-1 text-sm text-red-600">{errors.resistance}</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    onClick={handleClearData}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Очистить данные
                </button>
                <button
                    onClick={handleAddMeasurement}
                    disabled={Object.values(errors).some(error => error !== '')}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Добавить измерение
                </button>
            </div>
        </div>
    );
}; 