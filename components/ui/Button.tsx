import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Text from "./Text";
import colors from "@/constants/colors";
import { useState } from "react";

function isString(children: any): children is string[] {
    return (children as string[]).length !== undefined;
}

const sizes = {
    'small': [8, 5],
    'medium': [13, 10],
    'large': [23, 20]
}

const Button = ({
    children,
    onPress,
    style,
    size,
    alignText,
    nullDefaultStyle
}: {
    style?: ViewStyle | ViewStyle[],
    children?: any,
    onPress?: () => any,
    size?: "small" | "medium" | "large",
    alignText?: "left" | "auto" | "center" | "right" | "justify" | undefined,
    nullDefaultStyle?: boolean
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
        if (isPressed) return;
        setIsPressed(true);
        onPress?.();
        setTimeout(() => setIsPressed(false), 1000); // Adjust the timeout duration as needed
    };

    const styles = StyleSheet.create({
        defaultStyle: {
            paddingHorizontal: (size) ? sizes[size][0] : sizes["small"][0],
            paddingVertical: (size) ? sizes[size][1] : sizes["small"][1],
            backgroundColor: colors.secondary,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    return (
        <Pressable
            android_ripple={{ color: '#ddd' }}
            style={nullDefaultStyle ? style : [styles.defaultStyle, style]}
            onPress={handlePress}
        >
            {isString(children) && (
                <Text style={{ color: 'white', textAlign: alignText ? alignText : 'center' }}>
                    {children ?? ''}
                </Text>
            ) || children}
        </Pressable>
    )
}

export default Button;