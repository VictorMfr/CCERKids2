import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import { useEffect, useState } from "react";

const useGetChronogram = () => {
    const [chronogram, setChronogram] = useState<any[]>([]);
    const [loadingChronogram, setLoadingChronogram] = useState(true);

    const fetchChronogram = async () => {
        try {
            const token = await getStorageToken();
            const response = await api.get('/kidChronogram/getChronogram', defaultAuthHeader(token))
            if (response.status == 200) {
                setChronogram(response.data);
                setLoadingChronogram(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchChronogram()
    }, []);

    return { chronogram, loadingChronogram, setChronogram };
}

export default useGetChronogram;