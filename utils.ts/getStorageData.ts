import storageKeys from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage"

const GetStorageData = async () => {
    try {
        const data = await AsyncStorage.getItem(storageKeys.userData);

        if (!data) {
            throw new Error("@userData is null");
        }

        const parsedData = JSON.parse(data);

        const user = parsedData.document;
        const token = parsedData.token;

        return { user, token };
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

export default GetStorageData;