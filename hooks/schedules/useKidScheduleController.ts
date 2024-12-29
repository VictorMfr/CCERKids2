import { Reducer, useReducer } from "react";
import useGetKidSchedules from "../fetchHooks/useGetKidSchedules";
import { Alert } from "react-native";
import getStorageToken from "@/utils.ts/getStorageToken";
import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";

const kidScheduleControllerReducerInitialState = {
    modalTitle: '' as string,
    modalTarget: '' as string,
    modalMainQuotes: [] as string[],
    modalHelperQuotes: [] as string[],
    isKidAddSchedule: false as boolean,
    scheduleItemDetails: null as any,
    updateScheduleId: '' as string
}

const kidScheduleControllerReducer: Reducer<typeof kidScheduleControllerReducerInitialState, TActions> = (state, action) => {
    switch (action.name) {
        case "setModalTitle":
            return { ...state, modalTitle: action.value };
        case "setModalTarget":
            return { ...state, modalTarget: action.value };
        case "setModalMainQuotes":
            return { ...state, modalMainQuotes: [...action.value] };
        case "setModalHelperQuotes":
            return { ...state, modalHelperQuotes: [...action.value] };
        case "setIsKidAddSchedule":
            return { ...state, isKidAddSchedule: action.value };
        case "setScheduleItemsDetails":
            return { ...state, scheduleItemDetails: action.value };
        case "setUpdateScheduleId":
            return { ...state, updateScheduleId: action.value };
        case "clearModal":
            return {
                ...state,
                modalTitle: '',
                modalTarget: '',
                modalMainQuotes: [],
                modalHelperQuotes: [],
                updateScheduleId: '',
                isKidAddSchedule: false
            };
        case "setModalData":
            return {
                ...state,
                modalTitle: action.value.title,
                modalTarget: action.value.target,
                modalMainQuotes: action.value.biblic_quotes,
                modalHelperQuotes: action.value.complementary_biblic_quotes,
                updateScheduleId: action.value._id
            }
        default:
            return state;
    }
}

type TActions = (
    { name: 'setModalTitle', value: string } |
    { name: 'setModalTarget', value: string } |
    { name: 'setModalMainQuotes', value: string[] } |
    { name: 'setModalHelperQuotes', value: string[] } |
    { name: 'setIsKidAddSchedule', value: boolean } |
    { name: 'setScheduleItemsDetails', value: any } |
    { name: 'setUpdateScheduleId', value: string } |
    { name: 'clearModal' } |
    {
        name: 'setModalData', value: {
            title: string,
            target: string,
            biblic_quotes: string[],
            complementary_biblic_quotes: string[],
            _id: string
        }
    }
);

const useKidScheduleController = () => {
    const [state, dispatch] = useReducer(kidScheduleControllerReducer, kidScheduleControllerReducerInitialState);
    const { kidSchedules, loadingKidSchedules, setKidSchedules } = useGetKidSchedules();

    const save = async () => {
        if ((
            state.modalTitle.length == 0 ||
            state.modalTarget.length == 0 ||
            state.modalMainQuotes.length == 0 ||
            state.modalHelperQuotes.length == 0
        )) {
            return Alert.alert('Datos no validos');
        }

        const token = await getStorageToken();

        try {
            const response = await api.post('/kidSchedule', {
                title: state.modalTitle,
                target: state.modalTarget,
                biblic_quotes: state.modalMainQuotes,
                complementary_biblic_quotes: state.modalHelperQuotes
            }, defaultAuthHeader(token));

            if (response.status == 200) {
                dispatch({ name: "setIsKidAddSchedule", value: false });
                setKidSchedules(prev => [...prev, response.data]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteSchedule = (item: any) => {

        const deletion = async () => {
            const token = await getStorageToken();

            try {
                const response = await api.delete(`/kidSchedules/${item._id}`, defaultAuthHeader(token));

                if (response.status == 200) {
                    setKidSchedules(prev => prev.filter(element => element._id !== item._id));
                }
            } catch (error) {
                console.log(error);
            }
        }

        Alert.alert("Seguro?", '', [
            { text: "Aceptar", onPress: deletion },
            { text: "Cancelar" }
        ])
    }

    const update = async () => {

        const token = await getStorageToken();

        try {
            const response = await api.patch(`/kidSchedules/${state.updateScheduleId}`, {
                title: state.modalTitle,
                target: state.modalTarget,
                biblic_quotes: state.modalMainQuotes,
                complementary_biblic_quotes: state.modalHelperQuotes
            }, defaultAuthHeader(token));

            if (response.status == 200) {
                setKidSchedules(prev => prev.map(element => (
                    element._id == state.updateScheduleId) ? response.data : element
                ));
                dispatch({ name: 'setUpdateScheduleId', value: '' });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const utils = {
        kidSchedules,
        loadingKidSchedules,
        setKidSchedules,
        save,
        deleteSchedule,
        update
    }



    return { state, dispatch, utils };
}

export default useKidScheduleController;