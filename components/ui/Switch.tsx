import colors from "@/constants/colors";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native"
import Text from "./Text";
import React from "react";

const Switch = ({ value, onChange, placeholder }: { placeholder?: string, value: boolean, onChange: (values: boolean) => any }) => {

    const [active, setActive] = useState<boolean>(value);

    const change = () => {
        setActive(prev => {
            onChange(!prev);
            return !prev
        });
        
    }

    return (
        <View style={{ flexDirection: 'row' }}>
            {placeholder && <Text style={{ flex: 0.5, fontSize: 10, textAlignVertical: 'center' }}>{placeholder}</Text>}
            <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                <Pressable onPress={change} style={[styles.switch, { alignItems: active ? 'flex-end' : 'flex-start' }]}>
                    <View style={[styles.switchButton, { backgroundColor: active ? colors.secondary : '#bbb' }]} />
                </Pressable>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    switch: {
        width: 40,
        height: 25,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center'
    },
    switchButton: {
        width: 20,
        height: 20,
        backgroundColor: '#bbb',
        borderRadius: 25,
        marginHorizontal: 2,
        elevation: 1
    }
})

export default Switch;