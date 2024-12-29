import { Reducer, useReducer } from "react";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import { Alert } from "react-native";
import api from "@/api/axios";
import useGetRoles from "../fetchHooks/useGetRoles";

const rolesControllerReducerInitialState = {
    searchTerm: "" as string,
    isAddRoleModal: false as boolean,
    updateRoleData: "" as string,

    modalName: "" as string,
    modalDescription: "" as string,
};

type TActions =
    | { name: "setSearchTerm"; value: string }
    | { name: "setIsAddRoleModal"; value: boolean }
    | { name: "setUpdateRoleModal"; value: string }
    | { name: "setModalName"; value: string }
    | { name: "setModalDescription"; value: string }
    | { name: "clearModal" }
    | { name: "closeModal" }
    | {
          name: "setModalData";
          value: {
              name: string;
              description: string;
              updateRoleData: string;
          };
      };

const rolesControllerReducer: Reducer<typeof rolesControllerReducerInitialState, TActions> = (state, action) => {
    switch (action.name) {
        case "setSearchTerm":
            return { ...state, searchTerm: action.value };
        case "setIsAddRoleModal":
            return { ...state, isAddRoleModal: action.value };
        case "setUpdateRoleModal":
            return { ...state, updateRoleData: action.value };
        case "setModalName":
            return { ...state, modalName: action.value };
        case "setModalDescription":
            return { ...state, modalDescription: action.value };
        case "clearModal":
            return {
                ...state,
                modalName: "",
                modalDescription: "",
            };
        case "closeModal":
            return {
                ...state,
                isAddRoleModal: false,
                updateRoleData: "",
                modalName: "",
                modalDescription: "",
            };
        case "setModalData":
            return {
                ...state,
                modalName: action.value.name,
                modalDescription: action.value.description,
                updateRoleData: action.value.updateRoleData,
            };
        default:
            return state;
    }
};

const useRolesController = () => {
    const { roles, loadingRoles, setRoles } = useGetRoles();
    const [state, dispatch] = useReducer(rolesControllerReducer, rolesControllerReducerInitialState);

    const save = async () => {
        if (state.modalName.length === 0 || state.modalDescription.length === 0) {
            return Alert.alert("Datos no válidos");
        }

        const token = await getStorageToken();

        try {
            const response = await api.post(
                "/role",
                {
                    name: state.modalName,
                    description: state.modalDescription,
                },
                defaultAuthHeader(token)
            );

            if (response.status === 200) {
                utils.setRoles((prev) => [...prev, response.data]);
                dispatch({ name: "setIsAddRoleModal", value: false });
            } else {
                Alert.alert("Error", `Status Code: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const update = async () => {
        if (state.modalName.length === 0 || state.modalDescription.length === 0) {
            return Alert.alert("Datos no válidos");
        }

        const token = await getStorageToken();

        try {
            const response = await api.patch(
                `/roles/${state.updateRoleData}`,
                {
                    name: state.modalName,
                    description: state.modalDescription,
                },
                defaultAuthHeader(token)
            );

            if (response.status === 200) {
                utils.setRoles((prev) =>
                    prev.map((item) => (item._id === state.updateRoleData ? response.data : item))
                );
                dispatch({ name: "closeModal" });
            } else {
                Alert.alert("Error", `Status Code: ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteHandler = (item: any) => {
        const deletion = async () => {
            try {
                const token = await getStorageToken();

                const response = await api.delete(`/roles/${item._id}`, defaultAuthHeader(token));

                if (response.status === 200) {
                    utils.setRoles((prev) => prev.filter((i) => i._id !== item._id));
                    dispatch({ name: "setIsAddRoleModal", value: false });
                }
            } catch (error) {
                console.error(error);
            }
        };

        Alert.alert("¿Seguro?", "", [
            { text: "Aceptar", onPress: deletion },
            { text: "Cancelar" },
        ]);
    };

    const utils = {
        setRoles,
        save,
        update,
        deleteHandler,
        roles,
        loadingRoles,
    };

    return { state, dispatch, utils };
};

export default useRolesController;
