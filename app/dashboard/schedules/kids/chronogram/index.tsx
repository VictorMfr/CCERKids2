import api from "@/api/axios";
import Button from "@/components/ui/Button";
import CartInput from "@/components/ui/CartInput";
import FetchSelect from "@/components/ui/FetchSelect";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import storageKeys from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Clipboard, FlatList, Modal, ScrollView, StyleSheet, View } from "react-native";
import Switch from "@/components/ui/Switch";
import useGetTeachers from "@/hooks/fetchHooks/useGetTeachers";
import useGetHelpers from "@/hooks/fetchHooks/useGetHelpers";
import getStorageToken from "@/utils.ts/getStorageToken";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageUser from "@/utils.ts/getStorageUser";

const Page = () => {

    const [loadingChronogram, setLoadingChronogram] = useState(true);
    const [chronogram, setChronogram] = useState<any[]>([]);
    const [chronogramItemDetails, setChronogramItemDetails] = useState<null | any>(null);
    const [updateChronogram, setUpdateChronogram] = useState<null | any>(null);

    const [showDescription, setShowDescription] = useState<'bigGroup' | 'smallGroup' | ''>('');

    const [bigGroupTitle, setBigGroupTitle] = useState('');
    const [bigGroupTarget, setBigGroupTarget] = useState('');
    const [bigGroupMainQuotes, setBigGroupMainQuotes] = useState<string[]>([]);
    const [bigGroupHelperQuotes, setBigGroupHelperQuotes] = useState<string[]>([]);
    const [bigGroupTeacher, setBigGroupTeacher] = useState<any>('');
    const [bigGroupHelper, setBigGroupHelper] = useState<any>('');

    const [smallGroupTitle, setSmallGroupTitle] = useState('');
    const [smallGroupTarget, setSmallGroupTarget] = useState('');
    const [smallGroupMainQuotes, setSmallGroupMainQuotes] = useState<string[]>([]);
    const [smallGroupHelperQuotes, setSmallGroupHelperQuotes] = useState<string[]>([]);
    const [smallGroupTeacher, setSmallGroupTeacher] = useState<any>('');
    const [smallGroupHelper, setSmallGroupHelper] = useState<any>('');

    const { teachers, loadingTeachers } = useGetTeachers();
    const { helpers, loadingHelpers } = useGetHelpers();

    const [isfilterByDrawback, setIsFilterByDrawBack] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(storageKeys.userData).then(data => {
            if (!data) {
                return Alert.alert('No token', `@userData: ${data}`);
            }

            const token = JSON.parse(data).token;

            api.get('/kidChronogram/getChronogram', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }).then(response => {
                if (response.status == 200) {
                    setChronogram(response.data);
                    setLoadingChronogram(false);
                }
            })
        })
    }, []);

    const confirmUpdate = () => {
        Alert.alert('Atencion', 'seguro?', [
            {
                text: "Aceptar",
                onPress() {
                    update()
                }
            },
            {
                text: "Cancelar"
            }
        ])
    }

    const calculateNotificationReceivers = (item: any) => {

        let receivers: string[] = [];
        
        if (item.bigGroup.teacherDrawback) receivers.push(bigGroupTeacher._id);
        if (item.bigGroup.helperDrawback) receivers.push(bigGroupHelper._id); 
        if (item.smallGroup.teacherDrawback) receivers.push(smallGroupTeacher);
        if (item.smallGroup.helperDrawback) receivers.push(smallGroupHelper); 

        if (receivers.length == 1) return receivers[0];
        return receivers;
    }

    const update = async () => {
        try {
            const token = await getStorageToken();
            const user = await getStorageUser();

            const response = await api.patch(`/kidChronograms/${updateChronogram._id}`, {
                bigGroup: {
                    title: bigGroupTitle,
                    target: bigGroupTarget,
                    biblic_quotes: bigGroupMainQuotes,
                    complementary_biblic_quotes: bigGroupHelperQuotes,
                    teacher: bigGroupTeacher._id,
                    helper: bigGroupHelper._id
                },
                smallGroup: {
                    title: smallGroupTitle,
                    target: smallGroupTarget,
                    biblic_quotes: smallGroupMainQuotes,
                    complementary_biblic_quotes: smallGroupHelperQuotes,
                    teacher: smallGroupTeacher._id,
                    helper: smallGroupHelper._id
                }
            }, defaultAuthHeader(token));

            if (response.status != 200) {
                throw new Error(response.data);
            }

            const notifyResponse = await api.post('/notification', {
                from: getFullName(user),
                to: calculateNotificationReceivers(updateChronogram),
                message: 'Hubo un cambio en el cronograma en el que estas incluido, revise su buzon'
            }, defaultAuthHeader(token));

            if (notifyResponse.status != 200) {
                throw new Error(notifyResponse.data)
            }

            setChronogram(prev => prev.map(element => (
                element._id == updateChronogram._id) ? {
                _id: response.data._id,
                date: response.data.date,
                bigGroup: { ...response.data.bigGroup, teacher: bigGroupTeacher, helper: bigGroupHelper },
                smallGroup: { ...response.data.smallGroup, teacher: smallGroupTeacher, helper: smallGroupHelper }
            } : element));

            setUpdateChronogram(null);
            Alert.alert('exito');

        } catch (error) {
            console.log(error);
        }
    }

    const getFullName = (item: any) => {
        if (item.name && item.lastName && item.gender) {
            return `${(item.gender == 'male') ? 'Hno.' : 'Hna.'} ${item.name} ${item.lastName}`;
        } else {
            return item;
        }
    }

    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    };


    const formatData = () => {

        const date = formatDate(chronogramItemDetails.date)

        const text = `
Fecha: ${date}

Niños grandes:
Tema: ${chronogramItemDetails.bigGroup.title}
Objetivo: ${chronogramItemDetails.bigGroup.target}
Citas principales: ${chronogramItemDetails.bigGroup.biblic_quotes.join(', ')}
Citas auxiliares: ${chronogramItemDetails.bigGroup.complementary_biblic_quotes.join(', ')}
Docente: ${chronogramItemDetails.bigGroup.teacher.gender == 'male' ? 'Hno.' : 'Hna.'} ${chronogramItemDetails.bigGroup.teacher.name} ${chronogramItemDetails.bigGroup.teacher.lastName}
Auxiliar: ${chronogramItemDetails.bigGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} ${chronogramItemDetails.bigGroup.helper.name} ${chronogramItemDetails.bigGroup.helper.lastName}

Niños pequeños:
Tema: ${chronogramItemDetails.smallGroup.title}
Objetivo: ${chronogramItemDetails.smallGroup.target}
Citas principales: ${chronogramItemDetails.smallGroup.biblic_quotes.join(', ')}
Citas auxiliares: ${chronogramItemDetails.smallGroup.complementary_biblic_quotes.join(', ')}
Docente: ${chronogramItemDetails.smallGroup.teacher.gender == 'male' ? 'Hno.' : 'Hna.'} ${chronogramItemDetails.smallGroup.teacher.name} ${chronogramItemDetails.smallGroup.teacher.lastName}
Auxiliar: ${chronogramItemDetails.smallGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} ${chronogramItemDetails.smallGroup.helper.name} ${chronogramItemDetails.smallGroup.helper.lastName}
            `;

        return text;
    }


    const copyToClipBoard = () => {
        const textToCopy = formatData();
        Clipboard.setString(textToCopy);
    }

    const filterByDrawback = (chronogram: any[]) => {
        const filteredChronogram = chronogram.filter(element => (
            element.bigGroup.teacherDrawback ||
            element.bigGroup.helperDrawback ||
            element.smallGroup.teacherDrawback ||
            element.smallGroup.helperDrawback
        ));

        return filteredChronogram;
    }


    return (
        <>

            {/* Update Chronogram modal */}
            <Modal
                visible={!!updateChronogram}
                animationType="fade"
                transparent

            >
                <View style={{ flex: 1, backgroundColor: '#00000055', alignItems: 'center', justifyContent: 'center' }}>
                    <ScrollView style={{ backgroundColor: 'white', width: '100%' }}>
                        <View style={{ gap: 10, padding: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: '400' }}>Niños grandes</Text>
                            <Input placeholder="Tema" onChange={text => setBigGroupTitle(text)} value={bigGroupTitle} />
                            <Input multiline placeholder="Objetivo" onChange={text => setBigGroupTarget(text)} value={bigGroupTarget} />

                            <Text>Citas principales</Text>
                            <CartInput
                                askDeletion
                                placeholder="Citas"
                                value={bigGroupMainQuotes}
                                onChange={(quotes) => setBigGroupMainQuotes(prev => quotes)}
                            />

                            <Text>Citas auxiliares</Text>
                            <CartInput
                                askDeletion
                                placeholder="Complementos"
                                value={bigGroupHelperQuotes}
                                onChange={(quotes) => setBigGroupHelperQuotes(prev => quotes)}
                            />
                            <FetchSelect
                                placeholder="Seleccionar Maestro"
                                value={getFullName(bigGroupTeacher)}
                                list={teachers}
                                renderItem={({ item, closeModal }) => (
                                    <Button
                                        onPress={() => {
                                            setBigGroupTeacher(item);
                                            closeModal();
                                        }}>
                                        {getFullName(item)}
                                    </Button>
                                )}
                                loadingList={loadingTeachers}
                            />
                            <FetchSelect
                                placeholder="Seleccionar Auxiliar"
                                value={getFullName(bigGroupHelper)}
                                list={helpers}
                                renderItem={({ item, closeModal }) => (
                                    <Button onPress={() => {
                                        setBigGroupHelper(item);
                                        closeModal();
                                    }}>
                                        {getFullName(item)}
                                    </Button>
                                )}
                                loadingList={loadingHelpers}
                            />
                            <View style={{ height: 1, backgroundColor: '#ddd', width: '100%', marginVertical: 50 }} />
                            <Text style={{ fontSize: 20, fontWeight: '400' }}>Niños pequeños</Text>
                            <Input placeholder="Tema" onChange={text => setSmallGroupTitle(text)} value={smallGroupTitle} />
                            <Input multiline placeholder="Objetivo" onChange={text => setSmallGroupTarget(text)} value={smallGroupTarget} />

                            <Text>Citas principales</Text>
                            <CartInput
                                askDeletion
                                placeholder="Citas"
                                value={smallGroupMainQuotes}
                                onChange={(quotes) => setSmallGroupMainQuotes(prev => quotes)}
                            />

                            <Text>Citas auxiliares</Text>
                            <CartInput
                                askDeletion
                                placeholder="Complementos"
                                value={smallGroupHelperQuotes}
                                onChange={(quotes) => setSmallGroupHelperQuotes(prev => quotes)}
                            />
                            <FetchSelect
                                placeholder="Seleccionar Maestro"
                                value={getFullName(smallGroupTeacher)}
                                list={teachers}
                                renderItem={({ item, closeModal }) => (
                                    <Button onPress={() => {
                                        setSmallGroupTeacher(item);
                                        closeModal();
                                    }}>
                                        {getFullName(item)}
                                    </Button>
                                )}
                                loadingList={loadingTeachers}
                            />
                            <FetchSelect
                                placeholder="Seleccionar Auxiliar"
                                value={getFullName(smallGroupHelper)}
                                list={helpers}
                                renderItem={({ item, closeModal }) => (
                                    <Button onPress={() => {
                                        setSmallGroupHelper(item);
                                        closeModal();
                                    }}>
                                        {getFullName(item)}
                                    </Button>
                                )}
                                loadingList={loadingHelpers}
                            />
                            <Button onPress={confirmUpdate}>Actualizar</Button>
                            <Button onPress={() => setUpdateChronogram(null)}>Cerrar</Button>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            <Modal
                visible={showDescription.length > 0}
                animationType="fade"
            >
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    {showDescription !== '' && <Text>{chronogramItemDetails[showDescription].scheduleDescription}</Text>}
                </ScrollView>
                <Button onPress={() => setShowDescription('')}>Cerrar</Button>
            </Modal>

            {/* Show ScheduleData Modal */}
            <Modal
                visible={!!chronogramItemDetails}
                transparent
                statusBarTranslucent
                animationType="fade"
            >
                <View style={{ flex: 1, backgroundColor: '#00000055', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'white', width: '80%', padding: 20, borderRadius: 10 }}>
                        {chronogramItemDetails && <>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Fecha: {formatDate(chronogramItemDetails.date)}</Text>

                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Niños grandes</Text>
                            <Text>Tema: {chronogramItemDetails.bigGroup.title}</Text>
                            <Text>Objetivo: {chronogramItemDetails.bigGroup.target}</Text>
                            <Text>Citas principales: {chronogramItemDetails.bigGroup.biblic_quotes.join(', ')}</Text>
                            <Text>Citas auxiliares: {chronogramItemDetails.bigGroup.complementary_biblic_quotes.join(', ')}</Text>
                            <Text>Docente: {chronogramItemDetails.bigGroup.teacher.gender == 'male' ? 'Hno.' : 'Hna.'} {chronogramItemDetails.bigGroup.teacher.name} {chronogramItemDetails.bigGroup.teacher.lastName}</Text>
                            <Text>Auxiliar: {chronogramItemDetails.bigGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} {chronogramItemDetails.bigGroup.helper.name} {chronogramItemDetails.bigGroup.helper.lastName}</Text>
                            {chronogramItemDetails.bigGroup.scheduleDescription && <Button onPress={() => setShowDescription('bigGroup')} size="small" style={{ width: 120, marginTop: 10 }}>Ver planificacion</Button> || <Text style={{ marginTop: 10, color: 'red'}}>No se ha cargado planificacion todavia</Text>}

                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Niños pequeños</Text>
                            <Text>Tema: {chronogramItemDetails.smallGroup.title}</Text>
                            <Text>Objetivo: {chronogramItemDetails.smallGroup.target}</Text>
                            <Text>Citas principales: {chronogramItemDetails.smallGroup.biblic_quotes.join(', ')}</Text>
                            <Text>Citas auxiliares: {chronogramItemDetails.smallGroup.complementary_biblic_quotes.join(', ')}</Text>
                            <Text>Docente: {chronogramItemDetails.smallGroup.teacher.gender == 'male' ? 'Hno.' : 'Hna.'} {chronogramItemDetails.smallGroup.teacher.name} {chronogramItemDetails.smallGroup.teacher.lastName}</Text>
                            <Text>Auxiliar: {chronogramItemDetails.smallGroup.helper.gender == 'male' ? 'Hno.' : 'Hna.'} {chronogramItemDetails.smallGroup.helper.name} {chronogramItemDetails.smallGroup.helper.lastName}</Text>
                            {chronogramItemDetails.smallGroup.scheduleDescription && <Button onPress={() => setShowDescription('smallGroup')} size="small" style={{ width: 120, marginTop: 10 }}>Ver planificacion</Button> || <Text style={{ marginTop: 10, color: 'red'}}>No se ha cargado planificacion todavia</Text>}

                            <Button onPress={copyToClipBoard} style={{ marginTop: 20, marginBottom: 5 }}>Copiar al Portapapeles</Button>
                            <Button onPress={() => setChronogramItemDetails(null)} >Cerrar</Button>
                        </>}
                    </View>
                </View>
            </Modal>



            {/* Page */}
            <View style={styles.container}>

                <Input placeholder="Buscar" />
                <Switch placeholder="Filtrar por inconvenientes" onChange={value => setIsFilterByDrawBack(value)} value={isfilterByDrawback} />

                {!loadingChronogram ? (
                    <FlatList
                        ListEmptyComponent={() => <Text style={{ textAlign: 'center' }} >No hay datos</Text>}
                        data={isfilterByDrawback ? filterByDrawback(chronogram) : chronogram}
                        renderItem={({ item }) => (
                            <Button
                                alignText="left"
                                onPress={() => setChronogramItemDetails(item)}
                                style={{ backgroundColor: colors.primary, marginVertical: 5, padding: 10, borderRadius: 5 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ flex: 1, color: 'white', textAlignVertical: 'center' }}>{formatDate(item.date)}</Text>
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        <Button
                                            onPress={() => {
                                                setUpdateChronogram(item);
                                                setBigGroupTitle(item.bigGroup.title);
                                                setBigGroupTarget(item.bigGroup.target);
                                                setBigGroupMainQuotes(item.bigGroup.biblic_quotes);
                                                setBigGroupHelperQuotes(item.bigGroup.complementary_biblic_quotes);
                                                setBigGroupTeacher(item.bigGroup.teacher);
                                                setBigGroupHelper(item.bigGroup.helper);

                                                setSmallGroupTitle(item.smallGroup.title);
                                                setSmallGroupTarget(item.smallGroup.target);
                                                setSmallGroupMainQuotes(item.smallGroup.biblic_quotes);
                                                setSmallGroupHelperQuotes(item.smallGroup.complementary_biblic_quotes);
                                                setSmallGroupTeacher(item.smallGroup.teacher);
                                                setSmallGroupHelper(item.smallGroup.helper);
                                            }}
                                            style={{ backgroundColor: colors.secondary, padding: 5, borderRadius: 5 }}
                                        >
                                            Editar
                                        </Button>
                                    </View>
                                </View>
                            </Button>
                        )}
                    />
                ) : (
                    <ActivityIndicator />
                )}
            </View>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        gap: 5
    },
    chronogram: {
        flexDirection: 'row',
    },
    itemDetailsModalBackground: {
        flex: 1,
        backgroundColor: '#00000055',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemDetailsModal: {
        backgroundColor: 'white',
        width: '60%',
        height: 'auto',
        gap: 5,
        padding: 5
    },
    chronogramItemOptions: {
        flexDirection: 'row',
        gap: 5
    }
});

export default Page;