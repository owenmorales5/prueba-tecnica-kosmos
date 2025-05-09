package com.hospital.api.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hospital.api.entities.Doctor;
import com.hospital.api.services.DoctorService;

@RestController
@RequestMapping("/api/doctores")
public class DoctorController {
    @Autowired
    private DoctorService doctorService;

    @GetMapping("/")
    public List<Doctor> getDoctores() {
        return doctorService.getAllDoctores();
    }

}
