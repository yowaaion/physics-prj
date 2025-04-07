import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    IconButton,
    Tooltip,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Measurement } from '../../types/measurement';
import { useMeasurements } from '../../hooks/useMeasurements';
import { exportToExcel } from '../../utils/excel';
import { TEMPERATURE_LIMITS, RESISTANCE_LIMITS } from '../../constants/physics';

interface DataTableProps {
    onDataChange: (data: Measurement[]) => void;
}

/**
 * Компонент таблицы для ввода и отображения данных измерений
 */
export const DataTable: React.FC<DataTableProps> = ({ onDataChange }) => {
    const {
        measurements,
        errors,
        isLastRowFilled,
        handleAddRow,
        handleDeleteRow,
        handleChange
    } = useMeasurements(onDataChange);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Tooltip title="Экспорт в Excel">
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FileDownloadIcon />}
                        onClick={() => exportToExcel(measurements)}
                        disabled={measurements.length === 0 || measurements.every(m => m.temperature_c === null && m.resistance === null)}
                    >
                        Экспорт в Excel
                    </Button>
                </Tooltip>
            </Box>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>№</TableCell>
                            <TableCell>t (°C)</TableCell>
                            <TableCell>T (K)</TableCell>
                            <TableCell>1/T (K⁻¹)</TableCell>
                            <TableCell>R (Ом)</TableCell>
                            <TableCell>G (Ом⁻¹)</TableCell>
                            <TableCell>lnG</TableCell>
                            <TableCell>ΔEᵢ (Дж)</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {measurements.map((measurement) => (
                            <TableRow key={measurement.id}>
                                <TableCell>{measurement.id}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={measurement.temperature_c ?? ''}
                                        onChange={(e) => handleChange(measurement.id, 'temperature_c', e.target.value)}
                                        size="small"
                                        error={!!errors[`${measurement.id}-temperature_c`]}
                                        helperText={errors[`${measurement.id}-temperature_c`]}
                                        inputProps={{
                                            min: TEMPERATURE_LIMITS.MIN,
                                            max: TEMPERATURE_LIMITS.MAX,
                                            step: "0.1"
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {measurement.temperature_k?.toFixed(2) ?? ''}
                                </TableCell>
                                <TableCell>
                                    {measurement.inverse_temperature?.toExponential(4) ?? ''}
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={measurement.resistance ?? ''}
                                        onChange={(e) => handleChange(measurement.id, 'resistance', e.target.value)}
                                        size="small"
                                        error={!!errors[`${measurement.id}-resistance`]}
                                        helperText={errors[`${measurement.id}-resistance`]}
                                        inputProps={{
                                            min: RESISTANCE_LIMITS.MIN,
                                            max: RESISTANCE_LIMITS.MAX,
                                            step: "0.0001"
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    {measurement.conductance?.toExponential(4) ?? ''}
                                </TableCell>
                                <TableCell>
                                    {measurement.ln_conductance?.toFixed(4) ?? ''}
                                </TableCell>
                                <TableCell>
                                    {measurement.ionization_energy?.toExponential(4) ?? ''}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Удалить строку">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleDeleteRow(measurement.id)}
                                            disabled={measurements.length <= 1}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddRow}
                style={{ marginTop: '1rem' }}
                disabled={!isLastRowFilled()}
            >
                Добавить измерение
            </Button>
        </div>
    );
}; 