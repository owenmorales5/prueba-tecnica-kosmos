
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import AppLayout from './components/layout/AppLayout';
import AppointmentCreate from './pages/AppointmentCreate';
import AppointmentList from './pages/AppointmentList';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/appointments" replace />} />
            <Route path="appointments" element={<AppointmentList />} />
            <Route path="appointments/create" element={<AppointmentCreate />} />
            <Route path="appointments/edit/:id" element={<AppointmentCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;