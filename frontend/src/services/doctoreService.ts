import Client from "../config/axiosClient";
import { Doctor } from "../types/appointment";

const client = new Client('/api/doctores').getAxiosInstance();


export const getDoctores = async (): Promise<Doctor[]> => {
    return await client.get('/').then(response => response.data);
};
