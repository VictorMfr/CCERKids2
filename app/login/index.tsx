import api from "@/api/axios";
import loginAsSuperUser from "@/api/loginAsSuperUser";
import loginAsUser from "@/api/loginAsUser";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import storageKeys from "@/constants/storageKeys";
import withLoading from "@/HOC/withLoading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

function responseIsSuccess(response: AxiosResponse<any, any> | string | Error): response is AxiosResponse<any, any> {
    return (response as AxiosResponse<any, any>).data !== undefined;
}

const Page = ({ setLoading }: { setLoading: Dispatch<SetStateAction<boolean>> }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        if (email.length == 0 || password.length == 0) {
            return Alert.alert('Campos no validos');
        }

        if (!email.includes('@') || !email.includes('.')) {
            return Alert.alert('Correo no valido');
        }

        if (password.length < 6) {
            return Alert.alert('Clave no valida');
        }

        setLoading(true);

        const userResponse = await loginAsUser(email, password);

        if (responseIsSuccess(userResponse)) {
            await AsyncStorage.setItem(storageKeys.userData, JSON.stringify(userResponse.data));
            return router.replace('./../userDashboard');
        }

        const superuserResponse = await loginAsSuperUser(email, password);

        if (responseIsSuccess(superuserResponse)) {
            await AsyncStorage.setItem(storageKeys.userData, JSON.stringify(superuserResponse.data));
            await AsyncStorage.setItem(storageKeys.isSuperUser, 'true');
            return router.replace('./../dashboard');
        }

        Alert.alert('Credenciales no validas');
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Iniciar Sesion</Text>
                <Input placeholder="Correo" onChange={text => setEmail(text)} value={email} style={styles.input} />
                <Input passwordType placeholder="Clave" onChange={text => setPassword(text)} value={password} style={styles.input} />
                <Button size="small" onPress={login} style={styles.button}>Iniciar</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 20,
    },
    form: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
});

export default withLoading(Page);