import React from 'react';
import { View, Text, Button } from 'react-native';

/* context */
import { useAuthenticate } from '../../context/Auth';

const LoginScreen = () => {
  const { continueWithGoogle } = useAuthenticate();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ marginBottom: 16 }}>Login</Text>
      <Button title="Google Sign-In" onPress={continueWithGoogle} />
    </View>
  );
};

export default LoginScreen;
