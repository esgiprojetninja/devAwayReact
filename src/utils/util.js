import { AsyncStorage } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';

export default {
    setToken: async token => {
        try {
            await AsyncStorage.setItem("@Storage:token", token);
            return {
                status: "ok"
            };
        } catch (error) {
            return {
                status: "error",
                error
            };
        }
    },
    removeToken: async () => {
        try {
            await AsyncStorage.removeItem("@Storage:token");
            return {
                status: "ok"
            };
        } catch (error) {
            return {
                status: "error",
                error
            };
        }
    },
    getToken: async () => {
        try {
            const token = await AsyncStorage.getItem("@Storage:token");
            return {
                status: "ok",
                token
            };
        } catch (error) {
            return {
                status: "error",
                error
            };
        }
    }
}