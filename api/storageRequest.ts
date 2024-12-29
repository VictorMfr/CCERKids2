import storageKeys from "@/constants/storageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

export const userStorageRequest = (callback: (user: any) => any) => {
    AsyncStorage.getItem(storageKeys.userData).then(data => {
        if (!data) {
            return Alert.alert('No token', `@userData: ${data}`);
        }

        const userData = JSON.parse(data).token;
        callback(userData);
    });

    
}

export const tokenStorageRequest = () => {
    return AsyncStorage.getItem(storageKeys.userData).then(data => {
        if (!data) {
            return Alert.alert('No token', `@userData: ${data}`);
        }

        return JSON.parse(data).token;
    });
}

export const isSuperUserStorageRequest = () => {
    return AsyncStorage.getItem(storageKeys.isSuperUser).then(data => {
        if (!data) {
            return Alert.alert('No token', `@userData: ${data}`);
        }

        return true;
    });
}