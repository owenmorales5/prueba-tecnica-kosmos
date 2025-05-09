package com.hospital.api.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.api.entities.Consultorio;
import com.hospital.api.repositories.ConsultorioRepository;

@Service
public class ConsultorioService {
    @Autowired
    private ConsultorioRepository consultorioRepo;

    public List<Consultorio> getAllConsultorios() {
        return consultorioRepo.findAll();
    }
}
