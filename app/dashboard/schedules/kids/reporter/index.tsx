import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Text from "@/components/ui/Text";
import useKidScheduleReporterController from "@/hooks/schedules/useKidScheduleReporterController";
import React from "react";
import { ActivityIndicator, FlatList, Modal, View } from "react-native";

const Page = () => {
    const { state, dispatch, utils } = useKidScheduleReporterController();

    return (
        <>
            <Modal visible={state.calculateModal} animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    {!state.loadingScheduleResult ? (
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={state.scheduleResult}
                                renderItem={({ item }: { item: any }) => (
                                    <View style={{ alignSelf: 'center', width: '80%', marginBottom: 20, marginVertical: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Fecha: {item.date}</Text>
                                        <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>Niños grandes</Text>
                                        <Text>Tema: {item.bigGroup.title}</Text>
                                        <Text>Objetivo: {item.bigGroup.target}</Text>
                                        <Text>Citas principales: {item.bigGroup.mainQuotes.map((quote: any, index: any) => (index + 1 === item.bigGroup.mainQuotes.length) ? `${quote}` : `${quote}, `)}</Text>
                                        <Text>Citas auxiliares: {item.bigGroup.helperQuotes.map((quote: any, index: any) => (index + 1 === item.bigGroup.helperQuotes.length) ? `${quote}` : `${quote}, `)}</Text>
                                        <Text>Docente: {item.bigGroup.teacher}</Text>
                                        <Text>Auxiliar: {item.bigGroup.helper}</Text>
                                        <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 16 }}>Niños pequeños</Text>
                                        <Text>Tema: {item.smallGroup.title}</Text>
                                        <Text>Objetivo: {item.smallGroup.target}</Text>
                                        <Text>Citas principales: {item.smallGroup.mainQuotes.map((quote: any, index: any) => (index + 1 === item.smallGroup.mainQuotes.length) ? `${quote}` : `${quote}, `)}</Text>
                                        <Text>Citas auxiliares: {item.smallGroup.helperQuotes.map((quote: any, index: any) => (index + 1 === item.smallGroup.helperQuotes.length) ? `${quote}` : `${quote}, `)}</Text>
                                        <Text>Docente: {item.smallGroup.teacher}</Text>
                                        <Text>Auxiliar: {item.smallGroup.helper}</Text>
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator />
                            <Text>Creando Planificaciones...</Text>
                        </View>
                    )}
                    <View>
                        <Button onPress={utils.confirmCreation}>Guardar, Cerrar y Notificar a Todos</Button>
                        <Button onPress={utils.copyToClipBoard}>No Guardar y Copiar al Portapapeles</Button>
                        <Button onPress={() => dispatch({ name: 'closeModal' })}>Cerrar</Button>
                    </View>
                </View>
            </Modal>

            <View style={{ padding: 20, backgroundColor: '#f0f0f0', borderRadius: 10, margin: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 }}>
                {!utils.loadingTeachers ? <Text style={{ fontSize: 16, marginBottom: 10 }}>Numero de Maestros: {utils.teachers.length.toString()}</Text> : <ActivityIndicator style={{ marginBottom: 10 }} />}
                {!utils.loadingHelpers ? <Text style={{ fontSize: 16, marginBottom: 10 }}>Numero de Auxiliares: {utils.helpers.length.toString()}</Text> : <ActivityIndicator style={{ marginBottom: 10 }} />}
                <Text style={{ fontSize: 16, marginBottom: 10 }}>Numero de Planificaciones: {utils.kidSchedules.length.toString()}</Text>
                <Input placeholder="Numero de planificaciones" onChange={text => dispatch({ name: 'setNumberOfSchedules', value: text })} value={state.numberOfSchedules} style={{ marginBottom: 10 }} />
                <Input placeholder="Fecha inicio DD/MM/AAAA" onChange={text => dispatch({ name: 'setStartDate', value: text })} value={state.startDate} style={{ marginBottom: 20 }} />
                <Button onPress={() => utils.createSchedule(state.startDate, parseInt(state.numberOfSchedules))}>Calcular</Button>
            </View>
        </>
    );
}

export default Page;
