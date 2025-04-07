import { Measurement } from '../types/measurement';

export function validateValue(field: keyof Measurement, value: number): string | null {
    switch (field) {
        case 'temperature_c':
            if (value < -273.15) {
                return 'Температура не может быть ниже абсолютного нуля (-273.15°C)';
            }
            if (value > 1000) {
                return 'Температура не может быть выше 1000°C';
            }
            break;
            
        case 'resistance':
            if (value <= 0) {
                return 'Сопротивление должно быть положительным числом';
            }
            if (value > 1e6) {
                return 'Сопротивление не может быть больше 1 МОм';
            }
            break;
            
        case 'id':
            if (!Number.isInteger(value) || value < 1) {
                return 'ID должен быть положительным целым числом';
            }
            break;
    }
    
    return null;
} 