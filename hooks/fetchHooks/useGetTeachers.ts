import api from "@/api/axios";
import GetStorageData from "@/utils.ts/getStorageData";
import getStorageToken from "@/utils.ts/getStorageToken";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useGetTeachers = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);

    const getTeachers = async () => {
        try {
            const { token } = await GetStorageData();

            const response = await api.get('/usersByRole?search=Maestro', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            if (response.status != 200) {
                throw new Error(response.status.toString());
            } 

            setTeachers(response.data);
            setLoadingTeachers(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getTeachers();
    }, []);

    return { teachers, loadingTeachers, setTeachers };
}

export default useGetTeachers;