import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import {

  Save as SaveIcon,
  ArrowLeft as BackIcon
} from 'lucide-react';

import { CitaFormData, Consultorio, Doctor } from '../types/appointment';
import {
  createCita,
  updateCita,
  getCita,
} from '../services/citaService';

import { getDoctores } from '../services/doctoreService';
import { getConsultorios } from '../services/consultorioService';
import { DateTimePicker } from '@mui/x-date-pickers';

const AppointmentCreate = () => {

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [consultorios, setConsultorios] = useState<Consultorio[]>([]);


  const [formData, setFormData] = useState<CitaFormData>({
    consultorioId: 0,
    doctorId: 0,
    horarioConsulta: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    nombrePaciente: ''
  });


  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [submitSuccess, setSubmitSuccess] = useState(false);


  useEffect(() => {
    if (isEditing && id) {
      const appointment = getCita(Number(id));
      if (appointment) {
        setFormData({
          consultorioId: appointment.idConsultorio,
          doctorId: appointment.idDoctor,
          horarioConsulta: appointment.horarioConsulta,
          nombrePaciente: appointment.nombrePaciente,
        });
        setSelectedDate(dayjs(appointment.horarioConsulta));


      } else {

        navigate('/appointments');
      }
    }
  }, [id, isEditing, navigate]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResponse, clinicsResponse] = await Promise.all([
          getDoctores(),
          getConsultorios(),
        ]);
        setDoctores(doctorsResponse);
        setConsultorios(clinicsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const handleChange = (field: keyof CitaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));


    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };


  const handleDateChange = (horarioConsulta: dayjs.Dayjs | null) => {
    if (horarioConsulta) {
      setSelectedDate(horarioConsulta);
      const dateStr = horarioConsulta.format('YYYY-MM-DDTHH:mm:ss');
      handleChange('horarioConsulta', dateStr);
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.consultorioId) {
      newErrors.consultorioId = 'Selecciona un consultorio';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Selecciona un doctor';
    }

    if (!formData.horarioConsulta) {
      newErrors.horarioConsulta = 'Selecciona una fecha';
    } else if (dayjs(formData.horarioConsulta).isBefore(dayjs(), 'day')) {
      newErrors.horarioConsulta = 'La fecha no puede ser anterior a hoy';
    }



    if (!formData.nombrePaciente) {
      newErrors.nombrePaciente = 'Ingresa el nombre del paciente';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (isEditing && id) {
          await updateCita(Number(id), formData);
        } else {
          await createCita(formData);
        }

        setSubmitSuccess(true);


        setTimeout(() => {
          navigate('/appointments');
        }, 1500);
      } catch (error) {

        alert(error.response.data)
      }
    }
  };




  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<BackIcon size={18} />}
            onClick={() => navigate('/appointments')}
            variant="text"
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {isEditing ? 'Editar Cita' : 'Nueva Cita'}
          </Typography>
        </Box>

        {/* Success Alert */}
        {submitSuccess && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
          >
            {isEditing
              ? 'Cita actualizada correctamente. Redirigiendo...'
              : 'Cita creada correctamente. Redirigiendo...'}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Form Card */}
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Información de la Cita
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {/* Doctor */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Doctor"
                        value={formData.doctorId}
                        onChange={(e) => handleChange('doctorId', e.target.value)}
                        error={Boolean(errors.doctorId)}
                        helperText={errors.doctorId}
                        required
                      >
                        {doctores.map((doctor) => (
                          <MenuItem key={doctor.id} value={doctor.id}>
                            {doctor.nombre} - {doctor.especialidad}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Clinic */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Consultorio"
                        value={formData.consultorioId}
                        onChange={(e) => handleChange('consultorioId', e.target.value)}
                        error={Boolean(errors.consultorioId)}
                        helperText={errors.consultorioId}
                        required
                      >
                        {consultorios.map((clinic) => (
                          <MenuItem key={clinic.id} value={clinic.id}>
                            Consultorio número {clinic.numero} - Piso {clinic.piso}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Date */}
                    <Grid item xs={12}>
                      <DateTimePicker
                        label="Fecha de la cita"
                        value={selectedDate}
                        onChange={handleDateChange}
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: Boolean(errors.horarioConsulta),
                            helperText: errors.horarioConsulta
                          }
                        }}
                      />
                    </Grid>



                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Patient Name */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre del paciente"
                        value={formData.nombrePaciente}
                        onChange={(e) => handleChange('nombrePaciente', e.target.value)}
                        error={Boolean(errors.nombrePaciente)}
                        helperText={errors.nombrePaciente}
                        required
                      />
                    </Grid>



                    {/* Submit Button */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SaveIcon size={20} />}
                        fullWidth
                        disabled={submitSuccess}
                      >
                        {isEditing ? 'Actualizar Cita' : 'Guardar Cita'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>


        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentCreate;