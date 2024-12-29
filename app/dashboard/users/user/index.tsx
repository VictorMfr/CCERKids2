import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import useUserController from "@/hooks/users/useUserController";
import React from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, View } from "react-native";

const Page = () => {

    
    const { utils } = useUserController();

    return (
        <>
            <Modal
                visible={utils.isModal}
                animationType="fade"
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 }}>
                    {!utils.loadingRoles && (
                        <>
                            <FlatList
                                data={utils.roles}
                                renderItem={({ item }) => (
                                    <View style={{ backgroundColor: 'white', margin: 5  }}>
                                        <Button onPress={() => utils.addRole(item)} size="large">{item.name}</Button>
                                    </View>
                                )}
                            />
                            <Button size="medium" onPress={utils.closeModal}>Cancelar</Button>
                        </>

                    ) || <ActivityIndicator />}
                </View>
            </Modal>

            {/* Page */}
            <View>
                <View style={{ padding: 10, marginBottom: 10, alignItems: 'center', paddingTop: 30 }}>
                    <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, width: '100%', elevation: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nombre: </Text>
                            <Text>{utils.userData.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Apellido: </Text>
                            <Text>{utils.userData.lastName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Correo: </Text>
                            <Text>{utils.userData.email}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Sexo: </Text>
                            <Text>{utils.userData.gender == 'male' ? "Masculino" : "Femenino"}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Telefono: </Text>
                            <Pressable onPress={() => utils.copyToClipboard(utils.userData.phoneNumber)}><Text style={{ color: '#999', borderBottomWidth: 1, borderBottomColor: '#999' }}>{utils.userData.phoneNumber}</Text></Pressable>
                        </View>
                    </View>
                </View>





                <View style={{ margin: 10, padding: 10, alignItems: 'center', borderRadius: 10, backgroundColor: 'white', elevation: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', width: '50%', textAlign: 'center' }}>Roles del Usuario</Text>
                    
                    {utils.loadingUserRoles && <ActivityIndicator/>}
                    {!utils.loadingUserRoles && utils.userRoles && <FlatList
                        data={utils.userRoles.filter((role: any) => role.removed_at == null)}
                        numColumns={3}
                        ListEmptyComponent={() => <Text>Sin roles</Text>}
                        contentContainerStyle={{ alignItems: 'center' }}
                        renderItem={({ item }) => (
                            <Button
                                onPress={() => utils.deleteRole(item.role._id)}
                                style={{ width: 140, height: 100, margin: 5 }}>
                                {item.role.name}
                            </Button>
                        )}
                    />}
                </View>

                <View style={{ margin: 10, padding: 10, alignItems: 'center', borderRadius: 10, backgroundColor: 'white', elevation: 1 }}>
                    <Button style={{ width: '100%', alignSelf: 'center', height: 50 }} onPress={utils.openModal}>Asignar Nuevo Rol</Button>
                </View>

            </View>
        </>
    );
}

export default Page;