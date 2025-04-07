import * as XLSX from 'xlsx';
import { Measurement } from '../types/measurement';

/**
 * Экспортирует данные измерений в Excel файл
 */
export const exportToExcel = (measurements: Measurement[]) => {
    const exportData = measurements.map(m => ({
        '№': m.id,
        't (°C)': m.temperature_c ?? '',
        'T (K)': m.temperature_k?.toFixed(2) ?? '',
        '1/T (K⁻¹)': m.inverse_temperature?.toExponential(4) ?? '',
        'R (Ом)': m.resistance ?? '',
        'G (Ом⁻¹)': m.conductance?.toExponential(4) ?? '',
        'lnG': m.ln_conductance?.toFixed(4) ?? '',
        'ΔEᵢ (Дж)': m.ionization_energy?.toExponential(4) ?? ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Измерения');
    XLSX.writeFile(wb, 'физика_измерения.xlsx');
}; 