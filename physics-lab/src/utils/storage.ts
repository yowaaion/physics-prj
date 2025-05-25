import { Measurement } from '../types/measurement';

const STORAGE_KEY = 'physics_lab_measurements';

/**
 * Сохраняет измерения в localStorage
 * @param measurements - массив измерений для сохранения
 */
export const saveMeasurements = (measurements: Measurement[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
    }
};

/**
 * Загружает измерения из localStorage
 * @returns массив измерений или пустой массив, если данных нет
 */
export const loadMeasurements = (): Measurement[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return [];
    }
};

/**
 * Очищает все сохраненные измерения
 */
export const clearMeasurements = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Ошибка при очистке данных:', error);
    }
}; 