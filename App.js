import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator()


const CHARACTERS = gql`
query{
  characters{
    results{
      id
      name
      status
      image
    }
  }
}
`

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
});

const Item = ({ data }) => (
  <View style={{ flexDirection: 'row', marginVertical: 5 }}>

    <View style={{ position: 'relative' }}>
      {
        (data.status.toLowerCase() === "dead") ?
          <View style={{ height: 50, width: 50, backgroundColor: 'rgba(255,255,255,0.5)', position: 'absolute', top: 0, left: 0, zIndex: '900' }} />
          :
          null
      }
      <Image
        source={{
          uri: data.image
        }}

        style={{
          borderRadius: 25,
          height: 50,
          width: 50
        }}
      />
    </View>

    <View style={{ justifyContent: 'space-around', marginLeft: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.name}</Text>
      <Text style={{ color: `${(data.status.toLowerCase() === "dead") ? 'red' : 'black'}` }}>{data.status}</Text>
    </View>

  </View>
);

function CharacterList() {

  const [list, setList] = useState([]);
  const [loader, setloader] = useState(true)
  const { loading, error, data } = useQuery(CHARACTERS, {
    onCompleted: d => {
      setList(d?.characters.results);
      setloader(false)
    }, onError: e => console.log(JSON.stringify(e, null, 2))
  })

  const renderItem = ({ item }) => (
    <Item data={item} />
  );

  console.log(data?.characters?.results)

  return (
    <FlatList
      data={list}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={loader} />}
    />
  )
}

function List() {
  return (
    <SafeAreaView style={{ height: Dimensions.get('window').height, }}>
      <View style={{ paddingHorizontal: 15 }}>
        <CharacterList />
      </View>
    </SafeAreaView>
  )
}

function Charater() {
  return(
    <View>
      <Text>Hello from character page</Text>
    </View>
  )
}

export default function App() {

  StatusBar.setBarStyle("dark-content")

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
      <AppStack.Navigator initialRouteName="List">
        <AppStack.Screen name="List" component={List} options={{headerTitle:'All Characters'}} />
        <AppStack.Screen name="Character" component={Charater} />
      </AppStack.Navigator>
      </NavigationContainer>
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
