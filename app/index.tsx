import useUserCacheCheck from "@/hooks/app/useUserCacheCheck";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router"
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storageKeys from "@/constants/storageKeys";

const Page = () => {
    const { loading, isOnBoardingCompletion, isUserData } = useUserCacheCheck();
    
    useEffect(() => {
        if (!loading) {
            if (isUserData) {
                AsyncStorage.getItem(storageKeys.isSuperUser).then(data => {
                    if (data) {
                        router.replace('./dashboard')
                    } else {
                        router.replace('./userDashboard');
                    }
                });

                
            } else if (isOnBoardingCompletion) {
                router.replace('./login');
            } else {
                router.replace('./onBoarding');
            }
        }
    }, [loading]);

    return <ActivityIndicator style={{ flex: 1 }}/>
}

export default Page;