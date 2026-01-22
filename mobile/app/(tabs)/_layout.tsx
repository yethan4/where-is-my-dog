import React, { useState } from 'react'
import { Tabs } from "expo-router"
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from "@/contexts/AuthContext"

const TabsLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Tabs>
        <Tabs.Screen
          name="index"
          options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons 
                  name={focused ? 'home' : 'home-outline'} 
                  size={size} 
                  color={color} 
                />
              )
          }}
        />
        <Tabs.Screen 
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            href: isAuthenticated ? undefined : null,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'add-circle' : 'add-circle-outline'} 
                size={size} 
                color={color} 
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={size} 
                color={color} 
              />
            )
          }}
        />
    </Tabs>
  )
}

export default TabsLayout