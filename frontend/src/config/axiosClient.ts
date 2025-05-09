import axios, { AxiosHeaders, AxiosRequestHeaders } from "axios";


class Client {
    path: string;
    private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    constructor(path: string) {
        this.path = path;
    }

    private buildHeaders = () => {
        const headers: AxiosRequestHeaders = AxiosHeaders.from({
        });
        return headers;
    };

    getAxiosInstance = () => {
        return axios.create({
            baseURL: this.baseURL + this.path,
            headers: this.buildHeaders(),
        });
    };
}

export default Client;