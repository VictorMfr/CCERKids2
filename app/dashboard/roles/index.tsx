import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import useRolesController from "@/hooks/roles/useRolesController";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";

const Page = () => {

    const { state, dispatch, utils } = useRolesController();

    return (
        <>
            <Modal
                visible={state.isAddRoleModal || !!state.updateRoleData}
                animationType="fade"
                statusBarTranslucent
                transparent
            >
                <View style={{ flex: 1, backgroundColor: '#00000055', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'white', width: '60%', height: 'auto', gap: 5, padding: 5 }}>
                        <Input placeholder="Nombre" onChange={text => dispatch({ name: 'setModalName', value: text })} value={state.modalName} />
                        <Input placeholder="Descripcion" onChange={text => dispatch({ name: 'setModalDescription', value: text })} value={state.modalDescription} />
                        <Button onPress={() => state.updateRoleData ? utils.update() : utils.save()}>{state.updateRoleData ? 'Actualizar' : 'Añadir'}</Button>
                        <Button onPress={() => dispatch({ name: 'closeModal' })}>Cancelar</Button>
                    </View>
                </View>
            </Modal>

            {/* Page */}
            <View style={{ flex: 1, padding: 5 }}>
                <Input style={{ marginBottom: 5 }} placeholder="Buscar" onChange={text => dispatch({ name: 'setSearchTerm', value: text })} value={state.searchTerm} />
                {!utils.loadingRoles && (<FlatList
                    data={utils.roles}
                    contentContainerStyle={{ flex: 1, flexDirection: 'column', gap: 5 }}
                    renderItem={({ item }) => (
                        <Button 
                            
                            onPress={() => router.push({
                            pathname: './role',
                            params: {
                                item: JSON.stringify(item)
                            }
                        }, {
                            relativeToDirectory: true
                        })} 
                        style={{ backgroundColor: colors.primary }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                <Text style={{ color: 'white', textAlignVertical: 'center' }}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    <Button onPress={() => utils.deleteHandler(item)} style={{ width: 80, backgroundColor: '#C33636' }}>Eliminar</Button>
                                    <Button onPress={() => dispatch({ name: 'setModalData', value: { name: item.name, description: item.description, updateRoleData: item._id } })} style={{ width: 80 }}>Editar</Button>
                                </View>
                            </View>
                        </Button>
                    )}
                />) || <ActivityIndicator />}
                <Button size="medium" onPress={() => dispatch({ name: 'setIsAddRoleModal', value: true })} style={{ width: 60, height: 60, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 30, right: 30, borderRadius: 20 }}>
                    <Ionicons name="document-attach" color={'white'} size={25} />
                </Button>
            </View>
        </>
    )
}

export default Page;
