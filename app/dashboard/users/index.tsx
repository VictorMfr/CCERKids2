import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import useUsersController from "@/hooks/users/useUsersController";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";

const Page = () => {
    const { state, dispatch, utils } = useUsersController();

    return (
        <>
            <Modal visible={state.isAddUserModal || !!state.updateUserData} animationType="fade" statusBarTranslucent transparent>
                <View style={{ flex: 1, backgroundColor: '#00000055', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'white', width: '70%', height: 'auto', gap: 5, padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{state.updateUserData ? "Actualizar Usuario" : "Crear Usuario"}</Text>
                        <Input placeholder="Nombre" onChange={text => dispatch({ name: 'setModalName', value: text })} value={state.modalName} />
                        <Input placeholder="Apellido" onChange={text => dispatch({ name: 'setModalLastname', value: text })} value={state.modalLastname} />
                        <Input placeholder="Telefono" onChange={text => dispatch({ name: 'setModalPhoneNumber', value: text })} value={state.modalPhoneNumber} />
                        <Input placeholder="Correo" onChange={text => dispatch({ name: 'setModalEmail', value: text })} value={state.modalEmail} />
                        {!state.updateUserData && <Input placeholder="Clave" onChange={text => dispatch({ name: 'setModalPassword', value: text })} value={state.modalPassword} />}
                        <Select placeholder="Seleccionar genero" onChange={text => dispatch({ name: 'setModalGender', value: text })} value={state.modalGender}>
                            <Select.Option placeholder={'Hombre'} value={'male'} />
                            <Select.Option placeholder={'Mujer'} value={'female'} />
                        </Select>
                        <View style={{ gap: 5 }}>
                            <Button onPress={() => state.updateUserData ? utils.update() : utils.save()}>{state.updateUserData ? "Actualizar" : "Guardar"}</Button>
                            <Button onPress={() => dispatch({ name: "closeModal" })}>Cancelar</Button>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{ flex: 1, padding: 5 }}>
                <Input style={{ marginBottom: 5 }} placeholder="Buscar" onChange={text => dispatch({ name: 'setSearchTerm', value: text })} value={state.searchTerm} />
                {!utils.loadingUsers ? (
                    <FlatList
                        ListEmptyComponent={() => (
                            <Text style={{ textAlign: 'center' }}>No hay usuarios</Text>
                        )}
                        showsVerticalScrollIndicator={false}
                        data={utils.users.filter(user => (user.name.includes(state.searchTerm) || user.lastName.includes(state.searchTerm)) && user._id !== utils.user._id)}
                        contentContainerStyle={{ gap: 5 }}
                        renderItem={({ item, index }) => (
                            <Button onPress={() => router.push({ pathname: './user', params: { item: JSON.stringify(item) } }, { relativeToDirectory: true })} style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 0, paddingHorizontal: 0, backgroundColor: colors.primary, marginBottom: utils.users.length - 1 == index ? 100 : 0 }}>
                                <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Text style={{ color: 'white', width: '50%' }}>{item.name} {item.lastName}</Text>
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        <Button onPress={() => utils.deleteHandler(item)} style={{ width: 80, backgroundColor: '#C33636' }}>Borrar</Button>
                                        <Button onPress={() => dispatch({ name: 'setModalData', value: { name: item.name, lastName: item.lastName, phoneNumber: item.phoneNumber, email: item.email, gender: item.gender, updateUserData: item._id } })} style={{ width: 80 }}>Editar</Button>
                                    </View>
                                </View>
                            </Button>
                        )}
                    />
                ) : (
                    <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
                )}
                <Button size="medium" onPress={() => dispatch({ name: 'setIsAddUserModal', value: true })} style={{ width: 60, height: 60, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 30, right: 30, borderRadius: 20 }}>
                    <Ionicons name="person-add" color={'white'} size={25} />
                </Button>
            </View>
        </>
    )
}

export default Page;
