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
        console.log("Remove Token");
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
        console.log("Get Token");
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