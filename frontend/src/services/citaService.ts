import { Cita, CitaFormData, CitaFilters } from '../types/appointment';

import dayjs from 'dayjs';
import Client from '../config/axiosClient';

const client = new Client('/api/citas').getAxiosInstance();

export const getCitas = (): Cita[] => {
  return []
};


export const getFilteredCitas = async (filters: CitaFilters): Promise<Cita[]> => {
  const queryParams = new URLSearchParams(filters as Record<string, string>).toString();
  const citas: Cita[] = await client.get(`/?${queryParams}`).then(response => response.data);


  return citas.sort((a, b) =>
    dayjs(a.horarioConsulta).unix() -
    dayjs(b.horarioConsulta).unix()
  );
};


export const getCita = (id: number): Cita | undefined => {
  return undefined;
};


export const createCita = async (formData: CitaFormData) => {
  await client.post('/', formData);
};


export const updateCita = (id: number, formData: CitaFormData) => {
 
};


export const cancelCita = async (id: number) => {
    await client.delete("/"+ id)
};



