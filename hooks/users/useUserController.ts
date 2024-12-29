import { useState } from "react";
import useGetRoles from "../fetchHooks/useGetRoles";
import useGetRolesByUser from "../fetchHooks/useGetRolesByUser";
import GetStorageData from "@/utils.ts/getStorageData";
import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import { Alert, Clipboard } from "react-native";
import { useLocalSearchParams } from "expo-router";

const useUserController = () => {
    const [isModal, setIsModal] = useState(false);
    const { roles, loadingRoles } = useGetRoles();

    const params: { item: string } = useLocalSearchParams();



    const userData = JSON.parse(params.item);

    const { userRoles, loadingUserRoles } = useGetRolesByUser(userData);




    const closeModal = () => {
        setIsModal(false);
    }

    const openModal = () => {
        setIsModal(true);
    }

    const addRole = (item: any) => {
        Alert.alert('¿Seguro?', '', [
            {
                text: 'Aceptar',
                onPress: async () => {

                    const { token } = await GetStorageData();

                    const response = await api.post(`/users/${userData._id}/assignRole`, {
                        _id: item._id
                    }, defaultAuthHeader(token))

                    if (response.status == 201) {
                        Alert.alert('Success');
                        setIsModal(false);
                    } else {
                        Alert.alert('Error', ` Status Code: ${response.status}`);
                        setIsModal(false);
                    }

                }
            }, {
                text: 'Cancelar'
            }
        ])
    }

    const deleteRole = (id: string) => {
        Alert.alert('Confirmar', 'Seguro que quieres remover este rol?', [
            {
                text: 'Si',
                onPress: async () => {
                    try {
                        const { user, token } = await GetStorageData();

                        const response = await api.delete(`/users/${user._id}/removeRole`, {
                            data: {
                                _id: id
                            }, ...defaultAuthHeader(token)
                        });

                        if (response.status == 200) {
                            console.log(response.data);
                        }
                    } catch (error) {
                        console.log(error);
                    }


                }
            },
            {
                text: 'No'
            }
        ])
    }

    const copyToClipboard = (text: string) => {
        Clipboard.setString(text);
    }

    const utils = {
        closeModal,
        addRole,
        deleteRole,
        openModal,
        copyToClipboard,
        roles,
        loadingRoles,
        userRoles,
        loadingUserRoles,
        isModal,
        userData
    }

    return { utils };
}

export default useUserController;