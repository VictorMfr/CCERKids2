import Text from "@/components/ui/Text";
import useGetNotifications from "@/hooks/fetchHooks/useGetNotifications";
import React from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import SkeletonLoading from 'expo-skeleton-loading';
import { FontAwesome } from "@expo/vector-icons";

function formatDate(dateString: string) {
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debe ser '12'

    const formattedDate = ` ${hours}:${minutes}${ampm} ${day}/${month}/${year}`;
    return formattedDate;
}


const Page = () => {

    const { loadingNotifications, notifications } = useGetNotifications();
    const { height } = useWindowDimensions();


    if (loadingNotifications) return (
        <SkeletonLoading background="#ddd" highlight="white">
            <View style={{ height: height, margin: 10, gap: 5 }}>
                <View style={{ backgroundColor: '#ddd', height: 80 }} />
                <View style={{ backgroundColor: '#ddd', height: 80 }} />
                <View style={{ backgroundColor: '#ddd', height: 80 }} />
                <View style={{ backgroundColor: '#ddd', height: 80 }} />
                <View style={{ backgroundColor: '#ddd', height: 80 }} />
                <View style={{ backgroundColor: '#ddd', height: 80 }} />
                <View style={{ backgroundColor: '#ddd', height: 80 }} />
            </View>
        </SkeletonLoading>

    );

    return (
        <FlatList
            data={notifications}
            contentContainerStyle={{ gap: 5, padding: 10 }}
            ListEmptyComponent={() => (
                <View style={{ flex: 1, height: height - 115, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name="bell-slash" color={'#ddd'} size={30} style={{ marginBottom: 10 }} />
                    <Text style={{ width: 200, textAlign: 'center' }}>Bandeja vacia</Text>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: { item: any }) => (
                <View style={{ elevation: 1, backgroundColor: 'white', padding: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.from}</Text>
                    <Text>{item.message}</Text>
                    <Text style={{ textAlign: 'right', fontSize: 10 }}>{formatDate(item.sent_at)}</Text>
                </View>

            )}
        />

    )
}

export default Page;