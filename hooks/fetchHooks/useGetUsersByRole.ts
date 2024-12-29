import api from "@/api/axios";
import storageKeys from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useGetUsersByRole = (params: any) => {
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem(storageKeys.userData).then(data => {
            if (!data) {
                return Alert.alert('No token', `@userData: ${data}`);
            }

            const token = JSON.parse(data).token;

            api.get(`/usersByRole?search=${params.name}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                if (response.status == 200) {
                    setUsers(response.data);
                    setLoadingUsers(false);
                }
            });
        })
    }, []);

    return { users, loadingUsers };
}

export default useGetUsersByRole;