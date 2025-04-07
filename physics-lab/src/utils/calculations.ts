import { Measurement } from '../types/measurement';

const BOLTZMANN_CONSTANT = 1.380649e-23; // Джоуль/Кельвин

/**
 * Рассчитывает производные значения на основе введенных данных
 * Вычисляет:
 * - Температуру в Кельвинах
 * - Обратную температуру
 * - Проводимость
 * - Натуральный логарифм проводимости
 */
export function calculateDerivedValues(measurement: Measurement): Measurement {
    const { temperature_c, resistance } = measurement;

    if (temperature_c === null || resistance === null) {
        return {
            ...measurement,
            temperature_k: null,
            inverse_temperature: null,
            conductance: null,
            ln_conductance: null
        };
    }

    const temperature_k = temperature_c + 273.15;
    const inverse_temperature = 1 / temperature_k;
    const conductance = 1 / resistance;
    const ln_conductance = Math.log(conductance);

    return {
        ...measurement,
        temperature_k,
        inverse_temperature,
        conductance,
        ln_conductance
    };
}

/**
 * Рассчитывает энергию ионизации примесей
 * Использует метод линейной регрессии для нахождения зависимости ln(G) от 1/T
 * 
 * Формулы:
 * (12.21): A = (lnG₁ - lnG₂)/(1/T₁ - 1/T₂)
 * (12.22): ΔEᵢ = 2kA
 * 
 * где:
 * - G - проводимость
 * - T - температура
 * - k - постоянная Больцмана
 * - ΔEᵢ - энергия ионизации
 */
export function calculateIonizationEnergy(measurements: Measurement[]): Measurement[] {
    const validMeasurements = measurements.filter(m => 
        m.inverse_temperature !== null && 
        m.ln_conductance !== null
    );

    if (validMeasurements.length < 2) {
        return measurements.map(m => ({ ...m, ionization_energy: null }));
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    const n = validMeasurements.length;

    for (const m of validMeasurements) {
        const x = m.inverse_temperature!;
        const y = m.ln_conductance!;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    const ionization_energy = -2 * BOLTZMANN_CONSTANT * slope;

    return measurements.map(m => ({ ...m, ionization_energy }));
} 