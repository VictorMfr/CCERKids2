import { useFonts } from 'expo-font';
import { ActivityIndicator, Alert } from 'react-native';

const withLoadFonts = (Component: () => React.JSX.Element) => {
    const ComponentWithLoadedFonts = () => {
        const [loaded, error] = useFonts({
            'Roboto Light': require('./../assets/fonts/Roboto-Light.ttf')
        });

        if (!loaded && !error) {
            return null;
        }

        if (loaded && error) {
            return Alert.alert('Error al cargar las fuentes')
        }

        return <Component/>;
    }

    return ComponentWithLoadedFonts;
}

export default withLoadFonts;