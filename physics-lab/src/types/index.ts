export interface Measurement {
    id: number;
    temperature_c: number | null;  // t в °C
    temperature_k: number | null;  // T в K
    inverse_temperature: number | null;  // 1/T в K⁻¹
    resistance: number | null;     // R в Ом
    conductance: number | null;    // G в Ом⁻¹
    ln_conductance: number | null; // lnG
    ionization_energy: number | null; // ΔEᵢ в Дж
}

export interface ChartData {
    inverse_temperature: number;
    ln_conductance: number;
} 