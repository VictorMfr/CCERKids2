import storageKeys from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react";

const useUserCacheCheck = () => {

    const [loading, setLoading] = useState(true);
    const [isOnBoardingCompletion, setIsOnBoardingCompletion] = useState(false);
    const [isUserData, setIsUserData] = useState(false);

    const getUserCache = async () => {
        const onBoardingCheck = await AsyncStorage.getItem(storageKeys.onBoarding);
        const userDataCheck = await AsyncStorage.getItem(storageKeys.userData);

        if (onBoardingCheck) {
            setIsOnBoardingCompletion(true);
        }

        if (userDataCheck) {
            setIsUserData(true);
        }

        setLoading(false);
    }

    useEffect(() => {
        getUserCache();
    }, []);

    return {
        loading,
        isOnBoardingCompletion,
        isUserData
    };
}

export default useUserCacheCheck;