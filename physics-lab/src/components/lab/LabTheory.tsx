import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import ScienceIcon from '@mui/icons-material/Science';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';

/**
 * Компонент для отображения теоретической части лабораторной работы
 * по акустооптическому методу измерения скорости распространения и затухания ультразвуковых волн
 */
export const LabTheory: React.FC = () => {
    const theme = useTheme();

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                mt: 4,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 6
                }
            }}
        >
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500
                }}
            >
                <ScienceIcon /> Теоретическая часть
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom fontWeight={500}>
                Акустооптический метод измерения скорости распространения и затухания ультразвуковых волн
            </Typography>

            <Typography paragraph>
                Акустооптика используется как весьма удобный инструмент для визуализации звуковых полей и исследования характеристик 
                распространения упругих волн. Ряд методик, разработанных для этих целей, рассмотрен в /48,52/. Скорость ультразвука 
                в исследуемом материале определяется выражением /48,49,51/:
            </Typography>

            <Box 
                sx={{ 
                    bgcolor: 'background.paper', 
                    p: 2, 
                    mb: 3, 
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    V = λₒf / (2 sin θₑ)
                </Typography>
                <Typography align="right" variant="body2" color="text.secondary">
                    (3.1)
                </Typography>
            </Box>

            <Typography paragraph>
                где f - частота ультразвука, λₒ и θₑ - длина волны света и угол Брэгга вне образца. 
                Так как λₒ и f могут быть измерены с высокой точностью, то задача сводится к точному 
                определению в эксперименте угла 2θₑ между падающим и дифрагированным пучками света. 
                Точность определения 2θₑ зависит от ширины углового распределения интенсивности 
                дифрагированного света и повышается с увеличением частоты ультразвука. Согласно /48/, 
                относительная погрешность измерения скорости представляется в виде:
            </Typography>

            <Box 
                sx={{ 
                    bgcolor: 'background.paper', 
                    p: 2, 
                    mb: 3, 
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    ΔV/V ≈ 2λ² / λₒL
                </Typography>
                <Typography align="right" variant="body2" color="text.secondary">
                    (3.2)
                </Typography>
            </Box>

            <Typography paragraph>
                и на частотах порядка сотен мегагерц может быть менее 1%. В (3.2) λ - длина волны звука, 
                L - толщина звукового пучка. Измерение затухания упругих волн основано на том, что в изотропной среде 
                интенсивность дифрагированного света пропорциональна интенсивности звука. Следовательно, 
                можно наблюдать экспоненциальное уменьшение интенсивности дифрагированного света при перемещении 
                светового пучка по кристаллу вдоль направления распространения звука.
            </Typography>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Методика измерения затухания ультразвука</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography paragraph>
                        Коуэн и Гордон показали /50/, что при измерении затухания акустооптическим 
                        методом нет необходимости использовать узкий световой пучок. Принимая во 
                        внимание, что интенсивность упругой волны спадает, как exp (-2αx), где 
                        α - коэффициент затухания звука на единицу длины, они нашли, что перемещение 
                        светового пучка в направлении x на расстояние Δx — изменяет интенсивность 
                        дифрагированного света пропорционально exp(-2αΔx) независимо от ширины светового пучка.
                    </Typography>
                    <Typography paragraph>
                        Таким образом, затухание звука в децибелах на единицу длины определяется выражением:
                    </Typography>
                    
                    <Box 
                        sx={{ 
                            bgcolor: 'background.paper', 
                            p: 2, 
                            mb: 2, 
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                            α = 10 lg (A₁/A₂) / (X₂-X₁)
                        </Typography>
                        <Typography align="right" variant="body2" color="text.secondary">
                            (3.3)
                        </Typography>
                    </Box>
                    
                    <Typography paragraph>
                        где A₁ и A₂ - интенсивности дифрагированного сигнала в точках X₁ и X₂.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>Преимущества акустооптической методики</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography paragraph>
                        Акустооптическая методика обладает рядом неоспоримых преимуществ по 
                        сравнению с традиционными способами акустических измерений, что особенно 
                        заметно при измерениях затухания ультразвука. Применение оптического метода 
                        для регистрации упругих волн значительно упрощает приемный тракт установки, 
                        так как совокупность перестраиваемых приемников, развязывающих цепей и т.п. 
                        заменяется источником когерентного света (лазером), фотоприемником (ФЭУ или фотодиод) 
                        и индикатором (осциллограф).
                    </Typography>
                    
                    <Typography paragraph>
                        При использовании одного зондирующего импульса отпадает такие важные источники 
                        погрешностей, как влияние сложной геометрии преобразователя с образцом, 
                        не параллельности торцов образца, потери энергии на двойное преобразование, 
                        характерные для традиционных методик /49/.
                    </Typography>
                    <Typography paragraph>
                        Акустооптический метод позволяет проводить измерения в широком диапазоне частот, 
                        а его высокая чувствительность позволяет измерять затухания в сотни дБ/см, 
                        что крайне затруднительно при использовании обычных радиотехнических методов. 
                        Зондирование пучком света по длине образца позволяет проводить измерения локальных 
                        значений коэффициента затухания, различающихся из-за неоднородности образца. 
                        Ограничением для применения метода служит лишь требование оптической прозрачности материала.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                    sx={{
                        '& .MuiAccordionSummary-expandIconWrapper': {
                            color: theme.palette.secondary.main
                        }
                    }}
                >
                    <Typography sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1
                    }}>
                        <ThermostatIcon color="secondary" /> Температурная зависимость затухания ультразвука
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography paragraph>
                        Одним из важных аспектов исследования акустических свойств материалов является 
                        изучение температурной зависимости затухания ультразвука. С повышением температуры 
                        в кристаллических материалах наблюдается изменение коэффициента затухания, обусловленное 
                        несколькими механизмами взаимодействия звуковых волн с тепловыми колебаниями.
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom color="secondary">
                        Основные механизмы температурной зависимости:
                    </Typography>
                    
                    <Typography paragraph>
                        1. <strong>Фонон-фононное взаимодействие:</strong> С повышением температуры увеличивается 
                        плотность фононов (квантов тепловых колебаний решетки), что приводит к усилению 
                        рассеяния звуковых волн (акустических фононов) на тепловых фононах. Это повышает 
                        затухание ультразвука пропорционально температуре.
                    </Typography>
                    
                    <Typography paragraph>
                        2. <strong>Термоупругое затухание:</strong> Распространение звуковой волны создает 
                        периодические области сжатия и разрежения, приводящие к локальным колебаниям 
                        температуры. Теплоперенос между этими областями вызывает дополнительное затухание, 
                        которое также зависит от температуры.
                    </Typography>
                    
                    <Typography paragraph>
                        3. <strong>Релаксационные процессы:</strong> При определенных температурах в материале 
                        могут активироваться различные релаксационные процессы (структурные перестройки, 
                        переориентация дефектов), которые вносят дополнительный вклад в затухание ультразвука.
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom color="secondary">
                        Формула температурной зависимости затухания:
                    </Typography>
                    
                    <Box 
                        sx={{ 
                            bgcolor: 'background.paper', 
                            p: 2, 
                            mb: 2, 
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                            α(T) = α₀ + AT + BT²
                        </Typography>
                        <Typography align="right" variant="body2" color="text.secondary">
                            (3.4)
                        </Typography>
                    </Box>
                    
                    <Typography paragraph>
                        где α₀ - температурно-независимый член (рассеяние на статических дефектах), 
                        A и B - коэффициенты, характеризующие вклад различных механизмов затухания.
                    </Typography>
                    
                    <Typography paragraph>
                        Для большинства кристаллических материалов, включая PbMoO₄, в определенном 
                        диапазоне температур наблюдается квадратичная зависимость коэффициента 
                        затухания от температуры, что соответствует доминированию процессов 
                        трехфононного взаимодействия.
                    </Typography>
                    
                    <Typography paragraph>
                        Изучение температурной зависимости затухания ультразвука позволяет получить 
                        информацию о внутренней структуре материала, наличии дефектов и фазовых переходах, 
                        что делает акустооптический метод важным инструментом для исследования 
                        физических свойств твердых тел.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4a-content"
                    id="panel4a-header"
                    sx={{
                        bgcolor: 'rgba(211, 47, 47, 0.04)',
                        '&:hover': {
                            bgcolor: 'rgba(211, 47, 47, 0.08)'
                        },
                        '& .MuiAccordionSummary-expandIconWrapper': {
                            color: 'rgb(211, 47, 47)'
                        }
                    }}
                >
                    <Typography sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'rgb(211, 47, 47)'
                    }}>
                        <ElectricBoltIcon sx={{ color: 'rgb(211, 47, 47)' }} /> Температурная зависимость сопротивления проводников и полупроводников
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom color="error" sx={{ mb: 2 }}>
                        Физические основы температурной зависимости сопротивления
                    </Typography>
                    
                    <Typography paragraph>
                        Электрическое сопротивление материалов имеет различную температурную зависимость в зависимости от типа проводимости. 
                        Ключевое различие наблюдается между металлическими проводниками и полупроводниками, что обусловлено 
                        фундаментальными различиями в механизмах электрической проводимости.
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" fontWeight={500} gutterBottom sx={{ color: 'rgb(211, 47, 47)' }}>
                        Металлические проводники
                    </Typography>
                    
                    <Typography paragraph>
                        В металлах концентрация носителей заряда (электронов проводимости) практически не зависит от температуры,
                        а сопротивление определяется в основном рассеянием электронов на тепловых колебаниях решетки (фононах).
                        С повышением температуры амплитуда колебаний атомов увеличивается, что приводит к более интенсивному 
                        рассеянию электронов и, следовательно, к увеличению сопротивления.
                    </Typography>
                    
                    <Typography paragraph>
                        Для большинства металлов в широком диапазоне температур справедлива линейная зависимость сопротивления от температуры:
                    </Typography>
                    
                    <Box 
                        sx={{ 
                            bgcolor: 'rgba(211, 47, 47, 0.04)', 
                            p: 2, 
                            mb: 2, 
                            borderRadius: 1,
                            border: '1px solid rgba(211, 47, 47, 0.2)'
                        }}
                    >
                        <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                            R(T) = R₀[1 + α(T - T₀)]
                        </Typography>
                        <Typography align="right" variant="body2" color="error">
                            (4.1)
                        </Typography>
                    </Box>
                    
                    <Typography paragraph>
                        где R₀ — сопротивление при опорной температуре T₀ (обычно 20°C или 273 K),
                        α — температурный коэффициент сопротивления, характерный для данного материала.
                        Для чистых металлов α ≈ 1/273 K⁻¹ (близко к температурному коэффициенту расширения идеального газа).
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" fontWeight={500} gutterBottom sx={{ color: 'rgb(211, 47, 47)' }}>
                        Полупроводники
                    </Typography>
                    
                    <Typography paragraph>
                        В полупроводниках наблюдается противоположная зависимость — сопротивление уменьшается с ростом температуры.
                        Это происходит главным образом из-за увеличения концентрации носителей заряда за счет теплового возбуждения
                        электронов из валентной зоны в зону проводимости (собственная проводимость) или с донорных/акцепторных
                        уровней (примесная проводимость).
                    </Typography>
                    
                    <Typography paragraph>
                        Зависимость электропроводности полупроводников от температуры выражается экспоненциальным законом:
                    </Typography>
                    
                    <Box 
                        sx={{ 
                            bgcolor: 'rgba(211, 47, 47, 0.04)', 
                            p: 2, 
                            mb: 2, 
                            borderRadius: 1,
                            border: '1px solid rgba(211, 47, 47, 0.2)'
                        }}
                    >
                        <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                            σ = σ₀·exp(-Ea/kT)
                        </Typography>
                        <Typography align="right" variant="body2" color="error">
                            (4.2)
                        </Typography>
                    </Box>
                    
                    <Typography paragraph>
                        где σ — удельная электропроводность, σ₀ — предэкспоненциальный множитель,
                        Ea — энергия активации (для собственных полупроводников равна половине ширины запрещенной зоны),
                        k — постоянная Больцмана, T — абсолютная температура.
                    </Typography>
                    
                    <Typography paragraph>
                        Учитывая, что сопротивление R = 1/σ, логарифмируя формулу (4.2) и переводя к натуральному логарифму 
                        проводимости, получаем линейную зависимость ln(σ) от обратной температуры 1/T:
                    </Typography>
                    
                    <Box 
                        sx={{ 
                            bgcolor: 'rgba(211, 47, 47, 0.04)', 
                            p: 2, 
                            mb: 2, 
                            borderRadius: 1,
                            border: '1px solid rgba(211, 47, 47, 0.2)'
                        }}
                    >
                        <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                            ln(σ) = ln(σ₀) - Ea/k · 1/T
                        </Typography>
                        <Typography align="right" variant="body2" color="error">
                            (4.3)
                        </Typography>
                    </Box>
                    
                    <Typography paragraph>
                        График зависимости ln(σ) от 1/T представляет собой прямую линию, тангенс угла наклона которой равен -Ea/k.
                        Это позволяет экспериментально определить энергию активации Ea, что является одной из важнейших 
                        характеристик полупроводникового материала.
                    </Typography>
                    
                    <Typography paragraph>
                        В реальных полупроводниках могут наблюдаться несколько участков с различными наклонами на графике ln(σ) от 1/T,
                        что соответствует различным механизмам проводимости и энергиям активации в разных температурных диапазонах.
                    </Typography>
                    
                    <Box 
                        sx={{ 
                            bgcolor: 'rgba(211, 47, 47, 0.02)', 
                            p: 2, 
                            mt: 3, 
                            borderRadius: 2,
                            border: '1px dashed rgba(211, 47, 47, 0.3)'
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                            Практическое применение в лабораторной работе:
                        </Typography>
                        <Typography variant="body2">
                            В данной лабораторной работе проводятся измерения сопротивления полупроводникового материала при различных 
                            температурах. По экспериментальным данным строится график зависимости натурального логарифма проводимости 
                            ln(G) от обратной температуры (1/T). Из наклона полученной прямой определяется энергия активации Ea, 
                            которая является ключевой характеристикой исследуемого полупроводникового материала.
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Box 
                sx={{ 
                    mt: 3, 
                    p: 2, 
                    bgcolor: 'rgba(25, 118, 210, 0.08)', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2
                }}
            >
                <InfoIcon color="primary" sx={{ mt: 0.5 }} />
                <Box>
                    <Typography variant="subtitle1" fontWeight={500}>
                        Использование в лабораторной работе
                    </Typography>
                    <Typography variant="body2">
                        В данной лабораторной работе используется метод, описанный формулой (3.3), 
                        для расчета коэффициента затухания ультразвука на основе измерений интенсивности 
                        дифрагированного света в двух различных точках образца. В качестве входных 
                        данных используются координаты X₁, X₂ и отношение интенсивностей ΔI/I₀.
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}; 