import api from "@/api/axios";
import getStorageToken from "@/utils.ts/getStorageToken";
import { useEffect, useState } from "react";

const useGetKidSchedules = () => {
    const [loadingKidSchedules, setLoadingKidSchedules] = useState(true);
    const [kidSchedules, setKidSchedules] = useState<any[]>([]);

    const fetchKidSchedules = async () => {
        try {
            const token = await getStorageToken();

            const response = await api.get('/kidSchedules', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            if (response.status == 200) {
                setKidSchedules(response.data);
                setLoadingKidSchedules(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchKidSchedules();
    }, []);

    return { kidSchedules, loadingKidSchedules, setKidSchedules };
}

export default useGetKidSchedules;