import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  Search as SearchIcon,
  Calendar,
  MapPin,
  User,
  Edit as EditIcon,
  X as CancelIcon,
  PlusCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { Cita, CitaFilters, Consultorio, Doctor } from '../types/appointment';
import { getFilteredCitas, cancelCita } from '../services/citaService';
import { getDoctores } from '../services/doctoreService';
import { getConsultorios } from '../services/consultorioService';

const CitaList = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [appointments, setCitas] = useState<Cita[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([])
  const [filters, setFilters] = useState<CitaFilters>({

  });
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setCitaToCancel] = useState<number | null>(null);


  useEffect(() => {
    const fetchCitas = async () => {
      const filteredCitas = await getFilteredCitas(filters);
      const doctores = await getDoctores();
      const consultorios = await getConsultorios();
      setDoctores(doctores)
      setCitas(filteredCitas);
      setConsultorios(consultorios)
    };
    fetchCitas();
  }, [filters]);


  const handleFilterChange = (field: keyof CitaFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };


  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    setFilters(prev => ({
      ...prev,
      date: date ? date.format('YYYY-MM-DDTHH:mm:ss') : undefined
    }));
  };


  const handleClearFilters = () => {
    setSelectedDate(null);
  };


  const handleOpenCancelDialog = (id: number) => {
    setCitaToCancel(id);
    setCancelDialogOpen(true);
  };


  const handleCloseCancelDialog = () => {
    setCitaToCancel(null);
    setCancelDialogOpen(false);
  };


  const handleConfirmCancel = async () => {
    if (appointmentToCancel) {
      try {
        await cancelCita(Number(appointmentToCancel));
        setCancelDialogOpen(false);
        setCitaToCancel(null);
        const filteredCitas = await getFilteredCitas(filters);
        setCitas(filteredCitas);
      } catch (error) {

        if ((error as any)?.response?.data?.message) {
          if (error instanceof Error && (error as any)?.response?.data?.message) {
            alert((error as any).response.data.message);
          }
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    }
  };


  const getStatusColor = (cancelada: boolean) => {
    switch (cancelada) {

      case true:
        return {
          bg: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark
        };
      default:
        return {
          bg: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.dark
        };
    }
  };


  const getStatusLabel = (cancelada: boolean) => {
    switch (cancelada) {
      case false:
        return 'Pendiente';
      default:
        return 'Cancelada';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Title and Create Button */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Gestión de Citas
          </Typography>
          <Button
            component={Link}
            to="/appointments/create"
            variant="contained"
            startIcon={<PlusCircle size={20} />}
            sx={{
              px: 3,
              py: 1
            }}
          >
            Nueva Cita
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filtros de búsqueda
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Fecha"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Doctor"
                  value={filters.doctorId || ''}
                  onChange={(e) => handleFilterChange('doctorId', e.target.value)}
                >
                  <MenuItem value="">Todos los doctores</MenuItem>
                  {doctores.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Consultorio"
                  value={filters.consultorioId || ''}
                  onChange={(e) => handleFilterChange('consultorioId', e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {consultorios.map((clinic) => (
                    <MenuItem key={clinic.id} value={clinic.id}>
                      {clinic.numero} - {clinic.piso}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  fullWidth
                  size="medium"
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Citas List */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {appointments.length} {appointments.length === 1 ? 'resultado' : 'resultados'} encontrados
          </Typography>

          {appointments.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <SearchIcon size={50} color={theme.palette.text.secondary} style={{ opacity: 0.5, marginBottom: 16 }} />
                <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                  No se encontraron citas
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Intenta modificar los filtros o crea una nueva cita
                </Typography>
                <Button
                  component={Link}
                  to="/appointments/create"
                  variant="contained"
                  startIcon={<PlusCircle size={18} />}
                >
                  Nueva Cita
                </Button>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => {
              const statusStyle = getStatusColor(appointment.cancelada);

              return (
                <Card key={appointment.id} sx={{
                  mb: 2,
                  borderLeft: '4px solid',
                  borderColor: appointment.cancelada === false ? 'primary.main' : 'error.main'

                }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="h6" component="div">
                            {appointment.nombrePaciente}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              mb: 0.5
                            }}
                          >
                            <User size={16} />
                            {appointment.doctor.nombre} - {appointment.doctor.especialidad}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          mb: 1
                        }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <Calendar size={16} />
                            {dayjs(appointment.horarioConsulta).format('YYYY-MM-DDTHH:mm:ss')}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <MapPin size={16} />
                            Consultorio numero: {appointment.consultorio.numero} - Piso {appointment.consultorio.piso}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Chip
                          label={getStatusLabel(appointment.cancelada)}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 'medium'
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={2} sx={{
                        display: 'flex',
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                        alignItems: 'center',
                        mt: { xs: 1, md: 0 }
                      }}>
                        {appointment.cancelada === false && (
                          <>
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/appointments/edit/${appointment.id}`)}
                              sx={{ mr: 1 }}
                            >
                              <EditIcon size={20} />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleOpenCancelDialog(appointment.id)}
                            >
                              <CancelIcon size={20} />
                            </IconButton>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>

        {/* Cancel Confirmation Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={handleCloseCancelDialog}
          aria-labelledby="cancel-dialog-title"
          aria-describedby="cancel-dialog-description"
        >
          <DialogTitle id="cancel-dialog-title">
            Cancelar Cita
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-dialog-description">
              ¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancelDialog} color="primary">
              Volver
            </Button>
            <Button onClick={handleConfirmCancel} color="error" variant="contained">
              Cancelar Cita
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CitaList;