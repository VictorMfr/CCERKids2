import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import { useEffect, useState } from "react";

const useGetRoles = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
    
    const fetchRoles = async () => {
        try {

            setLoadingRoles(true);

            const token = await getStorageToken();

            const response = await api.get('/roles', defaultAuthHeader(token));

            if (response.status == 200) {
                setRoles(response.data);
                setLoadingRoles(false);
            } else {
                throw new Error('Error, status code: ' + response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }; 

    useEffect(() => {
        fetchRoles();
    }, []);

    return { roles, loadingRoles, setRoles };
}

export default useGetRoles;