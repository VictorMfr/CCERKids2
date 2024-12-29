import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

const Page = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seleciona una pagina</Text>
            <Button style={styles.button} onPress={() => router.push('./kids', { relativeToDirectory: true })}>Niños</Button>
            <Button style={styles.button}>Protocolo</Button>
            <Button style={styles.button}>Limpieza</Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    button: {
        marginVertical: 10,
        width: '80%'
    }
})

export default Page;