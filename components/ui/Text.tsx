import { StyleSheet, TextStyle, Text as Txt } from "react-native";

const Text = ({ 
    children, style, numberOfLines
}: { 
    children?: string[] | string, 
    style?: TextStyle,
    numberOfLines?: number
}) => {
    return (
        <Txt style={[styles.defaultStyle, style]} numberOfLines={numberOfLines?? undefined}>
            {children}
        </Txt>
    );
}

const styles = StyleSheet.create({
    defaultStyle: {
        fontFamily: 'Roboto Light'
    }
})

export default Text;