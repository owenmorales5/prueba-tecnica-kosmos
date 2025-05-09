export interface Doctor {
  id: number;
  nombre: string;
  especialidad: string;
}

export interface Consultorio {
  id: number;
  piso: string;
  numero: string;
}



export interface Cita {
  id: number;
  idConsultorio: number;
  idDoctor: number;
  nombrePaciente: string;
  doctor: Doctor; 
  consultorio: Consultorio; 
  horarioConsulta: string;
  cancelada: boolean
  
}

export interface CitaFormData {
  consultorioId: number;
  doctorId: number;
  horarioConsulta: string;
  nombrePaciente: string;
}

export interface CitaFilters {
  fecha?: string;
  doctorId?: string;
  consultorioId?: string;
}