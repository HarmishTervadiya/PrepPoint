import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          animation: "shift",
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          animation: "shift",
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="addQuestion"
        options={{
          title: "Add Question",
          headerShown: false,
          animation: "shift",
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="userDashboard"
        options={{
          title: "Dashboard",
          headerShown: false,
          animation: "shift",
          tabBarShowLabel: false,
        }}
      />

      <Tabs.Screen
        name="userProfile"
        options={{
          title: "Profile",
          headerShown: false,
          animation: "shift",
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;
