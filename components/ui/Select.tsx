import { createContext, ReactNode, useContext } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Text from "./Text";
import colors from "@/constants/colors";
import React from "react";

const SelectContext = createContext<{
    value: string,
    onChange: (text: string) => any
}>({
    value: '',
    onChange: (text: string) => {}
});

const Select = ({
    children,
    placeholder,
    style,
    onChange,
    value
}: {
    style?: ViewStyle,
    placeholder?: string,
    children?: ReactNode,
    onChange: (text: string) => any,
    value: string
}) => {
    

    return (
        <>
            <Text>{placeholder}</Text>
            <View style={[styles.select, style]}>
                <SelectContext.Provider value={{value, onChange}}>
                    {children}
                </SelectContext.Provider>
            </View>
        </>

    )
}

Select.Option = ({ value, placeholder }: { placeholder?: string, value: string }) => {

    const { value: selectVal, onChange } = useContext(SelectContext);

    const style = StyleSheet.create({
        radioButtonBorder: {
            width: 20,
            height: 20,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        radioButton: {
            width: 18,
            height: 18,
            borderRadius: 18,
            backgroundColor: (selectVal == value)? colors.secondary: undefined
        }
    });


    return (
        <View style={styles.option}>
            <View style={style.radioButtonBorder}>
                <Pressable onPress={() => onChange(value)} style={style.radioButton}>

                </Pressable>
            </View>
            <Text>{placeholder}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    select: {
        gap: 5,
        marginBottom: 10
    },
    option: {
        flexDirection: 'row',
        gap: 5
    }
})



export default Select;