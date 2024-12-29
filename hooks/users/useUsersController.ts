import { Reducer, useReducer } from "react";
import useGetUsers from "../fetchHooks/useGetUsers";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import { Alert } from "react-native";
import api from "@/api/axios";
import useGetStorageUser from "../storageHooks/useGetStorageUser";

const usersControllerReducerInitialState = {
    searchTerm: '' as string,
    isAddUserModal: false as boolean,
    updateUserData: '' as string,

    modalName: '' as string,
    modalLastname: '' as string,
    modalPhoneNumber: '' as string,
    modalEmail: '' as string,
    modalPassword: '' as string,
    modalGender: '' as string

}

type TActions = (
    { name: 'setSearchTerm', value: string } |
    { name: 'setIsAddUserModal', value: boolean } |
    { name: 'setUpdateUserModal', value: string } |
    { name: 'setModalName', value: string } |
    { name: 'setModalLastname', value: string } |
    { name: 'setModalPhoneNumber', value: string } |
    { name: 'setModalEmail', value: string } |
    { name: 'setModalPassword', value: string } |
    { name: 'setModalGender', value: string } |
    { name: 'clearModal' } |
    { name: 'closeModal' } |
    { name: 'setModalData', value: { 
        name: string,
        lastName: string,
        phoneNumber: string,
        email: string,
        gender: string,
        updateUserData: string 
    } }
)

const usersControllerReducer: Reducer<typeof usersControllerReducerInitialState, TActions> = (state, action) => {
    switch (action.name) {
        case "setSearchTerm":
            return { ...state, searchTerm: action.value };
        case "setIsAddUserModal":
            return { ...state, isAddUserModal: action.value };
        case "setUpdateUserModal":
            return { ...state, updateUserData: action.value };
        case "setModalName":
            return { ...state, modalName: action.value };
        case "setModalLastname":
            return { ...state, modalLastname: action.value };
        case "setModalPhoneNumber":
            return { ...state, modalPhoneNumber: action.value };
        case "setModalEmail":
            return { ...state, modalEmail: action.value };
        case "setModalGender":
            return { ...state, modalGender: action.value };
        case "setModalPassword":
            return { ...state, modalPassword: action.value };
        case "clearModal":
            return {
                ...state,
                modalName: '',
                modalLastname: '',
                modalPhoneNumber: '',
                modalEmail: '',
                modalGender: '',
                modalPassword: ''
            }
        case "closeModal":
            return {
                ...state,
                isAddUserModal: false,
                updateUserData: '',
                modalName: '',
                modalLastname: '',
                modalPhoneNumber: '',
                modalEmail: '',
                modalGender: '',
                modalPassword: ''
            };
        case "setModalData":
            return {
                ...state,
                modalName: action.value.name,
                modalLastname: action.value.lastName,
                modalPhoneNumber: action.value.phoneNumber,
                modalEmail: action.value.email,
                modalGender: action.value.gender,
                updateUserData: action.value.updateUserData,
            }
        default:
            return state
    }
}


const useUsersController = () => {
    const { users, loadingUsers, setUsers } = useGetUsers();
    const [state, dispatch] = useReducer(usersControllerReducer, usersControllerReducerInitialState);
    const { user } = useGetStorageUser();

    const save = async () => {
        if (
            state.modalName.length == 0 ||
            state.modalLastname.length == 0 ||
            state.modalPhoneNumber.length == 0 ||
            state.modalEmail.length == 0 ||
            state.modalPassword.length == 0 ||
            state.modalGender.length == 0 ||
            !state.modalEmail.includes('@') ||
            !state.modalEmail.includes('.')
        ) {
            return Alert.alert('Datos no validos');
        }

        const token = await getStorageToken();

        try {
            const response = await api.post('/user', {
                name: state.modalName,
                lastName: state.modalLastname,
                phoneNumber: state.modalPhoneNumber,
                email: state.modalEmail,
                password: state.modalPassword,
                gender: state.modalGender
            }, defaultAuthHeader(token));


            if (response.status == 200) {
                utils.setUsers(prev => [...prev, response.data]);
                dispatch({ name: 'setIsAddUserModal', value: false });
            } else {
                Alert.alert('Error', ` Status Code: ${response.status}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const update = async () => {
        if (
            state.modalName.length == 0 ||
            state.modalLastname.length == 0 ||
            state.modalPhoneNumber.length == 0 ||
            state.modalEmail.length == 0 ||
            state.modalGender.length == 0 ||
            !state.modalEmail.includes('@') ||
            !state.modalEmail.includes('.')
        ) {
            return Alert.alert('Datos no validos');
        }

        const token = await getStorageToken();

        const response = await api.patch(`/users/${state.updateUserData}`, {
            name: state.modalName,
            lastName: state.modalLastname,
            phoneNumber: state.modalPhoneNumber,
            email: state.modalEmail,
            gender: state.modalGender
        }, defaultAuthHeader(token));

        if (response.status == 200) {
            utils.setUsers(prev => prev.map(item => (item._id == state.updateUserData) ? response.data : item));
            dispatch({ name: 'closeModal' });
        } else {
            Alert.alert('Error', ` Status Code: ${response.status}`);
        }
    }

    const deleteHandler = (item: any) => {

        const deletion = async () => {
            try {
                const token = await getStorageToken();
                    
                    const response = await api.delete(`/users/${item._id}`, defaultAuthHeader(token));

                    if (response.status == 200) {
                        utils.setUsers(prev => prev.filter(i => i._id !== item._id));
                        dispatch({ name: "setIsAddUserModal", value: false });
                    }
            } catch (error) {
                console.log(error);
            }
        }

        Alert.alert('¿Seguro?', '', [
            { text: 'Aceptar', onPress: deletion },
            { text: 'Cancelar' }
        ]);
    }


    const utils = {
        setUsers,
        save,
        update,
        deleteHandler,
        users,
        loadingUsers,
        user
    }

    return { state, dispatch, utils };
}

export default useUsersController;