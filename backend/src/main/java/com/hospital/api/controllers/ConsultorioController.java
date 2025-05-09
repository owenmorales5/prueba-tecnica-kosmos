package com.hospital.api.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hospital.api.entities.Consultorio;
import com.hospital.api.services.ConsultorioService;

@RestController
@RequestMapping("/api/consultorios")
public class ConsultorioController {
    @Autowired
    private ConsultorioService consultorioService;  

    @GetMapping("/")
    public List<Consultorio> getConsultorios() {
        return consultorioService.getAllConsultorios();
    }

}
