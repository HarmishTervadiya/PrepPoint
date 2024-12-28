import { Theme } from "@react-navigation/native";

export interface CustomTheme extends Theme {
    customColors : {
        primary: string;
        secondary: string;
        tertiary: string;
        text: string;
        secondaryText: string;
        primaryText: string;
        background: string;
        button: string;
        btnText: string;
        title: string;
        sectionLabel: string;
        sectionMiniLabel: string;
        card: string;
        cardHeader: string;
        cardHeaderText: string;
        secondaryCard: string;
        secondaryBtn: string;
        secondaryBtnText: string;
        border: string;
        secondaryBorder: string;
        lineBreak: string;
        error: string;
        shadow: string;
        secondaryShadow: string
        backBtn: string;
        inputContainer: string;
    }
    
}
