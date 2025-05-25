import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Container, 
    Button, 
    Box, 
    useTheme, 
    Drawer, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText, 
    IconButton,
    Tooltip,
    Fade,
    Chip,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TableChartIcon from '@mui/icons-material/TableChart';
import ScienceIcon from '@mui/icons-material/Science';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BiotechIcon from '@mui/icons-material/Biotech';
import AcousticIcon from '@mui/icons-material/GraphicEq';
import ElectricIcon from '@mui/icons-material/ElectricBolt';

interface NavItem {
    text: string;
    icon: React.ReactNode;
    section: string;
    description: string;
    badge?: string;
}

export const AppHeader: React.FC = () => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navItems: NavItem[] = [
        { 
            text: 'Главная', 
            icon: <HomeIcon color="primary" />, 
            section: 'home',
            description: 'Общая информация о лабораторной работе'
        },
        { 
            text: 'Ввод данных', 
            icon: <TableChartIcon color="primary" />, 
            section: 'data',
            description: 'Внесение результатов измерений',
            badge: 'Ключевой этап'
        },
        { 
            text: 'Теоретические основы', 
            icon: <ScienceIcon color="primary" />, 
            section: 'theory',
            description: 'Научное обоснование методик измерений'
        },
        { 
            text: 'Измерение сопротивления', 
            icon: <ElectricIcon sx={{ color: theme.palette.error.main }} />, 
            section: 'resistance',
            description: 'Анализ температурной зависимости проводимости'
        },
        { 
            text: 'Акустооптические измерения', 
            icon: <AcousticIcon color="secondary" />, 
            section: 'acoustic',
            description: 'Затухание ультразвука в кристаллах'
        },
        { 
            text: 'Экспорт результатов', 
            icon: <FileDownloadIcon color="primary" />, 
            section: 'export',
            description: 'Сохранение данных в Excel-таблицу'
        }
    ];

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    const scrollToSection = (section: string) => {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setDrawerOpen(false);
    };

    return (
        <>
            <AppBar 
                position="static" 
                sx={{ 
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    boxShadow: 3
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box 
                            component="div" 
                            sx={{ 
                                flexGrow: 1, 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1 
                            }}
                        >
                            <BiotechIcon sx={{ fontSize: 28 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ 
                                    flexGrow: 1,
                                    fontWeight: 500
                                }}
                            >
                                Физический практикум
                            </Typography>
                        </Box>
                        <Tooltip title="Справка по лабораторной работе">
                            <IconButton color="inherit">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': { 
                        width: 320,
                        boxSizing: 'border-box',
                        boxShadow: 3
                    },
                }}
            >
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BiotechIcon /> Навигация по лаборатории
                    </Typography>
                    <Typography variant="caption">
                        Выберите раздел для быстрого доступа
                    </Typography>
                </Box>
                
                <List sx={{ px: 1 }}>
                    {navItems.map((item, index) => (
                        <React.Fragment key={item.section}>
                            {index === 3 && (
                                <Divider sx={{ my: 1 }}>
                                    <Chip 
                                        label="Измерения" 
                                        size="small" 
                                        sx={{ 
                                            fontSize: '0.7rem', 
                                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                                        }} 
                                    />
                                </Divider>
                            )}
                            <Tooltip 
                                title={item.description} 
                                placement="right"
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}
                            >
                                <ListItem 
                                    button 
                                    onClick={() => scrollToSection(item.section)}
                                    sx={{ 
                                        mb: 0.5, 
                                        borderRadius: 1,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'translateX(4px)'
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.text} 
                                        primaryTypographyProps={{ 
                                            fontWeight: 500,
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                    {item.badge && (
                                        <Chip 
                                            label={item.badge} 
                                            size="small" 
                                            color="primary" 
                                            variant="outlined" 
                                            sx={{ 
                                                fontSize: '0.7rem',
                                                height: 24
                                            }} 
                                        />
                                    )}
                                </ListItem>
                            </Tooltip>
                        </React.Fragment>
                    ))}
                </List>
                
                <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                    <Typography variant="caption" color="text.secondary" align="center" display="block">
                        © 2023 Лаборатория физических измерений
                    </Typography>
                </Box>
            </Drawer>
        </>
    );
}; 