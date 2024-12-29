import useGetRolesByUser from "../fetchHooks/useGetRolesByUser";

const useUserDashboardController = () => {
    const { userRoles, loadingUserRoles } = useGetRolesByUser();
    

    const utils = {
        userRoles,
        loadingUserRoles
    }
}