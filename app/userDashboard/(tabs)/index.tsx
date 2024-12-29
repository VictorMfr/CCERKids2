import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import useGetRolesByUser from "@/hooks/fetchHooks/useGetRolesByUser";
import useGetStorageUser from "@/hooks/storageHooks/useGetStorageUser";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Page = () => {

    const { userRoles, loadingUserRoles } = useGetRolesByUser();
    const { user, loadingUser } = useGetStorageUser();

    return (
        <>
            {!loadingUserRoles && <>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <View style={{ marginBottom: 20, alignItems: 'center'  }}>
                        <FontAwesome name="user" color={colors.primary} size={38} style={{ marginBottom: 10 }}/>
                        <Text style={{ textAlign: 'center' }}>¡Bienvenido!</Text>
                        <Text style={{ textAlign: 'center' }}>{user.name} {user.lastName}</Text>
                    </View>

                    <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 20 }}>Roles del Usuario</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                        {userRoles.find((e: any) => e.role.name == 'Maestro') && <Button style={styles.gridButton} onPress={() => router.push('../teacher', { relativeToDirectory: true })}>Maestro</Button>}
                        {userRoles.find((e: any) => e.role.name == 'Coordinador') && <Button style={styles.gridButton} onPress={() => router.push('./../../dashboard', { relativeToDirectory: true })}>Coordinador</Button>}
                        {userRoles.find((e: any) => e.role.name == 'Auxiliar') && <Button style={styles.gridButton} onPress={() => router.push('../helper', { relativeToDirectory: true })}>Auxiliar</Button>}
                        {userRoles.find((e: any) => e.role.name == 'Limpieza') && <Button style={styles.gridButton} onPress={() => router.push('../cleaner', { relativeToDirectory: true })}>Limpieza</Button>}
                        {userRoles.find((e: any) => e.role.name == 'Protocolo') && <Button style={styles.gridButton} onPress={() => router.push('../protocol', { relativeToDirectory: true })}>Protocolo</Button>}
                    </View>
                </View>
            </> || <ActivityIndicator />}
        </>
    );
}

const styles = StyleSheet.create({
    gridButton: {
        width: 140,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
    },
    formBackground: {
        flex: 1,
        backgroundColor: '#00000055',
        alignItems: 'center',
        justifyContent: 'center'
    },
    form: {
        backgroundColor: 'white',
        width: '60%',
        height: 'auto',
        gap: 5,
        padding: 5
    }
})

export default Page;
