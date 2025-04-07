import { Measurement } from '../types/measurement';
import { BOLTZMANN_CONSTANT } from '../constants/physics';

/**
 * Рассчитывает производные значения на основе введенных данных
 */
export const calculateDerivedValues = (measurement: Measurement): Measurement => {
    const temperature_k = measurement.temperature_c !== null 
        ? measurement.temperature_c + 273 
        : null;
    
    const inverse_temperature = temperature_k !== null 
        ? 1 / temperature_k 
        : null;
    
    const conductance = measurement.resistance !== null 
        ? 1 / measurement.resistance 
        : null;
    
    const ln_conductance = conductance !== null 
        ? Math.log(conductance) 
        : null;

    return {
        ...measurement,
        temperature_k,
        inverse_temperature,
        conductance,
        ln_conductance
    };
};

/**
 * Рассчитывает энергию ионизации примесей
 * Использует формулы:
 * (12.21): A = (lnG₁ - lnG₂)/(1/T₁ - 1/T₂)
 * (12.22): ΔEᵢ = 2kA
 */
export const calculateIonizationEnergy = (measurements: Measurement[]): Measurement[] => {
    const validPoints = measurements.filter(m => 
        m.inverse_temperature !== null && 
        m.ln_conductance !== null
    ).sort((a, b) => (a.temperature_k || 0) - (b.temperature_k || 0));

    if (validPoints.length >= 2) {
        const point1 = validPoints[0];
        const point2 = validPoints[validPoints.length - 1];

        if (point1.inverse_temperature && point2.inverse_temperature &&
            point1.ln_conductance && point2.ln_conductance) {
            
            const A = (point1.ln_conductance - point2.ln_conductance) / 
                     (point1.inverse_temperature - point2.inverse_temperature);
            
            const deltaE = 2 * BOLTZMANN_CONSTANT * A;

            return measurements.map(m => ({
                ...m,
                ionization_energy: deltaE
            }));
        }
    }
    return measurements;
}; 