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
  <TouchableOpacity onPress={() => navigation.navigate("Character", { data: data })} activeOpacity={0.3} style={{ flexDirection: 'row', paddingBottom: 5, marginVertical: 5, borderBottomColor: "#e8e8e8", borderBottomWidth: 1 }}>

    <View style={{ position: 'relative' }}>
      {
        (data.status.toLowerCase() === "dead") ?
          <View style={{ height: 50, width: 50, backgroundColor: 'rgba(255,255,255,0.5)', position: 'absolute', top: 0, left: 0, zIndex: 900 }} />
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

    <View style={{ marginLeft: 'auto', alignSelf: 'center' }}>
      <Text style={{ color: "rgba(0,0,0,0.5)" }}>{data.gender}</Text>
    </View>

  </TouchableOpacity>
);

function CharacterList({ navigation }) {

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
        renderItem={({ item }) => <Item data={item} navigation={navigation} />}
        refreshControl={<RefreshControl refreshing={loader} />}
      />
    </View>
  )
}

function List({ navigation }) {
  return (
    <SafeAreaView style={{ height: Dimensions.get('window').height, backgroundColor: 'white' }}>
      <View style={{ paddingHorizontal: 15 }}>
        <CharacterList navigation={navigation} />
      </View>
    </SafeAreaView>
  )
}

function EpisodeItem({ episode, airdate, name }) {
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.1)" }}>
      <View style={{ alignSelf: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{episode}</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: '600' }}>{name}</Text>
        <Text>{airdate}</Text>
      </View>
    </View>
  )
}

function Charater(props) {

  const { route, navigation } = props

  const [character, setCharacter] = useState({ data: null })

  useEffect(() => {
    // console.log("Use effect data")
    // console.log(character.data.character.episode)
  }, [character])

  const CHARACTER_DATA = gql`
  query data ($id:ID!) {
    character(id:$id){
      id
      episode{
        id
        name
        air_date
        episode
      }
    }
  }
  `

  const { data, loading } = useQuery(CHARACTER_DATA, {
    variables: { id: route.params.data.id },
    onCompleted: _CharacterData => {
      setCharacter({ data: _CharacterData })
      console.log(data.eposide)
    },
    onError: e => console.log(JSON.stringify(e, null, 2))
  })

  return (
    <View style={{ paddingTop: 20 }}>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Image
          source={{
            uri: route.params.data.image
          }}
          style={{
            borderRadius: 50,
            height: 100,
            width: 100
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginVertical: 20 }}>
        <View>
          <Text style={styles.charaterOptionsTitle}>Gender</Text>
          <Text style={styles.charaterOptionsText}>{route.params.data.gender}</Text>
        </View>
        <View>
          <Text style={styles.charaterOptionsTitle}>Name</Text>
          <Text style={styles.charaterOptionsText} >{route.params.data.name}</Text>
        </View>
        <View>
          <Text style={styles.charaterOptionsTitle}>Status</Text>
          <Text style={styles.charaterOptionsText}>{route.params.data.status}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: 'white', padding: 15 }}>

        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Episodes</Text>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: "rgba(0,0,0,0.3)", marginVertical: 10 }} />

        <View style={{ paddingBottom: 470 }}>
          <FlatList
            data={character?.data?.character?.episode}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => <EpisodeItem episode={item.episode} airdate={item.air_date} name={item.name} />}
            refreshControl={ <RefreshControl refreshing={loading} />}
          />
        </View>


      </View>

    </View >
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
  charaterOptionsText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  charaterOptionsTitle: {
    fontSize: 12,
    textAlign: 'center'
  }
});
