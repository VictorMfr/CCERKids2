import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import Button from "./Button";
import Text from "./Text";
import React, { useState } from "react";

const FetchSelect = ({ loadingList, value, placeholder, list, renderItem }: { value: string, placeholder: string, list: any[], loadingList: boolean, renderItem: ({ item, closeModal }: { item: any, closeModal: () => any }) => React.JSX.Element }) => {

    const [modal, setModal] = useState(false);

    return (
        <>
            <Modal
                visible={modal}
                animationType="fade"
            >
                <View style={{ flex: 1 }}>
                    {(!loadingList && list.length > 0 && list.map(element => (
                        <View
                            key={element._id}>
                            {renderItem({ item: element, closeModal: () => setModal(false) })}
                        </View>
                    )) || <ActivityIndicator />)}
                </View>
                <Button onPress={() => setModal(false)}>Cancelar</Button>
            </Modal>
            <View style={styles.container}>
                <Button onPress={() => setModal(true)} style={{ flex: 0.3 }}>{placeholder}</Button>
                <Text style={{ flex: 0.7, textAlign: 'center', textAlignVertical: 'center', borderWidth: 1, borderColor: '#ddd' }}>{value? value: placeholder}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    }
})

export default FetchSelect;
