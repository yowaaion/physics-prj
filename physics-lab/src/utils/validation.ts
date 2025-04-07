import { Measurement } from '../types/measurement';
import { TEMPERATURE_LIMITS, RESISTANCE_LIMITS } from '../constants/physics';

/**
 * Проверяет корректность введенного значения
 */
export const validateValue = (field: keyof Measurement, value: number): string | null => {
    if (field === 'temperature_c') {
        if (value < TEMPERATURE_LIMITS.MIN) {
            return `Температура не может быть ниже ${TEMPERATURE_LIMITS.MIN}°C`;
        }
        if (value > TEMPERATURE_LIMITS.MAX) {
            return `Температура не может быть выше ${TEMPERATURE_LIMITS.MAX}°C`;
        }
    }
    if (field === 'resistance') {
        if (value < RESISTANCE_LIMITS.MIN) {
            return `Сопротивление не может быть меньше ${RESISTANCE_LIMITS.MIN} Ом`;
        }
        if (value > RESISTANCE_LIMITS.MAX) {
            return `Сопротивление не может быть больше ${RESISTANCE_LIMITS.MAX} Ом`;
        }
    }
    return null;
}; 