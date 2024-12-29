import { StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons"
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storageKeys from "@/constants/storageKeys";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";

const Page = () => {

    const completeOnBoarding = async () => {
        await AsyncStorage.setItem(storageKeys.onBoarding, 'true');
        router.replace('../login');
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
            <Text style={{ color: 'white', fontSize: 40, marginBottom: 20}}>¡Bienvenido!</Text>
            <View style={{ width: '80%', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <FontAwesome name="address-book" color={colors.secondary} size={50} style={{ marginBottom: 20 }} />
                    <FontAwesome name="archive" color={colors.secondary} size={50} style={{ marginBottom: 20 }} />
                    <FontAwesome name="clock-o" color={colors.secondary} size={50} style={{ marginBottom: 20 }} />
                </View>
                <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
                    Esta app permitirá administrar 
                    los procesos de planificaciones
                </Text>
                <Button size="medium" style={{ borderRadius: 5, width: '100%' }} onPress={completeOnBoarding}>Iniciar Sesion</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    onBoarding: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Page;