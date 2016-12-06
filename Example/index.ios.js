import React, { Component } from 'react'
import Switch from './Switch'
import {
  AppRegistry,
  StyleSheet,
  PanResponder,
  Text,
  View
} from 'react-native'

export default class Example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Switch value />
        <Switch value={false} style={{marginTop: 20}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Example', () => Example)
