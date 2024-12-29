import api from "@/api/axios";
import request from "@/api/request";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import { useEffect, useState } from "react";

const useGetNotifications = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState<boolean>(true);

    const fetchNotifications = async () => {
        try {
            request(async (user, token) => {
                const response = await api.get(`/notificationsByUser?userId=${user._id}`, defaultAuthHeader(token));

                if (response.status == 200) {
                    setNotifications(response.data);
                    setLoadingNotifications(false);
                } else {
                    throw new Error('Error status code: ' + response.status);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, []);

    return { notifications, loadingNotifications };
}

export default useGetNotifications;