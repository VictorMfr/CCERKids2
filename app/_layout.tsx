import colors from "@/constants/colors";
import withLoadFonts from "@/HOC/withLoadFonts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React from "react";
import { useEffect } from "react";

const printUserCache = () => {

    AsyncStorage.getAllKeys().then(data => {
        if (data.length > 0) {
            console.log("CACHED KEYS:");
            data.forEach((key, index) => {
                AsyncStorage.getItem(key).then(value => {
                    console.log(`${index + 1}. ${key}: ${value}`);
                });
            })
        } else {
            console.log("NO CACHED KEYS");
        }
    });
}

const RootLayout = () => {

    useEffect(() => {
        printUserCache();
    }, []);

    return (
        <Stack screenOptions={{ statusBarStyle: "light", statusBarBackgroundColor: colors.primary, headerStyle: { backgroundColor: colors.primary }, headerTintColor: 'white' }} >
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen name="dashboard/(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen name="login/index" options={{ headerShown: false }}/>
            <Stack.Screen name="dashboard/users/user/index" options={{ title: "Detalles de usuario"  }}/>
            <Stack.Screen name="dashboard/users/index" options={{ title: "Usuarios"  }}/>
            <Stack.Screen name="dashboard/roles/index" options={{ title: "Roles"  }}/>
            <Stack.Screen name="dashboard/schedules/index" options={{ title: "Planificaciones"  }}/>
            <Stack.Screen name="dashboard/schedules/kids/index" options={{ title: "Planificacion Niños"  }}/>
            <Stack.Screen name="dashboard/schedules/kids/chronogram/index" options={{ title: "Cronograma Niños"  }}/>
            <Stack.Screen name="dashboard/schedules/kids/reporter" options={{ title: "Calculadora de Cronograma"  }}/>
            <Stack.Screen name="userDashboard/(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen name="userDashboard/teacher/index" options={{ title: 'Cronograma de Maestros' }}/>
            <Stack.Screen name="userDashboard/helper/index" options={{ title: 'Cronograma de Auxiliares' }}/>
            <Stack.Screen name="userDashboard/teacher/scheduleEditor/index" options={{ title: 'Editor de Planificaciones' }}/>
            <Stack.Screen name="onBoarding/index" options={{ headerShown: false }}/>
        </Stack>
    );
}

export default withLoadFonts(RootLayout);