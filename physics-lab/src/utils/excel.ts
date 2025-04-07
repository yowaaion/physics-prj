import * as XLSX from 'xlsx';
import { Measurement } from '../types/measurement';

/**
 * Экспортирует данные измерений в Excel файл
 * Создает таблицу со всеми измеренными и вычисленными значениями
 * 
 * @param measurements - Массив измерений для экспорта
 */
export const exportToExcel = (measurements: Measurement[]) => {
    // Преобразуем данные измерений в формат для Excel
    const exportData = measurements.map(m => ({
        '№': m.id,  // Номер измерения
        't (°C)': m.temperature_c ?? '',  // Температура в Цельсиях
        'T (K)': m.temperature_k?.toFixed(2) ?? '',  // Температура в Кельвинах
        '1/T (K⁻¹)': m.inverse_temperature?.toExponential(4) ?? '',  // Обратная температура
        'R (Ом)': m.resistance ?? '',  // Сопротивление
        'G (Ом⁻¹)': m.conductance?.toExponential(4) ?? '',  // Проводимость
        'lnG': m.ln_conductance?.toFixed(4) ?? '',  // Логарифм проводимости
        'ΔEᵢ (Дж)': m.ionization_energy?.toExponential(4) ?? ''  // Энергия ионизации
    }));

    // Создаем рабочий лист из данных
    const ws = XLSX.utils.json_to_sheet(exportData);
    // Создаем новую книгу Excel
    const wb = XLSX.utils.book_new();
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, 'Измерения');
    // Сохраняем файл
    XLSX.writeFile(wb, 'физика_измерения.xlsx');
}; 