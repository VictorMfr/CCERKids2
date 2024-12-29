import React, { Dispatch, SetStateAction, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

const withLoading = (Component: ({ setLoading }: {setLoading: Dispatch<React.SetStateAction<boolean>>}) => React.JSX.Element) => {
    const ComponentWithLoading = () => {
        const [loading, setLoading] = useState(false);

        return (
            <>
                <Modal
                    visible={loading}
                    transparent
                    statusBarTranslucent
                >
                    <View style={styles.modal}>
                        <ActivityIndicator/>
                    </View>
                </Modal>
                <Component setLoading={setLoading} />
            </>
        );
    }

    return ComponentWithLoading;
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#00000055',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default withLoading;