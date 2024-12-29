import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import useGetUsersByRole from "@/hooks/fetchHooks/useGetUsersByRole";
import useGetStorageUser from "@/hooks/storageHooks/useGetStorageUser";
import getStorageUser from "@/utils.ts/getStorageUser";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

const Page = () => {

    const params = useLocalSearchParams();
    const { users, loadingUsers } = useGetUsersByRole(params);
    const navigation = useNavigation();
    const { user } = useGetStorageUser();

    useEffect(() => {
        navigation.setOptions({ title: params.name });
    }, [navigation]);

    return (
        <View style={{ flex: 1, padding: 5 }}>
            <Input style={{ marginBottom: 5 }} placeholder="Buscar" />
            {!loadingUsers ? (
                <FlatList
                    data={users.filter((usr: any) => usr._id != user._id)}
                    contentContainerStyle={{ gap: 5 }}
                    ListEmptyComponent={() => (
                        <Text style={{ textAlign: 'center' }}>No hay usuarios de este rol</Text>
                    )}
                    renderItem={({ item, index }: { item: any, index: number }) => (
                        <Button
                            style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 0, backgroundColor: colors.secondary, marginBottom: users.length - 1 == index ? 100 : 0, elevation: 1 }}
                            onPress={() => router.push({
                                pathname: './../users/user',
                                params: {
                                    item: JSON.stringify(item)
                                }
                            }, { relativeToDirectory: true })}>
                            {item.name} {item.lastName}
                        </Button>
                    )}
                />
            ) : (
                <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
            )}
        </View>
    );
}

export default Page;
