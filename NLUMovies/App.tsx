import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation";

export default function App() {
  // 1. Start Application
  // 1.1. Load Navigation
  // 2. Navigate to Home Screen
  return <Navigation />;
}
