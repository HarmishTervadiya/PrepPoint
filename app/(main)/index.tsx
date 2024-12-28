import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useSegments } from "expo-router";

const Index = () => {
  
  const router = useRouter();
  const segments = useSegments(); // Monitor current route segments
  const [user, setUser] = useState(); // Simulate user state
  const [isReady, setIsReady] = useState(false); // Track readiness of layout/router

  useEffect(() => {
    // Simulate a delay to ensure layout/rendering is complete (optional)
    const timeout = setTimeout(() => setIsReady(true), 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isReady && !user && segments[0] !== "auth") {
      router.replace("/auth/userLogin");
    }
  }, [isReady, user, segments]);

  // Return a loading indicator if root layout is not ready
  if (!isReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>Welcome to the Home Page</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({});
