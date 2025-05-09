package com.hospital.api.services;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.api.dtos.CreateCitaDto;
import com.hospital.api.entities.Cita;
import com.hospital.api.entities.Consultorio;
import com.hospital.api.entities.Doctor;
import com.hospital.api.repositories.CitaRepository;
import com.hospital.api.repositories.ConsultorioRepository;
import com.hospital.api.repositories.DoctorRepository;

@Service
public class CitasService {
    @Autowired
    private CitaRepository citaRepo;
    @Autowired
    private DoctorRepository doctorRepo;
    @Autowired
    private ConsultorioRepository consultorioRepo;

    public Cita crearCita(CreateCitaDto dto) {
        Doctor doctor = doctorRepo.findById(dto.doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        Consultorio consultorio = consultorioRepo.findById(dto.consultorioId)
                .orElseThrow(() -> new RuntimeException("Consultorio no encontrado"));

        LocalDateTime horario = dto.horarioConsulta;
        LocalDateTime inicioDia = horario.toLocalDate().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);

        if (!citaRepo.findByConsultorioIdAndHorarioConsulta(dto.consultorioId, horario).isEmpty())
            throw new RuntimeException("Consultorio ocupado en ese horario");

        if (!citaRepo.findByDoctorIdAndHorarioConsultaBetween(doctor.getId(), horario, horario.plusMinutes(59))
                .isEmpty())
            throw new RuntimeException("El doctor ya tiene una cita en ese horario");

        List<Cita> citasPaciente = citaRepo.findByNombrePacienteAndHorarioConsultaBetween(
                dto.nombrePaciente, inicioDia, finDia);
        for (Cita c : citasPaciente) {
            long diff = Duration.between(c.getHorarioConsulta(), horario).abs().toHours();
            if (diff < 2)
                throw new RuntimeException("El paciente ya tiene una cita cercana ese día");
        }

        long totalCitas = citaRepo.findByDoctorIdAndHorarioConsultaBetween(doctor.getId(), inicioDia, finDia).size();
        if (totalCitas >= 8)
            throw new RuntimeException("El doctor ya tiene 8 citas ese día");

        Cita cita = new Cita();
        cita.setDoctor(doctor);
        cita.setConsultorio(consultorio);
        cita.setNombrePaciente(dto.nombrePaciente);
        cita.setHorarioConsulta(horario);

        return citaRepo.save(cita);
    }

    public List<Cita> buscarCitas(Optional<Long> doctorId, Optional<Long> consultorioId, Optional<LocalDate> fecha) {
        return citaRepo.findAll().stream()
                .filter(c -> !c.isCancelada())
                .filter(c -> doctorId.map(id -> c.getDoctor().getId().equals(id)).orElse(true))
                .filter(c -> consultorioId.map(id -> c.getConsultorio().getId().equals(id)).orElse(true))
                .filter(c -> fecha.map(f -> {
                    LocalDateTime inicio = f.atStartOfDay();
                    LocalDateTime fin = inicio.plusDays(1);
                    return !c.getHorarioConsulta().isBefore(inicio) && c.getHorarioConsulta().isBefore(fin);
                }).orElse(true))
                .collect(Collectors.toList());
    }

    public void cancelarCita(Long id) {
        Cita cita = citaRepo.findById(id).orElseThrow();
        if (cita.getHorarioConsulta().isAfter(LocalDateTime.now())) {
            cita.setCancelada(true);
            citaRepo.save(cita);
        } else {
            throw new RuntimeException("La cita ya pasó");
        }
    }

    public void editarCita(Long id, CreateCitaDto nuevo) {
        cancelarCita(id);
        crearCita(nuevo);
    }
}
