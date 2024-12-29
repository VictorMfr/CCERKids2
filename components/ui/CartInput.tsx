import { Alert, StyleSheet, View } from "react-native";
import Input from "./Input";
import Button from "./Button";
import { useState } from "react";
import Text from "./Text";
import colors from "@/constants/colors";
import React from "react";

interface CartInputProps {
    placeholder?: string;
    onChange: (quotes: string[]) => any;
    value: string[];
    askDeletion?: boolean
}

const CartInput: React.FC<CartInputProps> = ({ placeholder, onChange, value, askDeletion }) => {

    const [cartInput, setCartInput] = useState<string>('');

    const addToCart = () => {
        onChange([...value, cartInput]);
        setCartInput('');
    }

    const popItem = (item: string) => {

        if (askDeletion) {
            Alert.alert('Atencion', 'seguro que quieres remover?', [
                {
                    text: "Aceptar",
                    onPress() {
                        onChange(value.filter(element => element != item));
                    }
                },
                {
                    text: "Cancelar"
                }
            ])
        } else {
            onChange(value.filter(element => element != item));
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Input
                    style={styles.addInput}
                    placeholder={placeholder}
                    onChange={text => setCartInput(text)}
                    value={cartInput}
                />
                <Button onPress={addToCart} style={styles.addButton}>Añadir</Button>
            </View>
            {value.length > 0 && value.map((item, index) => (
                <Button
                    key={index}
                    onPress={() => popItem(item)}
                    style={[styles.cartItem, {
                        backgroundColor: `${index % 2 === 0 ? colors.secondary + 'ee' : colors.primary}`
                    }]}>
                    <Text style={styles.itemText}>{item}</Text>
                </Button>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    addButton: {
        flex: 0.3,
    },
    addInput: {
        flex: 0.7
    },
    cartItem: {
        width: "68%",
        padding: 5,
        marginBottom: 3
    },
    itemText: {
        color: 'white',
        fontSize: 10
    }
})

export default CartInput;
