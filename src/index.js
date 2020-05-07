import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, useAuthenticate } from './context/Auth';

/* pages */
import * as Pages from './pages';

const Stack = createStackNavigator();

const Root = () => {
  const { initializing, user } = useAuthenticate();

  if (initializing) {
    return null;
  }

  console.log(user);

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Home" component={Pages.Home} />
      ) : (
        <Stack.Screen name="Login" component={Pages.Login} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
