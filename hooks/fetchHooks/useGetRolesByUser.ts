import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import GetStorageData from "@/utils.ts/getStorageData";
import { useEffect, useState } from "react";

const useGetRolesByUser = (user?: any) => {
    const [loadingUserRoles, setLoadingUserRoles] = useState(true);
    const [userRoles, setUserRoles] = useState<any>();


    const fetchUserRoles = async () => {
        try {
            const { token, user: usr } = await GetStorageData();
            const response = await api.get(`/users/${user? user._id: usr._id}/getRoles`, defaultAuthHeader(token));

            if (response.status == 200) {
                setUserRoles(response.data.roles);
                setLoadingUserRoles(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUserRoles();
    }, []);

    return { userRoles, loadingUserRoles };

}

export default useGetRolesByUser;