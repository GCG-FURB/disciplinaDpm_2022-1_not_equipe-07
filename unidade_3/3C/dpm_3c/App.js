import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  function getTitulo() {
    return "Hello World!";
  }

  const [titulo, setTitulo] = useState(getTitulo());

  return (
      <View style={styles.container}>
        <Text>{ titulo }</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
