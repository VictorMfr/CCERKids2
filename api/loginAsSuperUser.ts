import { Axios, AxiosError, AxiosResponse } from "axios";
import api from "./axios";

const loginAsSuperUser: (email: string, password: string) => Promise<AxiosResponse<any, any> | AxiosError | Error> = async (email: string, password: string) => {
    try {
        const response = await api.post('/superusers/login', { email, password }, { timeout: 8000 });
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            return error;
        } else {
            return error as Error;
        }
    }
};

export default loginAsSuperUser;