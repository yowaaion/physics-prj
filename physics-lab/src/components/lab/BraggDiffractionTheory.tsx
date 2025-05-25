import React from 'react';
import { 
    Paper, 
    Typography, 
    Box, 
    Divider, 
    useTheme,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MenuBookIcon from '@mui/icons-material/MenuBook';

/**
 * Component that explains Bragg diffraction theory with step-by-step mathematical derivations
 */
export const BraggDiffractionTheory: React.FC = () => {
    const theme = useTheme();

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: 4
                }
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    color: theme.palette.info.main,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500
                }}
            >
                <FunctionsIcon /> Математическое обоснование акустооптического взаимодействия
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Typography paragraph>
                Акустооптический эффект основан на дифракции света на периодической структуре показателя 
                преломления, создаваемой акустической волной в кристалле. Рассмотрим подробное математическое 
                обоснование формулы для скорости ультразвука (3.1) и процесса дифракции Брэгга.
            </Typography>

            <Box 
                sx={{ 
                    bgcolor: theme.palette.info.main + '10', 
                    p: 2, 
                    mb: 3, 
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.info.main + '30'}`
                }}
            >
                <Typography variant="subtitle1" fontWeight={500} gutterBottom color="info.main">
                    Физическая модель акустооптического взаимодействия
                </Typography>
                
                <Typography paragraph>
                    Ультразвуковая волна создает в среде периодическую модуляцию плотности, 
                    которая приводит к изменению показателя преломления. Эту модуляцию можно 
                    рассматривать как динамическую дифракционную решетку. При определенных 
                    условиях (угол Брэгга) происходит конструктивная интерференция отраженных 
                    световых волн, что и наблюдается как дифракция.
                </Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight={500} gutterBottom color="info.main">
                Математическое выведение условия Брэгга:
            </Typography>

            <Box sx={{ pl: 2, mb: 3 }}>
                <Typography paragraph>
                    1. Рассмотрим плоскую ультразвуковую волну, распространяющуюся в кристалле с 
                    волновым вектором 𝐊 и длиной волны Λ = 2π/|𝐊|.
                </Typography>
                
                <Typography paragraph>
                    2. Пусть на кристалл падает монохроматический свет с волновым вектором 𝐤₀ и 
                    длиной волны λ₀ в вакууме.
                </Typography>
                
                <Typography paragraph>
                    3. При взаимодействии света с ультразвуковой волной возникает дифрагированная 
                    волна с волновым вектором 𝐤₁. По закону сохранения импульса:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        𝐤₁ = 𝐤₀ ± 𝐊
                    </Typography>
                    <Typography align="right" variant="body2" color="text.secondary">
                        (M.1)
                    </Typography>
                </Box>
                
                <Typography paragraph>
                    4. Учитывая, что для упругого рассеяния должно выполняться |𝐤₁| = |𝐤₀|, получаем:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        |𝐤₀|² = |𝐤₁|² = |𝐤₀ ± 𝐊|² = |𝐤₀|² ± 2|𝐤₀||𝐊|cos(θ) + |𝐊|²
                    </Typography>
                </Box>
                
                <Typography paragraph>
                    5. Поскольку |𝐊| ≪ |𝐤₀| (длина волны звука много больше длины волны света), 
                    из предыдущего уравнения следует:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        |𝐤₀||𝐊|cos(θ) = 0
                    </Typography>
                </Box>
                
                <Typography paragraph>
                    6. Это выполняется при θ = π/2, то есть когда волновые векторы 𝐤₀ и 𝐊 перпендикулярны.
                </Typography>
                
                <Typography paragraph>
                    7. В векторной диаграмме это условие можно представить как угол 2θ между падающим 
                    и дифрагированным лучами, где θ связан с углом падения на "плоскости" акустической волны:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        sin(θ) = λ₀/(2Λ)
                    </Typography>
                    <Typography align="right" variant="body2" color="text.secondary">
                        (M.2)
                    </Typography>
                </Box>
                
                <Typography paragraph>
                    8. Учитывая, что Λ = V/f, где V - скорость звука, f - его частота, получаем:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                            bgcolor: theme.palette.info.main + '08',
                        }
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        V = λ₀f/(2sin(θ))
                    </Typography>
                    <Typography align="right" variant="body2" color="info.main" fontWeight={500}>
                        (3.1)
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={500} gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: theme.palette.secondary.main
            }}>
                <LightbulbIcon color="secondary" /> Практическое применение формулы
            </Typography>

            <Box sx={{ pl: 2, mb: 3 }}>
                <Typography paragraph>
                    Формула (3.1) позволяет определить скорость ультразвука в кристалле, 
                    измеряя угол Брэгга θ при известных значениях длины волны света λ₀ и 
                    частоты ультразвука f. Это основа акустооптического метода исследования 
                    упругих свойств кристаллов.
                </Typography>
                
                <Typography paragraph>
                    Для повышения точности измерений желательно использовать более высокие 
                    частоты ультразвука, поскольку при этом увеличивается угол дифракции θ, 
                    что уменьшает относительную погрешность его определения.
                </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={500} gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1
            }}>
                <AutoFixHighIcon sx={{ color: theme.palette.warning.main }} /> Связь с затуханием ультразвука
            </Typography>

            <Box sx={{ pl: 2, mb: 3 }}>
                <Typography paragraph>
                    Интенсивность дифрагированного света пропорциональна интенсивности звуковой 
                    волны в точке взаимодействия. При распространении ультразвука в среде его 
                    интенсивность убывает по экспоненциальному закону:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        I(x) = I₀·exp(-2αx)
                    </Typography>
                    <Typography align="right" variant="body2" color="text.secondary">
                        (M.3)
                    </Typography>
                </Box>
                
                <Typography paragraph>
                    где I₀ - начальная интенсивность, α - коэффициент затухания. 
                </Typography>
                
                <Typography paragraph>
                    Логарифмируя отношение интенсивностей в точках X₁ и X₂, получаем:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        ln(I₁/I₂) = 2α(X₂-X₁)
                    </Typography>
                </Box>
                
                <Typography paragraph>
                    Отсюда, выражая затухание в децибелах:
                </Typography>
                
                <Box 
                    sx={{ 
                        bgcolor: 'background.paper', 
                        p: 2, 
                        mx: 4, 
                        mb: 2, 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                            bgcolor: theme.palette.secondary.main + '08',
                        }
                    }}
                >
                    <Typography align="center" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                        α = 10·lg(I₁/I₂)/(X₂-X₁)
                    </Typography>
                    <Typography align="right" variant="body2" color="secondary.main" fontWeight={500}>
                        (3.3)
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ 
                p: 2, 
                bgcolor: theme.palette.grey[50],
                borderRadius: 2,
                border: `1px dashed ${theme.palette.grey[300]}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2
            }}>
                <MenuBookIcon color="primary" sx={{ mt: 0.5 }} />
                <Box>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Рекомендуемая литература
                    </Typography>
                    <List dense disablePadding>
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                            <ListItemText primary="Балакший В.И., Парыгин В.Н., Чирков Л.Е. Физические основы акустооптики. – М.: Радио и связь, 1985." />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                            <ListItemText primary="Гуляев Ю.В. Акустические поверхностные волны в твердых телах. – УФН, 1979, т.159, №3, с.452-479." />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 30 }}>•</ListItemIcon>
                            <ListItemText primary="Korpel A. Acousto-optics. – In: Applied Solid State Science, vol. 3. New York: Acad. Press, 1972." />
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </Paper>
    );
}; 