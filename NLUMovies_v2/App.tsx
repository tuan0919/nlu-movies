import React from 'react';
import './global.css';
import { verifyInstallation } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './react_native/screens/navigation/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ViewVideo from './react_native/screens/watch-video';
import { FilmIcon, HomeModernIcon } from 'react-native-heroicons/outline';
export default function App() : React.JSX.Element {
  const Tab = createBottomTabNavigator();
  verifyInstallation();
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: '#0a0a0a',
        tabBarInactiveBackgroundColor: '#0a0a0a'
      }}>
        <Tab.Screen name="Home" options={
          {
            tabBarIcon: ({ color, size }) => <HomeModernIcon size={size} color={color} />,
            tabBarActiveTintColor: '#28b463',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: {
              fontWeight: 800,
            }
          }
        } component={HomeStack} />
        <Tab.Screen name="My Video" 
        options={{
          tabBarIcon: ({ color, size }) => <FilmIcon size={size} color={color} />,
          tabBarActiveTintColor: '#28b463',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontWeight: 800,
          }
        }}
        component={ViewVideo} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
