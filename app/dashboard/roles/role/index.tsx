import api from "@/api/axios";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import storageKeys from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { useState } from "react";
import { Alert, FlatList, Modal, View } from "react-native";

function searchWord(text: string, word: string) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(text);
}

const translateItem = (item: any) => {

    let name = item.url;

    if (searchWord(item.url, 'user')) {
        name = 'Usuarios'
    } else if (searchWord(item.url, 'users')) {
        name = 'Usuarios'
    } else if (searchWord(item.url, 'superuser')) {
        name = 'Super Usuario'
    } else if (searchWord(item.url, 'superusers')) {
        name = 'Super Usuario'
    } else if (searchWord(item.url, 'usersByRole')) {
        name = 'Usuarios'
    } else if (searchWord(item.url, 'role')) {
        name = 'Rol'
    } else if (searchWord(item.url, 'roles')) {
        name = 'Roles'
    } else if (searchWord(item.url, 'operation')) {
        name = 'Permisos';
    } else if (searchWord(item.url, 'operations')) {
        name = 'Permiso';
    } else if (searchWord(item.url, 'kidSchedule') || searchWord(item.url, 'kidSchedules')) {
        name = 'Planificacion Niños'
    } else if (searchWord(item.url, 'cleanSchedule') || searchWord(item.url, 'cleanSchedules')) {
        name = 'Planificacion Limpieza'
    } else if (searchWord(item.url, 'protocolSchedule') || searchWord(item.url, 'protocolSchedules')) {
        name = 'Planificacion Protocolo'
    }

    return {
        ...item,
        role: name
    }
}

const Page = () => {

    const [isAddPermitModal, setIsAddPermitModal] = useState(false);
    const [permits, setPermits] = useState([]);
    const [rolePermits, setRolePermits] = useState([]);

    const params: any = useLocalSearchParams();
    const item = JSON.parse(params.item);

    const assignPermit = (itemKey: any) => {
        AsyncStorage.getItem(storageKeys.userData).then(data => {
            if (!data) {
                return Alert.alert('No token', `@userData: ${data}`);
            }

            const token = JSON.parse(data).token;

            api.post(`/roles/${item._id}/assignPermits`, {
                _id: itemKey._id
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                if (response.status == 200) {
                    Alert.alert('Exito');
                    setIsAddPermitModal(false);
                }
            })
        });
    }

    const removePermit = (itemKey: any) => {
        Alert.alert('Confirmar', 'Seguro?', [
            {
                text: 'Aceptar',
                onPress() {
                    AsyncStorage.getItem(storageKeys.userData).then(data => {
                        if (!data) {
                            return Alert.alert('No token', `@userData: ${data}`);
                        }

                        const token = JSON.parse(data).token;

                        api.delete(`/roles/${item._id}/removePermit`, {
                            data: {
                                _id: itemKey._id
                            },
                            headers: {
                                Authorization: 'Bearer ' + token
                            }
                        }).then(response => {
                            if (response.status == 200) {
                                Alert.alert('Exito', '');
                                setRolePermits(response.data);
                            }
                        })

                    });
                }
            },
            {
                text: 'Cancelar'
            }
        ])
    }

    useEffect(() => {
        AsyncStorage.getItem(storageKeys.userData).then(data => {
            if (!data) {
                return Alert.alert('No token', `@userData: ${data}`);
            }

            const token = JSON.parse(data).token;

            api.get(`/roles/${item._id}/getPermits`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                if (response.status == 200) {
                    setRolePermits(response.data.permits)
                }
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem(storageKeys.userData).then(data => {
            if (!data) {
                return Alert.alert('No token', `@userData: ${data}`);
            }

            const token = JSON.parse(data).token;

            api.get('/operations', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                if (response.status == 200) {
                    setPermits(response.data)
                }
            })
        })
    }, []);

    return (

        <>
            {/* Add Permit Modal */}
            <Modal
                visible={isAddPermitModal}
                animationType="fade"
            >
                <View style={{ padding: 5, gap: 5 }}>
                    <Text>Escoge el permiso</Text>
                    <View style={{ height: '80%' }}>
                        <FlatList
                            data={permits}
                            renderItem={({ item }: { item: any }) => {

                                const translatedItem = translateItem(item);

                                if (translatedItem.name != "Cerrar sesion" && translatedItem.name != "Iniciar sesion") {
                                    return <Button onPress={() => assignPermit(item)}>{translatedItem.name} ({translatedItem.role})</Button>
                                }

                                return <></>;
                            }}
                        />
                    </View>
                    <Button onPress={() => setIsAddPermitModal(false)} >Cancelar</Button>
                </View>
            </Modal>

            {/* Page */}
            <View>
                <Text>{item.name}</Text>
                <Text>{item.description}</Text>
                <Button onPress={() => setIsAddPermitModal(true)}>Asignar permiso</Button>

                {rolePermits.length > 0 && <>
                    <Text>Este usuario puede:</Text>
                    <View style={{ height: '80%' }}>
                        <FlatList
                            data={rolePermits}
                            renderItem={({ item }: { item: any }) => {
                                const translatedItem = translateItem(item);
                                return <Button onPress={() => removePermit(item)}>{translatedItem.name} {translatedItem.role}</Button>
                            }}
                        />
                    </View>
                </>}

            </View>
        </>
    );
}

export default Page;