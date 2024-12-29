import { StyleSheet, TextInput, TextStyle } from "react-native"

const Input = ({
    onChange,
    value,
    placeholder,
    passwordType,
    style,
    multiline
}: {
    onChange?: (text: string) => any,
    value?: string,
    placeholder?: string,
    passwordType?: boolean,
    style?: TextStyle,
    multiline?: boolean
}) => {
    return <TextInput
        style={[styles.input, style]}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        secureTextEntry={passwordType}
        multiline={multiline}
    />;
}

const styles = StyleSheet.create({
    input: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#ddd'
    }
});

export default Input;