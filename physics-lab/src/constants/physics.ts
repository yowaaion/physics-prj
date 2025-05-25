/**
 * Физические константы
 */
export const BOLTZMANN_CONSTANT = 1.380649e-23; // Постоянная Больцмана в Дж/К

/**
 * Ограничения для входных данных
 */
export const TEMPERATURE_LIMITS = {
    MIN: 0,    // Минимальная температура в °C
    MAX: 200   // Максимальная температура в °C
} as const;

export const RESISTANCE_LIMITS = {
    MIN: 0.0001,  // Минимальное сопротивление в Ом
    MAX: 1000000  // Максимальное сопротивление в Ом
} as const; 