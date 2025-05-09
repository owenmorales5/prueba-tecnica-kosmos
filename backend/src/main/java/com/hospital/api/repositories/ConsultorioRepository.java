package com.hospital.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.api.entities.Consultorio;

public interface ConsultorioRepository extends JpaRepository<Consultorio, Long> {}