/**
 * Интерфейс для хранения данных измерений
 */
export interface Measurement {
    id: number;
    temperature_c: number | null;      // Температура в Цельсиях
    temperature_k: number | null;      // Температура в Кельвинах
    inverse_temperature: number | null; // Обратная температура (1/T)
    resistance: number | null;         // Сопротивление в Омах
    conductance: number | null;        // Проводимость в Ом⁻¹
    ln_conductance: number | null;     // Натуральный логарифм проводимости
    ionization_energy: number | null;  // Энергия ионизации в Джоулях
} 