package com.hospital.api.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.api.entities.Cita;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByDoctorIdAndHorarioConsultaBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    List<Cita> findByConsultorioIdAndHorarioConsulta(Long doctorId, LocalDateTime horarioConsulta);
    List<Cita> findByNombrePacienteAndHorarioConsultaBetween(String nombrePaciente, LocalDateTime start, LocalDateTime end);

}