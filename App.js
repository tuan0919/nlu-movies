import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import { HomeScreen } from "./screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation";

export default function App() {
  return <Navigation />;
}
