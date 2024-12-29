import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Alert } from "react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import api from "@/api/axios";
import { router, useLocalSearchParams } from "expo-router";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import getStorageUser from "@/utils.ts/getStorageUser";

const Page = () => {
    const [text, setText] = useState("");
    const params: any = useLocalSearchParams();
    const chronogram = JSON.parse(params.chronogram);

    const handleSave = async () => {

        const token = await getStorageToken();
        const user = await getStorageUser();

        Alert.alert('Seguro que deseas guardar?', '', [
            {
                text: 'Guardar',
                onPress: async () => {
                    const response = await api.patch(`/kidChronograms/${chronogram._id}/addScheduleDescription`, {
                        target: chronogram.bigGroup.teacher._id == user._id? 'bigGroup': 'smallGroup',
                        value: text
                    }, defaultAuthHeader(token));

                    if (response.status === 200) {
                        Alert.alert('Guardado', 'Guardado con exito');
                        router.back();
                    } else {
                        Alert.alert('Error', 'Hubo un error al guardar');
                    }
                }
            },
            {
                text: 'Cancelar',
                style: 'cancel'
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Input
                    onChange={text => setText(text)}
                    value={text}
                    style={{ flex: 1, textAlignVertical: 'top' }}
                    placeholder="Empieza a Escribir"
                    multiline
                />
                
            </ScrollView>
            <View style={{ height: 20 }} />
            <Button onPress={handleSave}>Guardar</Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    }
});

export default Page;