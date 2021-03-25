import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';


const CHARACTERS = gql`
query{
  characters{
    results{
      name
      species
    }
  }
}
`

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
});

const Item = ({ data }) => (
  <View style={{flexDirection:'column', marginVertical: 5}}>
    <Text>{data.name}</Text>
    <Text>{data.species}</Text>
  </View>
);

function CharacterList() {

  const [list , setList] = useState([]);
  const [loader,setloader] = useState(true)
  const { loading, error, data } = useQuery(CHARACTERS, {onCompleted: d => {
    setList(d?.characters.results);
    setloader(false)
  },onError: e => console.log(JSON.stringify(e,null,2))})

  const renderItem = ({ item }) => (
    <Item data={item} />
  );

  console.log(data?.characters?.results)

  return (
    <FlatList
      data={list}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={loader}/>}
    />
  )
}

export default function App() {

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ height: Dimensions.get('window').height, }}>
        <CharacterList />
      </SafeAreaView>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
