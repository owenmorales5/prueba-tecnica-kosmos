package com.hospital.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.api.entities.Doctor;
import com.hospital.api.repositories.DoctorRepository;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepo;

    public List<Doctor> getAllDoctores() {
        return doctorRepo.findAll();
    }
}
