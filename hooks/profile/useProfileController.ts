import { Reducer, useReducer } from "react"
import useGetStorageUser from "../storageHooks/useGetStorageUser"
import { Alert, Clipboard } from "react-native"
import api from "@/api/axios"
import GetStorageData from "@/utils.ts/getStorageData"
import defaultAuthHeader from "@/constants/defaultAuthHeader"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import storageKeys from "@/constants/storageKeys"

const profileControllerReducerInitialState = {
    name: '' as string,
    lastName: '' as string,
    phoneNumber: '' as string,
    password: '' as string,
    passwordRepeat: '' as string,
    updateModal: false as boolean
}

type TCredentials = {
    name: string,
    lastName: string,
    phoneNumber: string
}

type TActions = (
    { name: 'setName', value: string } |
    { name: 'setLastName', value: string } |
    { name: 'setPhoneNumber', value: string } |
    { name: 'setPassword', value: string } |
    { name: 'setUpdateModal', value: any } |
    { name: 'setPasswordRepeat', value: string } |
    { name: 'setFormCredentials', value: TCredentials }
)

const profileControllerReducer: Reducer<typeof profileControllerReducerInitialState, TActions> = (state, action) => {
    switch (action.name) {
        case "setName":
            return { ...state, name: action.value };
        case "setLastName":
            return { ...state, lastName: action.value };
        case "setPassword":
            return { ...state, password: action.value };
        case "setPhoneNumber":
            return { ...state, phoneNumber: action.value };
        case "setUpdateModal":
            return { ...state, updateModal: action.value };
        case "setPasswordRepeat":
            return { ...state, passwordRepeat: action.value };
        case "setFormCredentials":
            return {
                ...state,
                name: action.value.name,
                lastName: action.value.lastName,
                phoneNumber: action.value.phoneNumber,
                updateModal: true,
                password: '',
                passwordRepeat: ''
            }
        default:
            return state
    }
}

const useProfileController = () => {
    const [state, dispatch] = useReducer(profileControllerReducer, profileControllerReducerInitialState);

    const { user, loadingUser, setUser } = useGetStorageUser();

    const save = async () => {

        if (state.name.length == 0 || state.lastName.length == 0 || state.phoneNumber.length == 0) {
            return Alert.alert("Error", "Credenciales no validas");
        }


        if (state.password.length > 0 && state.passwordRepeat.length > 0 && (state.password != state.passwordRepeat)) {            
            return Alert.alert("Error", 'Contraseñas Incorrectas');
        }

        Alert.alert("Atencion", "Seguro que deseas continuar?", [
            {
                text: "Aceptar", onPress: async () => {

                    const { user, token } = await GetStorageData();

                    try {
                        const response = await api.patch(`/users/${user._id}`, {
                            name: state.name,
                            lastName: state.lastName,
                            phoneNumber: state.phoneNumber,
                            password: state.password? state.password: undefined
                        }, defaultAuthHeader(token));

                        if (response.status == 200) {
                            Alert.alert('Exito');
                            dispatch({ name: 'setUpdateModal', value: false })
                            return setUser(response.data);
                        }

                        throw new Error("Error Updating Credentials");
                    } catch (error) {
                        console.log(error)
                    }

                    try {
                        const responseSuperuser = await api.patch(`/superusers/${user._id}`, {
                            name: state.name,
                            lastName: state.lastName,
                            phoneNumber: state.phoneNumber,
                            password: state.password? state.password : undefined 
                        }, defaultAuthHeader(token));

                        if (responseSuperuser.status == 200) {
                            Alert.alert('Exito');
                            dispatch({ name: 'setUpdateModal', value: false })
                            return setUser(responseSuperuser.data);
                        }

                        throw new Error("Error Updating Credentials");
                    } catch (error) {
                        console.log(error);
                    }
                }
            },
            { text: "Cancelar" }
        ])


    }

    const changeCredentialsModal = () => {
        const value = {
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber
        }

        dispatch({ name: "setFormCredentials", value });
    }

    const logout = () => {
        Alert.alert("Atencion", "Seguro?", [
            {text: "Aceptar", onPress: async () => {

                const { user, token } = await GetStorageData();

                try {
                    const response = await api.post(`/users/logout`, null, defaultAuthHeader(token));

                    if (response.status == 200) {
                        await AsyncStorage.removeItem(storageKeys.userData);
                        router.replace('/');
                    }

                    throw new Error("Error Loging out");
                } catch (error) {
                    console.log(error)
                }

                try {
                    const responseSuperuser = await api.post(`/superusers/logout`, null, defaultAuthHeader(token));

                    if (responseSuperuser.status == 200) {
                        await AsyncStorage.removeItem(storageKeys.userData);
                        await AsyncStorage.removeItem(storageKeys.isSuperUser);
                        router.replace('/');
                    }

                    throw new Error("Error Loging out");
                } catch (error) {
                    console.log(error);
                }
            }},
            {text: 'Cancelar'}
        ])
    }

    const copyToClipboard = () => {
        Clipboard.setString(utils.user.phoneNumber);
    }

    const utils = {
        save,
        changeCredentialsModal,
        copyToClipboard,
        logout,
        user,
        loadingUser,
    }

    return { state, utils, dispatch };
}

export default useProfileController;