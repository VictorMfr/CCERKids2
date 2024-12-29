import GetStorageData from "@/utils.ts/getStorageData";
import getStorageUser from "@/utils.ts/getStorageUser";
import { useEffect, useState } from "react";

const useGetStorageUser = () => {
    const [user, setUser] = useState<any>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    const getUserData = async () => {
        const userData = await getStorageUser();
        setUser(userData);
        setLoadingUser(false);
    }

    useEffect(() => {
        getUserData()
    }, []);


    return { user, loadingUser, setUser };
}

export default useGetStorageUser;