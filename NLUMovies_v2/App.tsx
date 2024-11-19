import React from 'react';
import './global.css';
import { verifyInstallation } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from './react_native/screens/navigation/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ViewVideo from './react_native/screens/watch-video';
import { FilmIcon, HomeModernIcon, PhotoIcon, UserIcon } from 'react-native-heroicons/outline';
import { Text } from 'react-native';
import UserProfileScreen from './react_native/screens/profile/UserProfileScreen';

function Home () {
  const Tab = createBottomTabNavigator();
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
      <Tab.Screen name="Watch Video" 
      options={{
        tabBarIcon: ({ color, size }) => <FilmIcon size={size} color={color} />,
        tabBarActiveTintColor: '#28b463',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontWeight: 800,
        }
      }}
      component={ViewVideo} />
      <Tab.Screen name="S3 Native Module" 
      options={{
        tabBarIcon: ({ color, size }) => <PhotoIcon size={size} color={color} />,
        tabBarActiveTintColor: '#28b463',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontWeight: 800,
        }
      }}
      component={UserProfileScreen} />
    </Tab.Navigator>
  </NavigationContainer>
  )
}

export default function App() : React.JSX.Element {
  verifyInstallation();
  return (
    <Home/>
  )
}
