import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Typography,
    TextField,
    Fade,
    Zoom,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useMeasurements } from '../../context/MeasurementsContext';

/**
 * Компонент таблицы для ввода данных измерений
 */
export const DataTable: React.FC = () => {
    const { measurements, errors, handleChange, handleAddRow, handleDeleteRow } = useMeasurements();

    return (
        <Fade in={true} timeout={800}>
            <div style={{ width: '100%', marginTop: '20px' }}>
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        mb: 3,
                        '& .MuiTableCell-root': {
                            transition: 'background-color 0.3s'
                        },
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>T (°C)</TableCell>
                                <TableCell>T (K)</TableCell>
                                <TableCell>1/T (K⁻¹)</TableCell>
                                <TableCell>R (Ом)</TableCell>
                                <TableCell>G (Ом⁻¹)</TableCell>
                                <TableCell>ln(G)</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {measurements.map((row, index) => (
                                <Zoom 
                                    in={true} 
                                    timeout={500} 
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                    key={row.id}
                                >
                                    <TableRow>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={row.temperature_c ?? ''}
                                                onChange={(e) => handleChange(row.id, 'temperature_c', e.target.value)}
                                                error={!!errors[`${row.id}-temperature_c`]}
                                                helperText={errors[`${row.id}-temperature_c`]}
                                                size="small"
                                                inputProps={{
                                                    step: "0.1",
                                                    style: { width: '100px' }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        transition: 'all 0.3s'
                                                    },
                                                    '& .MuiOutlinedInput-root:hover': {
                                                        backgroundColor: 'rgba(25, 118, 210, 0.02)'
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Fade in={row.temperature_k !== null}>
                                                <Typography>{row.temperature_k?.toFixed(2) ?? ''}</Typography>
                                            </Fade>
                                        </TableCell>
                                        <TableCell>
                                            <Fade in={row.inverse_temperature !== null}>
                                                <Typography>{row.inverse_temperature?.toExponential(4) ?? ''}</Typography>
                                            </Fade>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={row.resistance ?? ''}
                                                onChange={(e) => handleChange(row.id, 'resistance', e.target.value)}
                                                error={!!errors[`${row.id}-resistance`]}
                                                helperText={errors[`${row.id}-resistance`]}
                                                size="small"
                                                inputProps={{
                                                    step: "0.1",
                                                    style: { width: '100px' }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        transition: 'all 0.3s'
                                                    },
                                                    '& .MuiOutlinedInput-root:hover': {
                                                        backgroundColor: 'rgba(25, 118, 210, 0.02)'
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Fade in={row.conductance !== null}>
                                                <Typography>{row.conductance?.toExponential(4) ?? ''}</Typography>
                                            </Fade>
                                        </TableCell>
                                        <TableCell>
                                            <Fade in={row.ln_conductance !== null}>
                                                <Typography>{row.ln_conductance?.toFixed(4) ?? ''}</Typography>
                                            </Fade>
                                        </TableCell>
                                        <TableCell>
                                            <Zoom in={true}>
                                                <IconButton 
                                                    onClick={() => handleDeleteRow(row.id)}
                                                    color="error"
                                                    size="small"
                                                    sx={{
                                                        transition: 'all 0.3s',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Zoom>
                                        </TableCell>
                                    </TableRow>
                                </Zoom>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Zoom in={true}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddRow}
                            startIcon={<AddIcon />}
                            sx={{
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            Добавить измерение
                        </Button>
                    </Zoom>
                </Box>
            </div>
        </Fade>
    );
}; 