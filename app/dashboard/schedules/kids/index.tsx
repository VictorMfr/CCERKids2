import Button from "@/components/ui/Button";
import CartInput from "@/components/ui/CartInput";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import colors from "@/constants/colors";
import useKidScheduleController from "@/hooks/schedules/useKidScheduleController";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";

const Page = () => {

    const { state, dispatch, utils } = useKidScheduleController();

    return (
        <>
            <Modal visible={!!state.scheduleItemDetails} transparent statusBarTranslucent animationType="fade">
                <View style={{ flex: 1, backgroundColor: '#00000055', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'white', width: '80%', height: 'auto', gap: 5, padding: 10, borderRadius: 10 }}>
                        {state.scheduleItemDetails && <>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, textOverflow: 'ellipsis' }}>Tema: {state.scheduleItemDetails.title}</Text>
                            <Text style={{ marginBottom: 5 }}>Objetivo: {state.scheduleItemDetails.target}</Text>
                            <Text style={{ marginBottom: 5 }}>Versículo Principal: {state.scheduleItemDetails.biblic_quotes.join(', ')}</Text>
                            <Text style={{ marginBottom: 5 }}>Versículos Auxiliares: {state.scheduleItemDetails.complementary_biblic_quotes.join(', ')}</Text>
                            <Button onPress={() => dispatch({ name: 'setScheduleItemsDetails', value: null })} style={{ marginTop: 10 }}>Cerrar</Button>
                        </>}
                    </View>
                </View>
            </Modal>

            <Modal visible={state.isKidAddSchedule || !!state.updateScheduleId} animationType="fade">
                <View style={{ flex: 1 }}>
                    <View style={{ backgroundColor: 'white', gap: 5, padding: 5 }}>
                        <Input onChange={text => dispatch({ name: "setModalTitle", value: text })} value={state.modalTitle} placeholder="Tema" />
                        <Input onChange={text => dispatch({ name: "setModalTarget", value: text })} value={state.modalTarget} placeholder="Objetivo" />
                        <CartInput onChange={(quotes) => dispatch({ name: "setModalMainQuotes", value: quotes })} value={state.modalMainQuotes} placeholder="Versos Principales" />
                        <CartInput onChange={(quotes) => dispatch({ name: "setModalHelperQuotes", value: quotes })} value={state.modalHelperQuotes} placeholder="Versos Auxiliares" />
                        <Button onPress={() => state.updateScheduleId ? utils.update() : utils.save()} style={{ marginTop: 10 }}>{state.updateScheduleId ? "Actualizar" : "Guardar"}</Button>
                        <Button onPress={() => dispatch({ name: "clearModal" })} style={{ marginTop: 10 }}>Cancelar</Button>
                    </View>
                </View>
            </Modal>

            {/* Page */}
            <View style={{ flex: 1, padding: 5 }}>
                <Input style={{ marginBottom: 5 }} placeholder="Buscar" />
                {!utils.loadingKidSchedules && <FlatList
                    contentContainerStyle={{ gap: 5 }}
                    ListEmptyComponent={() => (
                        <View style={{ flex: 1, height: 600, justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="gauge-empty" size={100} color={colors.primary} />
                            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: "700", color: colors.primary }}>No hay datos</Text>
                        </View>
                    )}
                    data={utils.kidSchedules}
                    renderItem={({ item }) => (
                        <Button alignText="left" onPress={() => dispatch({ name: 'setScheduleItemsDetails', value: item })} style={{ backgroundColor: colors.primary }}>
                            <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'space-between' }}>
                                <Text numberOfLines={2} style={{ flex: 1, color: 'white', textAlignVertical: 'center' }}>{item.title}</Text>
                                <View style={{ flexDirection: 'row', gap: 5 }}>
                                    <Button style={{ backgroundColor: '#C33636' }} onPress={() => utils.deleteSchedule(item)}>Eliminar</Button>
                                    <Button onPress={() => dispatch({ name: 'setModalData', value: item })}>Editar</Button>
                                </View>
                            </View>
                        </Button>
                    )}
                /> || <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />}

                <Button size="medium" onPress={() => dispatch({ name: 'setIsKidAddSchedule', value: true })} style={{ width: 60, height: 60, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 20, right: 20, borderRadius: 20 }}>
                    <FontAwesome name="file" size={25} color={'white'} />
                </Button>

                <Button size="medium" onPress={() => router.push({ pathname: './reporter', params: { schedules: JSON.stringify(utils.kidSchedules) } }, { relativeToDirectory: true })} style={{ width: 45, height: 45, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 90, right: 20, borderRadius: 15 }}>
                    <FontAwesome name="calculator" size={20} color={'white'} />
                </Button>

                <Button size="medium" onPress={() => router.push({ pathname: './chronogram', params: { schedules: JSON.stringify(utils.kidSchedules) } }, { relativeToDirectory: true })} style={{ width: 40, height: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 145, right: 20, borderRadius: 15 }}>
                    <FontAwesome name="calendar-plus-o" color={'white'} size={15} />
                </Button>
            </View>
        </>
    );
}

export default Page;
