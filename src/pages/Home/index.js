import React, { useCallback, useRef, useState, useMemo } from 'react';
import { View, Image, Text, Button, Dimensions } from 'react-native';

/* packages */
import ProgressBar from 'react-native-progress/Bar';
import * as DocumentPicker from 'expo-document-picker';

import storage from '@react-native-firebase/storage';
import useSetState from 'react-use/lib/useSetState';

/* context */
import { useAuthenticate } from '../../context/Auth';

const { width } = Dimensions.get('window');

const initialStatus = {
  uploading: false,
  error: null,
  totalBytes: 0,
  bytesWritten: 0,
};

const HomeScreen = () => {
  const { user, logout } = useAuthenticate();

  const task = useRef();

  const [status, setStatus] = useSetState(() => ({ ...initialStatus }));

  const onDocumentUpload = useCallback(
    (file) => {
      const { uri, size: totalBytes } = file;

      const fileName = uri.split('/').pop();

      setStatus({ totalBytes, uploading: true });

      const onStateChanged = (snapshot) => {
        // console.log(snapshot);

        const { state, bytesTransferred: bytesWritten } = snapshot;

        if (state === 'success') {
          return setStatus({ uploading: false, bytesWritten: 0 });
        }

        if (state === 'cancelled') {
          return setStatus({ uploading: false, bytesWritten });
        }

        setStatus({ bytesWritten });
      };

      const onSuccess = () => {
        console.log('success');
        return setStatus({ ...initialStatus });
      };

      const onError = (error) => {
        console.log('onError', error);
        return setStatus({ ...initialStatus, error });
      };

      try {
        task.current = storage()
          .ref(`${user.uid}/uploads/${fileName}`)
          .putFile(uri);
      } catch (e) {
        console.log('DID I CATCH YOU ?', e);
      }

      task.current.on('state_changed', onStateChanged);

      task.current.then(onSuccess);
      task.current.catch(onError);
    },
    [user],
  );

  const progress = useMemo(
    () => (100 * status.bytesWritten) / status.totalBytes / 100 || 0,
    [status],
  );

  if (!user) {
    return null;
  }

  const onPickDocument = () => {
    if (status.uploading) {
      return task.current.cancel();
    }

    return DocumentPicker.getDocumentAsync()
      .then(onDocumentUpload)
      .catch(console.log);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={{ uri: user.photoURL }}
        style={{ width: 80, height: 80, marginBottom: 16 }}
      />
      <Text style={{ marginBottom: 16 }}>Welcome {user.displayName}</Text>
      <ProgressBar
        progress={progress}
        animated={status.uploading}
        width={150}
        useNativeDriver
      />
      <Button
        title={status.uploading ? 'Cancel' : 'Upload'}
        onPress={onPickDocument}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
