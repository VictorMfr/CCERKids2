import storageKeys from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const request = (api: (user: any, token: string) => any) => {
    AsyncStorage.getItem(storageKeys.userData).then(data => {
        if (!data) {
            return Alert.alert('No token', `@userData: ${data}`);
        }

        const user = JSON.parse(data).document;
        const token = JSON.parse(data).token;

        api(user, token);
    });
}

export default request;