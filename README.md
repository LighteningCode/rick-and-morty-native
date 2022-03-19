
<div align="center">
 
## Rick and Morty Character app
 
</div>

<div align="center">
 
   ![Rick and Morty](https://user-images.githubusercontent.com/30559298/159112943-bc14e5bf-dbac-40de-b9bc-139a150f245d.png)
 
 </div>
 

So I did a quick project with the rick and morty API here using apollo client to consume a graphql API with [this](https://rickandmortyapi.com/graphql)

What did I learn?
1. I learnt that when using FlatLists in react native the object returned from the renderItem prop is an object with two properties **item** and **index**, and the only way to change it is to use this (check line 191 in App.js) 

```javascript
renderItem={({ item:new_name, index }) => <EpisodeItem episode={new_name.episode} airdate={new_name.air_date} name={new_name.name} />}
```

otherwise you must use it the way it was

```javascript
renderItem={({ item, index }) => <EpisodeItem episode={item.episode} airdate={item.air_date} name={item.name} />}
```

This was the most eye opening frustration of the day.


2. I learnt how to use apollo client to pass a variable through the grapql query statement (App.js - line 127&128)

3. Learnt that ReactNative refresh control does not work outside the FlatList component
 
4. Attempted to use the [FluidNavigation](https://github.com/fram-x/FluidTransitions) to transition between screens and it didnt work, i tried thier examples, they also didnt work, looks like a dependency was removed from somewhere inside


### 🎉🎉 Clone repo and run on expo to take a look
