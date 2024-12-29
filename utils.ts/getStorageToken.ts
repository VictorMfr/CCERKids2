import storageKeys from "@/constants/storageKeys"
import AsyncStorage from "@react-native-async-storage/async-storage"

const getStorageToken = async () => {
    try {
        const data = await AsyncStorage.getItem(storageKeys.userData);
        
        if (!data) {
            throw new Error("No hay token");
        }
        
        return JSON.parse(data).token;
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default getStorageToken;