
import Client from "../config/axiosClient";
import { Consultorio } from "../types/appointment";

const client = new Client('/api/consultorios').getAxiosInstance();


export const getConsultorios = async (): Promise<Consultorio[]> => {
    return await client.get('/').then(response => response.data);
};
