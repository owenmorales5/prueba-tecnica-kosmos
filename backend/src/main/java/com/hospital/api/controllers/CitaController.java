package com.hospital.api.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.api.dtos.CreateCitaDto;
import com.hospital.api.entities.Cita;
import com.hospital.api.services.CitasService;

@RestController
@RequestMapping("/api/citas")
public class CitaController {
    @Autowired
    private CitasService citaService;

    @PostMapping("/")
    public ResponseEntity<?> crear(@RequestBody CreateCitaDto dto) {
        try {
            return ResponseEntity.ok(citaService.crearCita(dto));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/")
    public List<Cita> buscar(
            @RequestParam Optional<Long> doctorId,
            @RequestParam Optional<Long> consultorioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Optional<LocalDate> fecha) {
        return citaService.buscarCitas(doctorId, consultorioId, fecha);
    }

    @DeleteMapping("/{id}")
    public void cancelar(@PathVariable Long id) {
        citaService.cancelarCita(id);
    }

    @PutMapping("/{id}")
    public void editar(@PathVariable Long id, @RequestBody CreateCitaDto dto) {
        citaService.editarCita(id, dto);
    }
}
