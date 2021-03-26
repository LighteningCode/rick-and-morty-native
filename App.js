import { ApolloProvider, ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, View, StatusBar, TouchableHighlight, TouchableOpacity } from 'react-native';
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
      gender
    }
  }
}
`

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
});

const Item = ({ data, navigation }) => (
  <TouchableOpacity onPress={()=> navigation.navigate("Character")} activeOpacity={0.3} style={{ flexDirection: 'row', paddingBottom: 5, marginVertical: 5, borderBottomColor: "#e8e8e8", borderBottomWidth: 1 }}>

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{data.name}</Text>
      </View>
      <Text style={{ color: `${(data.status.toLowerCase() === "dead") ? 'red' : 'black'}` }}>{data.status}</Text>
    </View>

    <View style={{marginLeft:'auto', alignSelf:'center'}}>
      <Text style={{color:"rgba(0,0,0,0.5)"}}>{data.gender}</Text>
    </View>

  </TouchableOpacity>
);

function CharacterList({navigation}) {

  const [list, setList] = useState([]);
  const [loader, setloader] = useState(true)
  const { loading, error, data } = useQuery(CHARACTERS, {
    onCompleted: d => {
      setList(d?.characters.results);
      setloader(false)
    }, onError: e => console.log(JSON.stringify(e, null, 2))
  })

  // console.log(data?.characters?.results)

  return (
    <View style={{ paddingBottom: 60 }}>
      <FlatList
        data={list}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) =>  <Item data={item} navigation={navigation} />}
        refreshControl={<RefreshControl refreshing={loader} />}
      />
    </View>
  )
}

function List({navigation}) {
  return (
    <SafeAreaView style={{ height: Dimensions.get('window').height, backgroundColor: 'white' }}>
      <View style={{ paddingHorizontal: 15 }}>
        <CharacterList navigation={navigation} />
      </View>
    </SafeAreaView>
  )
}

function Charater() {
  return (
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
          <AppStack.Screen name="List" component={List} options={{ headerTitle: 'All Characters' }} />
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
