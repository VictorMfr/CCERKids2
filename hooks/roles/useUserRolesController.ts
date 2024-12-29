import { useLocalSearchParams, useNavigation } from "expo-router";
import useGetUsersByRole from "../fetchHooks/useGetUsersByRole";
import { useEffect } from "react";


const useUserRolesController = () => {
    const params = useLocalSearchParams();
    const { users, loadingUsers } = useGetUsersByRole(params);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: params.name });
    }, [navigation]);

    const utils = {
        users,
        loadingUsers
    }

    return { utils };
}

export default useUserRolesController;