import { DefaultTheme, Theme } from "@react-navigation/native";

export const LightTheme:Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme,
        primary: "#000",
        background: "#fff",
        card: "#fff",
        text: "#000",
        border: "#000",
        notification: "#000"
    }
}