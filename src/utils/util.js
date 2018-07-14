import { AsyncStorage } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';

export default {
    setToken: async token => {
        try {
            console.log("Success set Token");
            await AsyncStorage.setItem("@Storage:token", token);
            return {
                status: "ok"
            };
        } catch (error) {
            console.log("Error get token");
            return {
                status: "error",
                error
            };
        }
    },
    removeToken: async () => {
        try {
            console.log("Success remove Token");
            await AsyncStorage.removeItem("@Storage:token");
            return {
                status: "ok"
            };
        } catch (error) {
            console.log("Error remove Token");
            return {
                status: "error",
                error
            };
        }
    },
    getToken: async () => {
        try {
            console.log("Success token");
            const token = await AsyncStorage.getItem("@Storage:token");
            return {
                status: "ok",
                token
            };
        } catch (error) {
            console.log("Error token");
            return {
                status: "error",
                error
            };
        }
    }
}