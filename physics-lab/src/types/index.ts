/**
 * Интерфейс для хранения данных измерений
 * Описывает структуру данных для одного измерения в эксперименте
 */
export interface Measurement {
    id: number;                        // Уникальный идентификатор измерения
    temperature_c: number | null;      // Температура в Цельсиях (измеренное значение)
    temperature_k: number | null;      // Температура в Кельвинах (вычисляется как T = t + 273.15)
    inverse_temperature: number | null; // Обратная температура (1/T) в Кельвинах⁻¹
    resistance: number | null;         // Сопротивление в Омах (измеренное значение)
    conductance: number | null;        // Проводимость в Ом⁻¹ (вычисляется как G = 1/R)
    ln_conductance: number | null;     // Натуральный логарифм проводимости (вычисляется как ln(G))
    ionization_energy: number | null;  // Энергия ионизации в Джоулях (вычисляется по формуле ΔEᵢ = -2k * slope)
}

/**
 * Интерфейс для данных графика
 * Используется для построения графика зависимости ln(G) от 1/T
 */
export interface ChartData {
    inverse_temperature: number;  // Обратная температура (1/T) в Кельвинах⁻¹
    ln_conductance: number;      // Натуральный логарифм проводимости
} 