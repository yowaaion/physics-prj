import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Box,
    Paper,
    Fade,
    Grow,
    Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LAB_DESCRIPTIONS } from '../../constants/descriptions';

/**
 * Компонент для отображения описания лабораторной работы
 * Включает теоретическую часть, порядок выполнения и формулы
 * Использует аккордеон для организации контента
 */
const LabDescription: React.FC = () => {
    // Состояние для отслеживания открытой секции аккордеона
    const [expanded, setExpanded] = useState<string | false>(false);
    // Состояние для управления анимацией появления контента
    const [showContent, setShowContent] = useState(false);

    // Эффект для отложенного появления контента
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // Обработчик изменения состояния аккордеона
    const handleChange = (panel: string) => (
        event: React.SyntheticEvent,
        isExpanded: boolean
    ) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        // Анимация появления всего компонента
        <Fade in={showContent} timeout={1000}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                {/* Анимация появления заголовка */}
                <Grow in={showContent} timeout={800}>
                    <div>
                        <Typography variant="h4" gutterBottom>
                            {LAB_DESCRIPTIONS.title}
                        </Typography>
                        
                        <Typography 
                            variant="h6" 
                            color="primary" 
                            gutterBottom 
                            sx={{ 
                                borderLeft: '4px solid',
                                pl: 2,
                                my: 3
                            }}
                        >
                            {LAB_DESCRIPTIONS.purpose}
                        </Typography>
                    </div>
                </Grow>

                {/* Секции с описанием */}
                <Box sx={{ mt: 4 }}>
                    {/* Секция теоретической части */}
                    <Accordion
                        expanded={expanded === 'theory'}
                        onChange={handleChange('theory')}
                        TransitionProps={{ unmountOnExit: true }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                                transition: 'background-color 0.3s'
                            }}
                        >
                            <Typography variant="h6">Теоретическая часть</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Collapse in={expanded === 'theory'} timeout={500}>
                                {/* Отображение теоретического материала с анимацией */}
                                {LAB_DESCRIPTIONS.theory.map((item, index) => (
                                    <Fade 
                                        in={expanded === 'theory'} 
                                        timeout={{ enter: 800 + index * 200 }}
                                        key={index}
                                    >
                                        <Box sx={{ mb: 3 }}>
                                            <Typography 
                                                variant="subtitle1" 
                                                fontWeight="bold"
                                                color="primary"
                                                gutterBottom
                                            >
                                                {item.title}
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    whiteSpace: 'pre-line',
                                                    pl: 2,
                                                    borderLeft: '2px solid rgba(25, 118, 210, 0.2)'
                                                }}
                                            >
                                                {item.content}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                ))}
                            </Collapse>
                        </AccordionDetails>
                    </Accordion>

                    {/* Секция порядка выполнения */}
                    <Accordion
                        expanded={expanded === 'procedure'}
                        onChange={handleChange('procedure')}
                        TransitionProps={{ unmountOnExit: true }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                                transition: 'background-color 0.3s'
                            }}
                        >
                            <Typography variant="h6">Порядок выполнения</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Collapse in={expanded === 'procedure'} timeout={500}>
                                {/* Отображение шагов выполнения с анимацией */}
                                {LAB_DESCRIPTIONS.procedure.map((item, index) => (
                                    <Fade 
                                        in={expanded === 'procedure'} 
                                        timeout={{ enter: 800 + index * 200 }}
                                        key={index}
                                    >
                                        <Box sx={{ mb: 3 }}>
                                            <Typography 
                                                variant="subtitle1" 
                                                fontWeight="bold"
                                                color="primary"
                                                gutterBottom
                                            >
                                                {item.title}
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                component="div"
                                                sx={{ 
                                                    pl: 2,
                                                    borderLeft: '2px solid rgba(25, 118, 210, 0.2)'
                                                }}
                                            >
                                                {item.content.split('\n').map((line, i) => (
                                                    <Box key={i} sx={{ mb: 1 }}>{line}</Box>
                                                ))}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                ))}
                            </Collapse>
                        </AccordionDetails>
                    </Accordion>

                    {/* Секция формул */}
                    <Accordion
                        expanded={expanded === 'formulas'}
                        onChange={handleChange('formulas')}
                        TransitionProps={{ unmountOnExit: true }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                                transition: 'background-color 0.3s'
                            }}
                        >
                            <Typography variant="h6">Формулы</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Collapse in={expanded === 'formulas'} timeout={500}>
                                {/* Отображение формул с анимацией */}
                                {LAB_DESCRIPTIONS.formulas.map((item, index) => (
                                    <Fade 
                                        in={expanded === 'formulas'} 
                                        timeout={{ enter: 800 + index * 200 }}
                                        key={index}
                                    >
                                        <Box sx={{ mb: 3 }}>
                                            <Typography 
                                                variant="subtitle1" 
                                                fontWeight="bold"
                                                color="primary"
                                                gutterBottom
                                            >
                                                {item.title}
                                            </Typography>
                                            {/* Отображение формулы в моноширинном шрифте */}
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontFamily: 'monospace',
                                                    my: 2,
                                                    p: 2,
                                                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                                    borderRadius: 1,
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {item.content}
                                            </Typography>
                                            {/* Описание формулы */}
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ 
                                                    pl: 2,
                                                    borderLeft: '2px solid rgba(25, 118, 210, 0.2)'
                                                }}
                                            >
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                ))}
                            </Collapse>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Paper>
        </Fade>
    );
};

export default LabDescription; 