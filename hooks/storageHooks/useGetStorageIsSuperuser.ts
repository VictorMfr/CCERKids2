import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storageKeys from "@/constants/storageKeys";

const useGetStorageIsSuperuser = () => {
    const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
    const [loadingIsSuperuser, setLoadingIsSuperuser] = useState<boolean>(true);

    useEffect(() => {
        const checkSuperUser = async () => {
            const data = await AsyncStorage.getItem(storageKeys.isSuperUser);

            if (!data) {
                return;
            }

            setIsSuperuser(true);
            setLoadingIsSuperuser(false);
        };

        checkSuperUser();
    }, []);

    return { isSuperuser, loadingIsSuperuser };
};

export default useGetStorageIsSuperuser;
