import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import getStorageToken from "@/utils.ts/getStorageToken";
import getStorageUser from "@/utils.ts/getStorageUser";
import { Alert } from "react-native";

const notifyDrawback = async (reason: string, chronogram: any, setChronogram: any) => {

    Alert.alert('atencion', 'seguro?', [
        {
            text: "Aceptar",
            onPress: () => {
                process();
            }
        },
        {
            text: 'Cancelar'
        }
    ])

    const process = async () => {
        try {

            const user = await getStorageUser();
            const token = await getStorageToken();

            const genderString = (user.gender == 'male') ? 'El Hno.' : 'La Hna.'

            const bigGroupUpdate = {
                role: 'teacher',
                target: 'bigGroup',
                value: true
            }

            const smallGroupUpdate = {
                role: 'teacher',
                target: 'smallGroup',
                value: true
            }



            const chronogramResponse = await api.patch(`/kidChronograms/${chronogram._id}/setDrawback`, chronogram.bigGroup.teacher._id == user._id? bigGroupUpdate: smallGroupUpdate, defaultAuthHeader(token));

            if (chronogramResponse.status != 200) {
                throw new Error('Error al actualizar cronograma')
            }

            const notificationResponse = await api.post('/notification/sendByRole?roleName=Coordinador', {
                message: `${genderString} ${user.name} ${user.lastName}, notifica que no podra cumplir su cronograma debido a la siguiente razon: ${reason}`
            }, defaultAuthHeader(token));

            if (notificationResponse.status != 200) {
                throw new Error('Error al notificar a los coordinadores');
            }

            Alert.alert('Exito', 'se ha notificado con exito');
            setChronogram((prev: any) => prev.filter((item: any) => item._id != chronogram._id));
        } catch (error) {
            Alert.alert('error al notificar');
            console.log(error)
        }
    }
}

export default notifyDrawback;