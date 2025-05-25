import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Slider, FormControlLabel, Switch, useTheme, Paper } from '@mui/material';

interface WavePropagationDiagramProps {
    width?: number;
    height?: number;
}

/**
 * Interactive component for visualizing acoustic wave propagation in crystals
 * Demonstrates Bragg diffraction and acoustic-optical interaction
 */
export const WavePropagationDiagram: React.FC<WavePropagationDiagramProps> = ({ 
    width = 600, 
    height = 400 
}) => {
    const theme = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animationActive, setAnimationActive] = useState(true);
    const [soundFrequency, setSoundFrequency] = useState(50); // MHz
    const [showBraggDiffraction, setShowBraggDiffraction] = useState(true);
    
    // Animation frame reference
    const animationFrameRef = useRef<number | null>(null);
    
    // Animation parameters
    const [time, setTime] = useState(0);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw the crystal boundaries
        drawCrystal(ctx);
        
        // Draw the lattice structure
        drawLattice(ctx);
        
        // Draw sound wave
        drawSoundWave(ctx, soundFrequency, time);
        
        // Draw light beam
        drawLightBeam(ctx, time, showBraggDiffraction);
        
        // Animation loop
        if (animationActive) {
            animationFrameRef.current = requestAnimationFrame(() => {
                setTime(prevTime => (prevTime + 0.05) % 100);
            });
        }
        
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [time, animationActive, soundFrequency, showBraggDiffraction, width, height]);
    
    const drawCrystal = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.rect(50, 100, width - 100, 200);
        ctx.strokeStyle = theme.palette.primary.main;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add crystal label
        ctx.font = '14px Arial';
        ctx.fillStyle = theme.palette.text.secondary;
        ctx.fillText('Кристалл PbMoO₄', width / 2 - 50, 320);
    };
    
    const drawLattice = (ctx: CanvasRenderingContext2D) => {
        const latticeSpacing = 20;
        const startX = 60;
        const endX = width - 60;
        const startY = 110;
        const endY = 290;
        
        ctx.fillStyle = theme.palette.grey[300];
        
        for (let x = startX; x <= endX; x += latticeSpacing) {
            for (let y = startY; y <= endY; y += latticeSpacing) {
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    };
    
    const drawSoundWave = (ctx: CanvasRenderingContext2D, frequency: number, time: number) => {
        const amplitude = 10;
        const wavelength = 300 / (frequency / 50); // Scale wavelength inversely with frequency
        
        ctx.beginPath();
        ctx.strokeStyle = theme.palette.secondary.main;
        ctx.lineWidth = 1.5;
        
        // Vertical sound wave
        for (let y = 110; y <= 290; y += 2) {
            const x = 200 + amplitude * Math.sin((y / wavelength * 2 * Math.PI) + time);
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        
        // Direction arrow
        ctx.beginPath();
        ctx.moveTo(200, 90);
        ctx.lineTo(200, 70);
        ctx.lineTo(195, 75);
        ctx.moveTo(200, 70);
        ctx.lineTo(205, 75);
        ctx.strokeStyle = theme.palette.secondary.main;
        ctx.stroke();
        
        // Label
        ctx.font = '12px Arial';
        ctx.fillStyle = theme.palette.secondary.main;
        ctx.fillText('Ультразвук', 210, 80);
        ctx.fillText(`${soundFrequency} МГц`, 210, 95);
    };
    
    const drawLightBeam = (ctx: CanvasRenderingContext2D, time: number, showDiffraction: boolean) => {
        // Incident beam
        ctx.beginPath();
        ctx.moveTo(20, 150);
        ctx.lineTo(150, 200);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add animated dots to the incident beam
        drawAnimatedDots(ctx, 20, 150, 150, 200, time, 'rgba(255, 0, 0, 0.7)');
        
        // Transmitted beam
        ctx.beginPath();
        ctx.moveTo(150, 200);
        ctx.lineTo(500, 200);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add animated dots to the transmitted beam
        drawAnimatedDots(ctx, 150, 200, 500, 200, time, 'rgba(255, 0, 0, 0.7)');
        
        // Diffracted beam (if enabled)
        if (showDiffraction) {
            const braggAngle = (soundFrequency / 300) * Math.PI/6; // Simplified Bragg angle calculation
            
            ctx.beginPath();
            ctx.moveTo(150, 200);
            ctx.lineTo(450, 200 - 150 * Math.tan(braggAngle));
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add animated dots to the diffracted beam
            drawAnimatedDots(
                ctx, 
                150, 200, 
                450, 200 - 150 * Math.tan(braggAngle), 
                time, 
                'rgba(255, 0, 0, 0.4)'
            );
            
            // Angle marker
            ctx.beginPath();
            ctx.arc(150, 200, 30, -Math.PI/2, -Math.PI/2 - braggAngle, true);
            ctx.strokeStyle = theme.palette.info.main;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Angle label
            ctx.font = '12px Arial';
            ctx.fillStyle = theme.palette.info.main;
            ctx.fillText(`θₑ ≈ ${(braggAngle * 180 / Math.PI).toFixed(1)}°`, 120, 180);
        }
        
        // Light beam label
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        ctx.fillText('Лазер', 15, 140);
    };
    
    const drawAnimatedDots = (
        ctx: CanvasRenderingContext2D, 
        x1: number, 
        y1: number, 
        x2: number, 
        y2: number, 
        time: number,
        color: string
    ) => {
        const numDots = 5;
        
        for (let i = 0; i < numDots; i++) {
            const t = (i / numDots + (time % 1)) % 1;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
    };
    
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                width: width + 20,
                maxWidth: '100%',
                mx: 'auto'
            }}
        >
            <Typography 
                variant="h6" 
                gutterBottom 
                align="center"
                color="primary.main"
            >
                Акустооптическое взаимодействие в кристалле
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <canvas 
                    ref={canvasRef} 
                    width={width} 
                    height={height} 
                    style={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 4 }}
                />
            </Box>
            
            <Box sx={{ px: 3, mb: 2 }}>
                <Typography id="frequency-slider" gutterBottom>
                    Частота ультразвука: {soundFrequency} МГц
                </Typography>
                <Slider
                    value={soundFrequency}
                    onChange={(_, newValue) => setSoundFrequency(newValue as number)}
                    aria-labelledby="frequency-slider"
                    min={10}
                    max={200}
                    sx={{ color: theme.palette.secondary.main }}
                />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={animationActive}
                            onChange={() => setAnimationActive(!animationActive)}
                            color="primary"
                        />
                    }
                    label="Анимация"
                />
                
                <FormControlLabel
                    control={
                        <Switch
                            checked={showBraggDiffraction}
                            onChange={() => setShowBraggDiffraction(!showBraggDiffraction)}
                            color="info"
                        />
                    }
                    label="Дифракция Брэгга"
                />
            </Box>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                Интерактивная модель демонстрирует распространение ультразвуковой волны в кристалле
                и дифракцию света на периодической структуре, создаваемой ультразвуком (эффект Брэгга).
                Угол дифракции θₑ зависит от частоты ультразвука согласно формуле (3.1).
            </Typography>
        </Paper>
    );
}; 