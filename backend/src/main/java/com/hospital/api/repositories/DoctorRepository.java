package com.hospital.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.api.entities.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {}