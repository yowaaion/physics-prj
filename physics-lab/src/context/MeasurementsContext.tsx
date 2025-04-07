import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Measurement } from '../types/measurement';
import { calculateDerivedValues, calculateIonizationEnergy } from '../utils/calculations';
import { validateValue } from '../utils/validation';

interface MeasurementsContextType {
    measurements: Measurement[];
    errors: {[key: string]: string};
    isLastRowFilled: () => boolean;
    handleAddRow: () => void;
    handleDeleteRow: (id: number) => void;
    handleChange: (id: number, field: keyof Measurement, value: string) => void;
}

const MeasurementsContext = createContext<MeasurementsContextType | undefined>(undefined);

export const MeasurementsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
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
        
        setMeasurements(prevMeasurements => {
            const newMeasurements = [...prevMeasurements, newMeasurement];
            return calculateIonizationEnergy(newMeasurements);
        });
    };

    const handleDeleteRow = (id: number) => {
        if (measurements.length <= 1) {
            alert('Нельзя удалить последнюю строку');
            return;
        }

        setMeasurements(prevMeasurements => {
            const newMeasurements = prevMeasurements
                .filter(m => m.id !== id)
                .map((m, index) => ({ ...m, id: index + 1 }));
            return calculateIonizationEnergy(newMeasurements);
        });
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

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[errorKey];
            return newErrors;
        });

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
        </MeasurementsContext.Provider>
    );
};

export const useMeasurements = () => {
    const context = useContext(MeasurementsContext);
    if (context === undefined) {
        throw new Error('useMeasurements must be used within a MeasurementsProvider');
    }
    return context;
}; 