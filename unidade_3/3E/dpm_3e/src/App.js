import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal, Image} from 'react-native';
import { Camera } from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const camRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    (async = () => {
      const { status } = Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  async function takePicture(){

    if (camRef){
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  async function savePicture(){
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
    .then(() => {
      alert('Salvo com Sucesso!');
    })
    .catch(error => {
      console.log('err', error);
    })
  }

  return (
    <SafeAreaView>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Trocar </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity onPress={takePicture} >
        <FontAwesome name="camera" size={23} color="#FFF"></FontAwesome>
      </TouchableOpacity>

      { capturedPhoto && 
        <Modal animationType="slide" transparent="false" visible={open}> 
          <View style={{flex: 1, justifyContent: 'center', alignItems:'center', margin: 20}}>
            <View style={{margin: 10, flexDirection: 'row'}}>
              <TouchableOpacity style={{ margin: 10 }} onPress={ ()=> { setOpen(false); }}>
                <FontAwesome name="window-close" size={50} color="#FF0000" />
              </TouchableOpacity>
              <TouchableOpacity style={{ margin: 10 }} onPress={ savePicture }>
                <FontAwesome name="upload" size={50} color="#121212" />
              </TouchableOpacity>
            </View>

            <Images style={{ width: '100%', height: 450, borderRadius: 20}} source={{ uri: capturedPhoto}} />
          </View>
        </Modal>
      }
    </SafeAreaView>
  );
}