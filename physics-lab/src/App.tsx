import React, { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { DataTable } from './components/DataTable';
import { ResistanceChart } from './components/ResistanceChart';
import { Measurement } from './types';

function App() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const handleDataChange = (newData: Measurement[]) => {
    setMeasurements(newData);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Зависимость сопротивления от температуры
        </Typography>
        
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ввод данных
          </Typography>
          <DataTable onDataChange={handleDataChange} />
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            График зависимости
          </Typography>
          <ResistanceChart data={measurements} />
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
