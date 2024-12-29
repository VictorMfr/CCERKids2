import Button from "@/components/ui/Button";
import { router, Stack, Tabs } from "expo-router";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import useDashBoardController from "./useDashboardController";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const Page = () => {
    const utils = useDashBoardController();

    return (
        <>
            <View style={styles.container}>
                <View style={{ height: 200 }}>
                    <ScrollView showsHorizontalScrollIndicator={false} bounces={false} horizontal style={{ height: 100, marginBottom: 15 }}>
                        <Button style={{ width: 300, marginHorizontal: 10 }} alignText="center" onPress={() => router.push('../users', { relativeToDirectory: true })}>
                            <View style={{ alignItems: 'center', gap: 5 }}>
                                <FontAwesome name="user" color={'white'} size={50} />
                                <Text style={{ color: 'white' }}>Usuarios</Text>
                            </View>
                        </Button>
                        {utils.isSuperuser && (
                            <Button style={{ width: 300, marginHorizontal: 10 }} onPress={() => router.push('../roles', { relativeToDirectory: true })}>
                                <View style={{ alignItems: 'center', gap: 5 }}>
                                    <FontAwesome name="id-card" color={'white'} size={50} />
                                    <Text style={{ color: 'white' }}>Roles</Text>
                                </View>
                            </Button>
                        )}
                        <Button style={{ width: 300, marginHorizontal: 10 }} onPress={() => router.push('../schedules/kids', { relativeToDirectory: true })}>
                            <View style={{ alignItems: 'center', gap: 5 }}>
                                <FontAwesome name="archive" color={'white'} size={50} />
                                <Text style={{ color: 'white' }}>Planificaciones</Text>
                            </View>
                        </Button>
                    </ScrollView>
                    <View style={{ marginBottom: 10, flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
                        <View style={{ width: 8, height: 8, backgroundColor: '#ddd', borderRadius: 10 }} />
                        <View style={{ width: 8, height: 8, backgroundColor: '#ddd', borderRadius: 10 }} />
                        <View style={{ width: 8, height: 8, backgroundColor: '#ddd', borderRadius: 10 }} />
                    </View>
                </View>

                <Text style={{ fontSize: 20, fontWeight: '700', paddingBottom: 10, marginBottom: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>Usuarios</Text>

                {utils.loadingRoles && <ActivityIndicator/>}

                <View style={styles.rolesContainer}>
                    {!utils.loadingRoles && utils.roles.length > 0 && (
                        <FlatList
                            data={utils.roles}
                            showsHorizontalScrollIndicator={false}
                            bounces={false}
                            contentContainerStyle={{ gap: 10 }}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }: { item: any }) => (
                                <Button onPress={() => router.push({
                                    pathname: `./../userRole`,
                                    params: {
                                        name: item.name
                                    }
                                }, {
                                    relativeToDirectory: true
                                })}
                                    style={{ height: 50 }}
                                >{item.name}</Button>
                            )}
                        />
                    )}
                    {!utils.loadingRoles && utils.roles.length == 0 && (
                        <Text style={{ textAlign: 'center' }}>No hay datos</Text>
                    )}
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    notificationsContainer: {
        width: '100%',
        marginBottom: 20,
    },
    notificationsBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
    },
    notificationItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontSize: 16,
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        width: '100%',
    },
    button: {
        width: 120,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
    },
    rolesContainer: {
        height: 400,
        marginBottom: 20,
        width: '100%'
    },
    roleButton: {
        width: 80,
        height: 40,
        marginHorizontal: 5,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        marginTop: 20,
    },
    logoutButton: {
        marginTop: 40,
        padding: 10,
        backgroundColor: '#dc3545',
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default Page;
