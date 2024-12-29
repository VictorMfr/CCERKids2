import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import { useEffect, useState } from "react";

const useGetUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

    const fetchUsers = async () => {
        const token = await getStorageToken();

        const response = await api.get('/users', defaultAuthHeader(token));

        if (response.status == 200) {
            setUsers(response.data);
            setLoadingUsers(false);
        }
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    return { users, loadingUsers, setUsers };
}

export default useGetUsers;