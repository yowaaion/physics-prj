import { Measurement } from '../types/measurement';

/**
 * Валидирует введенное значение в зависимости от типа поля
 * @param field - тип поля измерения (температура, сопротивление или ID)
 * @param value - значение для проверки (может быть null)
 * @returns сообщение об ошибке или null, если значение валидно
 */
export const validateValue = (field: keyof Measurement, value: number | null): string | null => {
    // Если значение null, возвращаем null (поле необязательное)
    if (value === null) {
        return null;
    }

    switch (field) {
        case 'temperature_c':
            // Проверка температуры в Цельсиях (от -273.15 до 100)
            if (value < -273.15 || value > 100) {
                return 'Температура должна быть в диапазоне от -273.15°C до 100°C';
            }
            break;
        case 'resistance':
            // Проверка сопротивления (от 0 до 1e6 Ом)
            if (value <= 0 || value > 1e6) {
                return 'Сопротивление должно быть в диапазоне от 0 до 1 МОм';
            }
            break;
        case 'id':
            // Проверка ID (должен быть положительным)
            if (value <= 0) {
                return 'ID должен быть положительным числом';
            }
            break;
    }

    return null;
}; 