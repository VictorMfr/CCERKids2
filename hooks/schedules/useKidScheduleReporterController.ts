import { Reducer, useReducer } from "react";
import useGetHelpers from "../fetchHooks/useGetHelpers";
import useGetTeachers from "../fetchHooks/useGetTeachers";
import { useLocalSearchParams } from "expo-router";
import { Alert, Clipboard } from "react-native";
import getStorageToken from "@/utils.ts/getStorageToken";
import api from "@/api/axios";
import defaultAuthHeader from "@/constants/defaultAuthHeader";
import GetStorageData from "@/utils.ts/getStorageData";

const kidScheduleReporterControllerReducerInitialState = {
    calculateModal: false as boolean,
    scheduleResult: [] as any[],
    loadingScheduleResult: true as boolean,
    chronogram: [] as any[],
    numberOfSchedules: '' as string,
    startDate: '' as string
}

const kidScheduleReporterControllerReducer: Reducer<typeof kidScheduleReporterControllerReducerInitialState, TActions> = (state, action) => {
    switch (action.name) {
        case "setCalculateModal":
            return { ...state, calculateModal: action.value };
        case "setScheduleResult":
            return { ...state, scheduleResult: action.value };
        case "setLoadingScheduleResult":
            return { ...state, loadingScheduleResult: action.value };
        case "setChronogram":
            return { ...state, chronogram: action.value };
        case "setNumberOfSchedules":
            return { ...state, numberOfSchedules: action.value };
        case "setStartDate":
            return { ...state, startDate: action.value };
        case "setReporterResults":
            return {
                ...state,
                scheduleResult: action.value.schedulesResult,
                chronogram: action.value.chronogramResult,
                loadingScheduleResult: false
            }
        case "closeModal":
            return {
                ...state,
                loadingScheduleResult: true,
                scheduleResult: [],
                calculateModal: false,
                startDate: '',
                numberOfSchedules: ''
            }
        default:
            return state;
    }
}

type TActions = (
    { name: 'setCalculateModal', value: boolean } |
    { name: 'setScheduleResult', value: any[] } |
    { name: 'setLoadingScheduleResult', value: boolean } |
    { name: 'setChronogram', value: any[] } |
    {
        name: 'setReporterResults', value: {
            schedulesResult: any[],
            chronogramResult: any[]
        }
    } |
    { name: 'closeModal' } |
    { name: 'setNumberOfSchedules', value: string } |
    { name: 'setStartDate', value: string }
)

const useKidScheduleReporterController = () => {
    const { teachers, loadingTeachers, setTeachers } = useGetTeachers();
    const { helpers, loadingHelpers, setHelpers } = useGetHelpers();
    const params: any = useLocalSearchParams();
    const kidSchedules: any[] = JSON.parse(params.schedules);

    const [state, dispatch] = useReducer(kidScheduleReporterControllerReducer, kidScheduleReporterControllerReducerInitialState);

    const formatData = () => {
        return state.scheduleResult.map(item => {
            return (
                `Fecha: ${item.date}

Niños grandes
Tema: ${item.bigGroup.title}
Objetivo: ${item.bigGroup.target}
Docente: ${item.bigGroup.teacher}
Auxiliar: ${item.bigGroup.helper}

Niños pequeños 

Tema: ${item.smallGroup.title}
Objetivo: ${item.smallGroup.target}
Docente: ${item.smallGroup.teacher}
Auxiliar: ${item.smallGroup.helper} `);
        }).join('\n\n');
    };

    const copyToClipBoard = () => {
        const textToCopy = formatData();
        Clipboard.setString(textToCopy);
    };

    const scheduleGetUserName = (user: any) => {
        if (user.gender == 'male') {
            return `Hno. ${user.name} ${user.lastName}`;
        } else {
            return `Hna. ${user.name} ${user.lastName}`;
        }
    };

    const shiftArray = (arr: any[], positions: number) => {
        const length = arr.length;
        const shift = positions % length;
        return [...arr.slice(-shift), ...arr.slice(0, -shift)];
    };

    const createSchedule = (startDate: string, numberOfSchedules: number) => {

        const [dia, mes, año] = startDate.split('/').map(Number);

        let schedulesResult: any = [];
        let chronogramResult: any = [];
        let schedulesIndex = 0;
        let date = new Date(año, mes - 1, dia);

        if (teachers.length == 0 || helpers.length == 0) {
            return Alert.alert('Error', 'debe haber por lo menos 1 maestro y 1 auxiliar', [
                {
                    text: "Aceptar",
                    onPress() {
                        dispatch({ name: 'setCalculateModal', value: false });
                    }
                }
            ]);
        }

        dispatch({ name: 'setCalculateModal', value: true });
        let randomTeachers = teachers.sort(() => Math.random() - 0.5);
        let randomHelpers = helpers.sort(() => Math.random() - 0.5);
        let randomSchedules = kidSchedules.sort(() => Math.random() - 0.5);
        const ramdomSchedulesCapture = [...randomSchedules];
        const randomTeachersCapture = [...randomTeachers];
        const randomHelpersCapture = [...randomHelpers];


        for (let i = 0; i < numberOfSchedules; i++) {

            randomTeachers = randomTeachers.sort(() => Math.random() - 0.5);
            randomHelpers = randomHelpers.sort(() => Math.random() - 0.5);
            randomSchedules = randomSchedules.sort(() => Math.random() - 0.5);

            let currentDate = new Date(date);

            if (randomSchedules.length == 1) {
                randomSchedules = [randomSchedules[0], ...ramdomSchedulesCapture.filter(e => e._id != randomSchedules[0]._id)];
            } else if (randomSchedules.length == 0) {
                randomSchedules = ramdomSchedulesCapture;
            };

            if (randomTeachers.length == 1) {
                randomTeachers = [randomTeachers[0], ...shiftArray(randomTeachersCapture.filter(e => e._id != randomTeachers[0]._id), Math.floor(Math.random() + 1))];
            } else if (randomTeachers.length == 0) {
                randomTeachers = shiftArray(randomTeachersCapture, Math.floor(Math.random() + 1));
            }

            if (randomHelpers.length == 1) {
                randomHelpers = [randomHelpers[0], ...shiftArray(randomHelpersCapture.filter(e => e._id != randomHelpers[0]._id), Math.floor(Math.random() + 1))];
            } else if (randomHelpers.length == 0) {
                randomHelpers = shiftArray(randomHelpersCapture, Math.floor(Math.random() + 1));
            }

            if (randomSchedules.length == 1) {
                randomSchedules = [randomSchedules[0], ...shiftArray(ramdomSchedulesCapture.filter(e => e._id != randomSchedules[0]._id), Math.floor(Math.random() + 1))];
            } else if (randomSchedules.length == 0) {
                randomSchedules = shiftArray(ramdomSchedulesCapture, Math.floor(Math.random() + 1));
            }

            const bigGroupSchedule = randomSchedules[0];

            const smallGroupSchedule = randomSchedules.filter(schedule => schedule._id != bigGroupSchedule._id)[0];
            const bigGroupTeacher = randomTeachers[0];

            const bigGroupHelper = randomHelpers.filter(helper => helper._id != bigGroupTeacher._id)[0];
            const smallGroupTeacher = randomTeachers.filter(teacher => teacher._id != bigGroupTeacher._id && teacher._id != bigGroupHelper._id)[0];
            const smallGroupHelper = randomHelpers.filter(helper => helper._id != bigGroupTeacher._id && helper._id != bigGroupHelper._id && helper._id != smallGroupTeacher._id)[0];

            randomTeachers = randomTeachers.filter(teacher => teacher._id != bigGroupTeacher._id && teacher._id != smallGroupTeacher._id && teacher._id != bigGroupHelper._id && teacher._id != smallGroupHelper._id);

            randomHelpers = randomHelpers.filter(helper => helper._id != bigGroupHelper._id && helper._id != smallGroupHelper._id && helper._id != bigGroupTeacher._id && helper._id != smallGroupTeacher._id);

            randomSchedules = randomSchedules.filter(schedule => schedule._id != bigGroupSchedule._id && schedule._id != smallGroupSchedule._id);

            schedulesResult.push({
                date: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
                bigGroup: {
                    title: bigGroupSchedule.title,
                    target: bigGroupSchedule.target,
                    mainQuotes: bigGroupSchedule.biblic_quotes,
                    helperQuotes: bigGroupSchedule.complementary_biblic_quotes,
                    teacher: scheduleGetUserName(bigGroupTeacher),
                    helper: scheduleGetUserName(bigGroupHelper),
                },
                smallGroup: {
                    title: smallGroupSchedule.title,
                    target: smallGroupSchedule.target,
                    mainQuotes: smallGroupSchedule.biblic_quotes,
                    helperQuotes: smallGroupSchedule.complementary_biblic_quotes,
                    teacher: scheduleGetUserName(smallGroupTeacher),
                    helper: scheduleGetUserName(smallGroupHelper)
                }
            });

            chronogramResult.push({
                date: currentDate,
                bigGroup: {
                    title: bigGroupSchedule.title,
                    target: bigGroupSchedule.target,
                    biblic_quotes: bigGroupSchedule.biblic_quotes,
                    complementary_biblic_quotes: bigGroupSchedule.complementary_biblic_quotes,
                    teacher: bigGroupTeacher._id,
                    helper: bigGroupHelper._id
                },
                smallGroup: {
                    title: smallGroupSchedule.title,
                    target: smallGroupSchedule.target,
                    biblic_quotes: smallGroupSchedule.biblic_quotes,
                    complementary_biblic_quotes: smallGroupSchedule.complementary_biblic_quotes,
                    teacher: smallGroupTeacher._id,
                    helper: smallGroupHelper._id
                }
            });

            date.setDate(date.getDate() + 7);
            schedulesIndex++;
        }

        dispatch({
            name: 'setReporterResults', value: {
                chronogramResult,
                schedulesResult
            }
        });
    }

    const notifyTo = async (user: any, name: string, system: boolean, message: string) => {

        const token = await getStorageToken();
        const notificationResponse = await api.post(`/notification/sendByRole?roleName=${name}${system ? '&isSystem=true' : ''}`, {
            to: user._id,
            message
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })

        if (notificationResponse.status != 200) {
            throw new Error(`${notificationResponse.status.toString()} ${name}`);
        }

        return notificationResponse;
    }

    const createChronogram = async () => {
        try {
            const { user, token } = await GetStorageData();

            const addChronogramResponse = await api.post('/kidChronogram/addChronogram', { data: state.chronogram }, defaultAuthHeader(token));

            if (addChronogramResponse.status != 200) {
                throw new Error(addChronogramResponse.status.toString());
            }


            await notifyTo(user, 'Coordinador', true, 'Se ha creado un cronograma de actividades de niños')
            await notifyTo(user, 'Auxiliar', false, 'Atencion Auxiliares, Se ha creado un cronograma de actividades de niños, verifique los datos');
            await notifyTo(user, 'Maestro', false, 'Atencion Maestros, Se ha creado un cronograma de actividades de niños, verifique los datos');

            Alert.alert("Exito");

            dispatch({ name: 'closeModal' });

        } catch (error) {
            Alert.alert("error", (error as Error).message)
            console.log(error)
        }
    }

    const confirmCreation = () => {

        const confirm = () => {
            if (teachers.length < 2 || helpers.length < 2) {
                Alert.alert('Error', 'No hay suficientes docentes o auxiliares para crear un cronograma, por favor verifique que haya al menos 2 docentes y 2 auxiliares en el sistema');
                return;
            }

            createChronogram();
        }

        Alert.alert('Atencion', 'Se notificaran a todos los implicados en este cronograma sus fechas y temas, esta seguro de continuar?', [
            { text: 'Aceptar', onPress: confirm },
            { text: 'Cancelar'}
        ])
    }


    const utils = {
        setTeachers,
        setHelpers,
        confirmCreation,
        copyToClipBoard,
        createSchedule,
        teachers,
        loadingTeachers,
        helpers,
        loadingHelpers,
        params,
        kidSchedules
    }

    return { state, dispatch, utils };
}

export default useKidScheduleReporterController;