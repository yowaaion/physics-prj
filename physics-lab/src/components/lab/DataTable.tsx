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
    Box,
    Tabs,
    Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useMeasurements } from '../../context/MeasurementsContext';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`measurement-tabpanel-${index}`}
            aria-labelledby={`measurement-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

/**
 * Компонент таблицы для ввода данных измерений
 * Отображает таблицу с полями для ввода температуры и сопротивления,
 * а также автоматически вычисляемыми производными величинами
 */
export const DataTable: React.FC = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const { measurements, acousticMeasurements, errors, handleChange, handleAddRow, handleDeleteRow,
            handleAcousticChange, handleAddAcousticRow, handleDeleteAcousticRow } = useMeasurements();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const renderResistanceTable = () => (
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
    );

    const renderAcousticTable = () => (
        <>
            <Box sx={{ 
                mb: 2, 
                p: 2, 
                borderRadius: 1, 
                bgcolor: 'rgba(25, 118, 210, 0.04)', 
                border: '1px dashed rgba(25, 118, 210, 0.5)'
            }}>
                <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                    Акустооптический метод измерения затухания ультразвука
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Введите координаты X₁, X₂ (в миллиметрах), отношение интенсивностей ΔI/I₀ и частоту ультразвука (в МГц) для расчета
                    коэффициента затухания α по формуле: α = 10 lg(ΔI/I₀) / (X₂-X₁) [дБ/мм]
                </Typography>
            </Box>
            
            <TableContainer 
                component={Paper} 
                sx={{ 
                    mb: 3,
                    '& .MuiTableCell-root': {
                        transition: 'background-color 0.3s'
                    },
                    '& .MuiTableRow-root:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    },
                    boxShadow: 2,
                    borderRadius: 2,
                    overflow: {xs: 'auto', md: 'hidden'}
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                            <TableCell align="center" width="60px" sx={{ fontWeight: 'bold' }}>№</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>X₁ (мм)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>X₂ (мм)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>ΔI/I₀</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>f (МГц)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>λ (мм)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>ΔX (мм)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>α (дБ/мм)</TableCell>
                            <TableCell align="center" width="80px" sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {acousticMeasurements.map((row, index) => (
                            <Zoom 
                                in={true} 
                                timeout={500} 
                                style={{ transitionDelay: `${index * 100}ms` }}
                                key={row.id}
                            >
                                <TableRow sx={{ 
                                    '&:nth-of-type(odd)': { 
                                        bgcolor: 'rgba(0, 0, 0, 0.02)'
                                    }
                                }}>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={row.x1 ?? ''}
                                            onChange={(e) => handleAcousticChange(row.id, 'x1', e.target.value)}
                                            error={!!errors[`${row.id}-x1`]}
                                            helperText={errors[`${row.id}-x1`]}
                                            size="small"
                                            inputProps={{
                                                step: "0.1",
                                                style: { width: '100px' }
                                            }}
                                            placeholder="Введите X₁"
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
                                        <TextField
                                            type="number"
                                            value={row.x2 ?? ''}
                                            onChange={(e) => handleAcousticChange(row.id, 'x2', e.target.value)}
                                            error={!!errors[`${row.id}-x2`]}
                                            helperText={errors[`${row.id}-x2`]}
                                            size="small"
                                            inputProps={{
                                                step: "0.1",
                                                style: { width: '100px' }
                                            }}
                                            placeholder="Введите X₂"
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
                                        <TextField
                                            type="number"
                                            value={row.deltaI ?? ''}
                                            onChange={(e) => handleAcousticChange(row.id, 'deltaI', e.target.value)}
                                            error={!!errors[`${row.id}-deltaI`]}
                                            helperText={errors[`${row.id}-deltaI`]}
                                            size="small"
                                            inputProps={{
                                                step: "0.01",
                                                style: { width: '100px' }
                                            }}
                                            placeholder="Введите ΔI/I₀"
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
                                        <TextField
                                            type="number"
                                            value={row.frequency ?? ''}
                                            onChange={(e) => handleAcousticChange(row.id, 'frequency', e.target.value)}
                                            error={!!errors[`${row.id}-frequency`]}
                                            helperText={errors[`${row.id}-frequency`]}
                                            size="small"
                                            inputProps={{
                                                step: "1",
                                                style: { width: '100px' }
                                            }}
                                            placeholder="Частота"
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
                                    <TableCell align="center">
                                        <Fade in={row.wavelength !== null}>
                                            <Typography 
                                                sx={{ 
                                                    fontWeight: 'medium',
                                                    color: 'text.secondary',
                                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                                    py: 0.5,
                                                    px: 1,
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {row.wavelength?.toFixed(3) ?? ''}
                                            </Typography>
                                        </Fade>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Fade in={row.pathLength !== null}>
                                            <Typography 
                                                sx={{ 
                                                    fontWeight: 'medium',
                                                    color: 'text.secondary',
                                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                                    py: 0.5,
                                                    px: 1,
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {row.pathLength?.toFixed(2) ?? ''}
                                            </Typography>
                                        </Fade>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Fade in={row.alpha !== null}>
                                            <Typography 
                                                sx={{ 
                                                    fontWeight: 'medium',
                                                    color: 'primary.main',
                                                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                                                    py: 0.5,
                                                    px: 1,
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {row.alpha?.toFixed(4) ?? ''}
                                            </Typography>
                                        </Fade>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Zoom in={true}>
                                            <IconButton 
                                                onClick={() => handleDeleteAcousticRow(row.id)}
                                                color="error"
                                                size="small"
                                                sx={{
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                        transform: 'scale(1.1)'
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
                        {/* Строка с расчетом среднего значения */}
                        {acousticMeasurements.length > 1 && (
                            <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.12)' }}>
                                <TableCell colSpan={7} align="right" sx={{ fontWeight: 'bold' }}>
                                    Среднее значение α:
                                </TableCell>
                                <TableCell align="center">
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {calculateAverageAlpha()}
                                    </Typography>
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );

    // Функция для расчета среднего значения коэффициента затухания
    const calculateAverageAlpha = () => {
        const validAlphas = acousticMeasurements
            .filter(m => m.alpha !== null)
            .map(m => m.alpha as number);
        
        if (validAlphas.length === 0) return "-";
        
        const avgAlpha = validAlphas.reduce((sum, alpha) => sum + alpha, 0) / validAlphas.length;
        return avgAlpha.toFixed(4) + " дБ/мм";
    };

    return (
        <Fade in={true} timeout={800}>
            <div style={{ width: '100%', marginTop: '20px' }}>
                <Box sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    mb: 2,
                    '& .MuiTabs-flexContainer': {
                        justifyContent: 'center'
                    },
                    '& .MuiTab-root': {
                        fontWeight: 'medium',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                    }
                }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        aria-label="measurement tabs" 
                        variant="fullWidth"
                        centered
                        sx={{
                            '& .MuiTabs-indicator': {
                                height: 3,
                                borderTopLeftRadius: 3,
                                borderTopRightRadius: 3
                            }
                        }}
                    >
                        <Tab label="Измерения сопротивления" />
                        <Tab label="Акустооптические измерения" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {renderResistanceTable()}
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
                                        transform: 'scale(1.05)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                Добавить измерение
                            </Button>
                        </Zoom>
                    </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {renderAcousticTable()}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Zoom in={true}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddAcousticRow}
                                startIcon={<AddIcon />}
                                sx={{
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                Добавить акустическое измерение
                            </Button>
                        </Zoom>
                    </Box>
                </TabPanel>
            </div>
        </Fade>
    );
}; 