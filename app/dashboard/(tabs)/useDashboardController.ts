import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import storageKeys from "@/constants/storageKeys";
import useGetNotifications from "@/hooks/fetchHooks/useGetNotifications";
import useGetRoles from "@/hooks/fetchHooks/useGetRoles";
import useGetStorageIsSuperuser from "@/hooks/storageHooks/useGetStorageIsSuperuser";
import getStorageToken from "@/utils.ts/getStorageToken"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native"




const useDashBoardController = () => {
    const { loadingRoles, roles, setRoles } = useGetRoles();
    const { isSuperuser, loadingIsSuperuser } = useGetStorageIsSuperuser();

    const utils = {
        setRoles,
        roles,
        loadingRoles,
        isSuperuser,
        loadingIsSuperuser
    };

    return utils;
}

export default useDashBoardController;