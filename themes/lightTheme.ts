import { CustomTheme } from "@/types/customTheme";
import { DefaultTheme } from "@react-navigation/native";


export const LightTheme:CustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme,
        primary: "#8572FF",
        background: "#fff",
        card: "#fff",
        text: "#000",
        border: "#000",
        notification: "#000",
    },
    customColors: {
        primary: "#8572FF",
        secondaryText: "#9C9C9C",
        text: "#000",
        primaryText: "#8572FF",
        background: "#fff",
        button: "#8572FF",
        btnText: "#fff",
        title: "#000",
        sectionLabel: "#000",
        sectionMiniLabel: "#7469B6",
        card: "#F9F9F9",
        cardHeader: "#F2F0F0",
        cardHeaderText: "#6B6868",
        secondaryCard: "#D7D7D7",
        secondaryBtn: "#FFF",
        secondaryBtnText: "#8572FF",
        border: "#ADADAD",
        secondaryBorder: "#D3D3D3",
        lineBreak: "#D3D3D3",
        error: "#FF0000",
        shadow: "#D3D3D3",
        secondaryShadow: "#8572FF",
        backBtn: "#E8E8E8",
        secondary: "#7469B6",
        tertiary: "#E1AFD1",
        inputContainer: "#D3D3D3"
    }
}