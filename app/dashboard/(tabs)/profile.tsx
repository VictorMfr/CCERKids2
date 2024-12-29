import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import useProfileController from "@/hooks/profile/useProfileController";
import useGetStorageUser from "@/hooks/storageHooks/useGetStorageUser";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Clipboard, Modal, Pressable, View } from "react-native";

const Page = () => {

    const { state, utils, dispatch } = useProfileController();

    return (
        <>
            <Modal
                visible={state.updateModal}
                animationType="fade"
                statusBarTranslucent
                transparent
            >
                <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', padding: 10, gap: 10, borderRadius: 10, width: '80%' }}>
                        <Text style={{ fontSize: 18, fontWeight: '700' }}>Cambiar Credenciales</Text>
                        <Input placeholder="Nombre" onChange={text => dispatch({ name: "setName", value: text })} value={state.name}/>
                        <Input placeholder="Apellido" onChange={text => dispatch({ name: "setLastName", value: text })} value={state.lastName}/>
                        <Input placeholder="Telefono" onChange={text => dispatch({ name: "setPhoneNumber", value: text })} value={state.phoneNumber}/>
                        
                        <Text>(Opcional)</Text>
                        <Input placeholder="Contraseña" onChange={text => dispatch({ name: "setPassword", value: text })} value={state.password}/>
                        <Input placeholder="Repetir Contraseña" onChange={text => dispatch({ name: "setPasswordRepeat", value: text })} value={state.passwordRepeat}/>

                        <Button onPress={utils.save}>Guardar</Button>
                        <Button onPress={() => dispatch({ name: 'setUpdateModal', value: false })}>Cancelar</Button>
                    </View>
                </View>
            </Modal>

            {!utils.loadingUser && utils.user && <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '80%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 1 }}>
                    <FontAwesome name="user" color={colors.primary} size={35} style={{ marginBottom: 10 }} />

                    <Text style={{ fontSize: 18, fontWeight: 'bold' }} >{utils.user.name} {utils.user.lastName}</Text>

                    <Pressable onPress={utils.copyToClipboard}>
                        <Text style={{ color: '#999', borderBottomWidth: 1, borderBottomColor: "#ddd" }}>{utils.user.phoneNumber}</Text>
                    </Pressable>


                    <View style={{ marginVertical: 30, alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Correo electrónico</Text>
                        <Text>{utils.user.email}</Text>
                    </View>

                    <View style={{ gap: 5, width: '100%' }}>
                        <Button onPress={utils.changeCredentialsModal}>Cambiar Credenciales</Button>
                        <Button onPress={utils.logout} style={{ backgroundColor: '#DB3232' }}>Cerrar sesion</Button>
                    </View>

                    
                </View>
            </View> || <ActivityIndicator />}
        </>
    )
}

export default Page;