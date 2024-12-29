import { AxiosRequestConfig } from "axios";

const defaultAuthHeader = (token: string) => {

    const defaultAuthHeader: AxiosRequestConfig<any> = {
        headers: {
            Authorization: 'Bearer ' + token
        }
    } 
    
    return defaultAuthHeader;
}

export default defaultAuthHeader