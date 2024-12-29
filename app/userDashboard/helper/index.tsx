import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, View } from "react-native";
import useGetChronogram from "@/hooks/fetchHooks/useGetChronogram";
import { useEffect, useState } from "react";
import React from "react";
import Input from "@/components/ui/Input";
import notifyDrawback from "./notifyDrawback";
import { router } from "expo-router";
import getStorageUser from "@/utils.ts/getStorageUser";
import useGetStorageUser from "@/hooks/storageHooks/useGetStorageUser";


const Page = () => {

    const { chronogram, loadingChronogram, setChronogram } = useGetChronogram();
    const [DrawbackModal, setDrawbackModal] = useState<any>(null);
    const [DrawbackReason, setDrawbackReason] = useState('');
    const [scheduleDescription, setScheduleDescription] = useState<any>(null);

    const { user, setUser } = useGetStorageUser();

    const sendDrawback = async () => {
        try {
            //What does the following line do?
            await notifyDrawback(DrawbackReason, DrawbackModal, setChronogram);
            setDrawbackModal(null);
            setDrawbackReason('');
        } catch (error) {
            Alert.alert('Error', error as any)
        }
    }

    const isHelperInBigGroup = (chronogram: any) => {
        return chronogram.bigGroup.helper._id == user._id;
    }

    const isHelperInSmallGroup = (chronogram: any) => {
        return chronogram.smallGroup.helper._id == user._id;
    }

    const filterChronogramByUserId = (chronogram: any) => {
        return chronogram.filter((item: any) => {
            return item.bigGroup.helper._id == user._id || item.smallGroup.helper._id == user._id;
        });
    }

    const filterChronogramByNotHelperDrawback = (chronogram: any) => {
        return chronogram.filter((item: any) => {

            if (isHelperInBigGroup(item)) {
                return !item.bigGroup.helperDrawback;
            }

            if (isHelperInSmallGroup(item)) {
                return !item.smallGroup.helperDrawback;
            }
        });
    }

    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };

    const isDescription = async () => {
        const userData = await getStorageUser();

        const isDescriptionNotLoaded = chronogram.find((item: any) => {
            return ((item.bigGroup.helper._id == userData._id && item.bigGroup.scheduleDescription == undefined && !item.bigGroup.helperDrawback) || (item.smallGroup.helper._id == userData._id && item.smallGroup.scheduleDescription == undefined && !item.smallGroup.helperDrawback));
        });

        if (isDescriptionNotLoaded) {
            Alert.alert('Atencion', 'Tiene planificaciones pendientes, debe cargar su planificacion');
        }
    }

    useEffect(() => {
        if (!loadingChronogram) {
            isDescription();
        }

    }, [loadingChronogram]);

    return (
        <>
            {/* Drawback modal */}
            <Modal
                visible={!!DrawbackModal}
                animationType="fade"
                transparent
                statusBarTranslucent
            >
                <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', width: '80%', padding: 20, borderRadius: 10 }}>
                        <Input multiline placeholder="Motivo" style={{ height: 50, marginBottom: 20 }} onChange={text => setDrawbackReason(text)} value={DrawbackReason} />
                        <Button onPress={sendDrawback} style={{ marginBottom: 10 }}>Enviar</Button>
                        <Button onPress={() => setDrawbackModal(null)}>Cancelar</Button>
                    </View>
                </View>
            </Modal>

            {/* Shedule Description Modal */}
            <Modal
                visible={!!scheduleDescription}
                animationType="fade"
            >
                
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        {(scheduleDescription && isHelperInBigGroup(scheduleDescription) && scheduleDescription.bigGroup.scheduleDescription) && <ScrollView style={{ height: '95%' }}><Text>{scheduleDescription.bigGroup.scheduleDescription}</Text></ScrollView>}
                        {(scheduleDescription && isHelperInSmallGroup(scheduleDescription) && scheduleDescription.smallGroup.scheduleDescription) && <ScrollView style={{ height: '95%' }}><Text>{scheduleDescription.smallGroup.scheduleDescription}</Text></ScrollView>}
                        <Button onPress={() => setScheduleDescription(null)}>Cancelar</Button>
                    </View>
                
            </Modal>

            <View>
                {!loadingChronogram && <FlatList
                    data={filterChronogramByNotHelperDrawback(filterChronogramByUserId(chronogram))}
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>No hay datos</Text>
                        </View>
                    )}
                    renderItem={({ item }: { item: any }) => {
                        return (
                            <View style={styles.item}>
                                <Text style={styles.date}>Fecha: {formatDate(item.date)}</Text>
                                <Text style={styles.groupTitle}>Niños Grandes</Text>
                                <Text style={styles.title}>Titulo: {item.bigGroup.title}</Text>
                                <Text style={styles.target}>Objetivo: {item.bigGroup.target}</Text>
                                <Text style={styles.biblicQuotes}>Citas biblicas: {item.bigGroup.biblic_quotes}</Text>
                                <Text style={styles.complementaryQuotes}>Citas Auxiliares: {item.bigGroup.complementary_biblic_quotes}</Text>
                                <Text style={styles.helper}>Maestro: {item.bigGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} {item.bigGroup.helper.name} {item.bigGroup.helper.lastName}</Text>
                                <Text style={styles.helper}>Auxiliar: {item.bigGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} {item.bigGroup.helper.name} {item.bigGroup.helper.lastName}</Text>
                                
                                <View style={{ marginVertical: 5 }} />
                                {isHelperInBigGroup(item) && item.bigGroup.scheduleDescription && <Text style={{ color: 'green' }}>PLANIFICACION CARGADA</Text> || <Text style={{ color: 'red' }}>PLANIFICACION PENDIENTE</Text>}

                                <Text style={styles.groupTitle}>Niños Pequeños</Text>
                                <Text style={styles.title}>Titulo: {item.smallGroup.title}</Text>
                                <Text style={styles.target}>Objetivo: {item.smallGroup.target}</Text>
                                <Text style={styles.biblicQuotes}>Citas biblicas: {item.smallGroup.biblic_quotes}</Text>
                                <Text style={styles.complementaryQuotes}>Citas Auxiliares: {item.smallGroup.complementary_biblic_quotes}</Text>
                                <Text style={styles.helper}>Maestro: {item.smallGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} {item.smallGroup.helper.name} {item.smallGroup.helper.lastName}</Text>
                                <Text style={styles.helper}>Auxiliar: {item.smallGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} {item.smallGroup.helper.name} {item.smallGroup.helper.lastName}</Text>
                                
                                <View style={{ marginVertical: 5 }} />
                                {isHelperInSmallGroup(item) && (item.smallGroup.scheduleDescription && <Text style={{ color: 'green' }}>PLANIFICACION CARGADA</Text> || <Text style={{ color: 'red' }}>PLANIFICACION PENDIENTE</Text>)}


                                
                                

                                <Button onPress={() => setDrawbackModal(item)} style={{ marginTop: 20 }}>Presentar inconveniente</Button>
                                {((isHelperInBigGroup(item) && !item.bigGroup.scheduleDescription) || (isHelperInSmallGroup(item) && !item.smallGroup.scheduleDescription)) && <Button onPress={() => router.push({
                                    pathname: './scheduleEditor', params: {
                                        chronogram: JSON.stringify(item)
                                    }
                                }, { relativeToDirectory: true })}>Cargar planificacion</Button>}

                                {((isHelperInBigGroup(item) && item.bigGroup.scheduleDescription) || (isHelperInSmallGroup(item) && !item.smallGroup.scheduleDescription)) && <Button onPress={() => setScheduleDescription(item)}>Ver planificacion</Button>}
                            </View>
                        )
                    }}
                /> || <ActivityIndicator />}
            </View>
        </>
    )
}



const styles = StyleSheet.create({
    item: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    target: {
        fontSize: 14,
    },
    biblicQuotes: {
        fontSize: 14,
    },
    complementaryQuotes: {
        fontSize: 14,
    },
    teacher: {
        fontSize: 14,
    },
    helper: {
        fontSize: 14,
    },
    text: {
        fontSize: 14,
    },
})

export default Page;
