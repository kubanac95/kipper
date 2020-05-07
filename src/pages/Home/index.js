import React from 'react';
import { View, Image, Text, Button } from 'react-native';

/* packages */
import * as DocumentPicker from 'expo-document-picker';

/* context */
import { useAuthenticate } from '../../context/Auth';

const HomeScreen = () => {
  const { user, logout } = useAuthenticate();

  if (!user) {
    return null;
  }

  const onPickDocument = () => {
    DocumentPicker.getDocumentAsync().then(console.log).catch(console.log);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={{ uri: user.photoURL }}
        style={{ width: 80, height: 80, marginBottom: 16 }}
      />
      <Text style={{ marginBottom: 16 }}>Welcome {user.displayName}</Text>
      <Button title="Pick" onPress={onPickDocument} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
