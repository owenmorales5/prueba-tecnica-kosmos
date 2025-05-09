package com.hospital.api.dtos;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;


public class CreateCitaDto {
    @NotNull
    public Long doctorId;

    @NotNull
    public Long consultorioId;

    @NotBlank
    public String nombrePaciente;

    @Future
    @NotNull
    public LocalDateTime horarioConsulta;
}