import api from "@/api/axios";
import GetStorageData from "@/utils.ts/getStorageData";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useGetHelpers = () => {
    const [helpers, setHelpers] = useState<any[]>([]);
    const [loadingHelpers, setLoadingHelpers] = useState(true);

    const getHelpers = async () => {
        try {
            const { token } = await GetStorageData();

            const response = await api.get('/usersByRole?search=Auxiliar', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            if (response.status != 200) {
                throw new Error(response.status.toString());
            } 

            setHelpers(response.data);
            setLoadingHelpers(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getHelpers();
    }, []);

    return { helpers, loadingHelpers, setHelpers };
}

export default useGetHelpers;