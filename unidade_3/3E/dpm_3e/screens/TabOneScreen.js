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
  var [capturedPhoto, setCapturedPhoto] = useState(null);
  var uriCapturedPhoto;
  var [open, setOpen] = useState(false);

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
      let isPhotoCaptured = data.uri != null;  
      
      uriCapturedPhoto = data.uri.toString();

      setCapturedPhoto(data.uri);
      setOpen(true);

      console.log(capturedPhoto);
    }
  }

  async function savePicture(){
    const asset = await MediaLibrary.createAssetAsync(uriCapturedPhoto)
    .then(() => {
      alert('Salvo com Sucesso!');
    })
    .catch(error => {
      console.log('err', error);
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={{flex: 1}} type={type} ref={camRef}>
        <View style={{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}} >
          <TouchableOpacity
           style={{
            position: 'absolute',
            bottom: 20,
            left: 20
           }} 
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 23, marginBottom: 20, color: '#FFF'}}> Trocar </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity style={styles.button} onPress={takePicture} >
        <FontAwesome name="camera" size={23} color="#FFF"></FontAwesome>
      </TouchableOpacity>

      { uriCapturedPhoto && 
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

            <Image style={{ width: '100%', height: 300, borderRadius: 20}} source={{ uri: uriCapturedPhoto}} />
          </View>
        </Modal>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 20,
    height: 50,
  }
})