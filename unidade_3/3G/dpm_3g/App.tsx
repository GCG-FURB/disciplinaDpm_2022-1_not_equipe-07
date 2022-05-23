import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, ListRenderItemInfo, StyleSheet, Text, View, Button } from 'react-native';
import {EpisodeItem} from './src/components/EpisodeItem';
import {Episode, Info} from './src/models/interfaces';
import axios from 'axios';
import {colors} from './src/theme/colors';
import {FixedHeader} from './src/components/FixedHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

// exemplo de GET de dados em API obtido do tutorial do youtube no link a seguir
// https://www.youtube.com/watch?v=fO-b9BAIyeE&t=130s
// Lógica para salvar implementada manualmente para se adequar ao exemplo do video.

export default function App() {
  const KEY = "key-API-dados";
  const [list, setList] = useState<Episode[]>([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [titulo, setTitulo] = useState("");

  function renderItem({item}: ListRenderItemInfo<Episode>) {
    return <EpisodeItem {...item} />;
  }

  async function possuiAsyncStorage() {
    const localStorage = await AsyncStorage.getItem(KEY);

    if(localStorage == null || localStorage == "")
      return false;

    return localStorage != null;
  }

  async function removerAsyncStorage(){
    return await AsyncStorage.removeItem(KEY);
  }

  async function salvarAsyncStorage(dados: any[]){
    if(dados != null && dados.length > 0) {
      await removerAsyncStorage();
      await AsyncStorage.setItem(KEY, JSON.stringify(dados));
    }
  }

  async function obterAsyncStorage(){
    const dados = await AsyncStorage.getItem(KEY);
    return dados != null ? JSON.parse(dados) : null;
  }

  async function removerAsyncStorageEBuscarPelaApi() {
    setTimeout(async () => {
      try {
        await removerAsyncStorage();
        setHasMoreData(true);
        getCharacters(0);
      } catch (error) {
        console.log(error);
      }
    }, 2000);
  }

  async function getCharacters(timeout: number = 2000) {
    // remova o comentário do setTimeout para perceber o loading com o delay
     setTimeout(async () => {

       if(!hasMoreData)
         return;

    if(await possuiAsyncStorage()) {
      setTitulo("Dados obtidos localmente");
      const current = await obterAsyncStorage();
      setList(current);
      setHasMoreData(false);
      return;
    } else {
      const {data} = await axios.get<Info<Episode[]>>(`https://rickandmortyapi.com/api/episode?page=${page}`);

      if (data.results) {
        setTitulo("Dados obtidos da API");
        const current = data.results;
        await setList(current);
        await salvarAsyncStorage(current);
        setHasMoreData(false);
      }
    }
     }, timeout);
  }

  useEffect(() => {
    getCharacters(2000);
  }, []);

  return (
    <View style={styles.container}>
      {/*<FixedHeader />*/}
      <FlatList
        ListHeaderComponent={
        <>
          <Text style={styles.title}>{titulo}</Text>
          <Button title="Limpar dados" onPress={ removerAsyncStorageEBuscarPelaApi }></Button>
        </>

      }
        data={list}
        contentContainerStyle={{paddingBottom: 20}}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        ListFooterComponent={<Loading loading={hasMoreData} />}
      />
    </View>
  );
}

function Loading({loading}: {loading: boolean}) {
  if (loading) {
    return <ActivityIndicator size={'large'} color={colors.primary} />;
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.onBackground,
    marginVertical: 16,
    marginTop: 40
  },
  botaoLimpar: {
    marginBottom: 15,
    marginVertical: 15
  }
});
