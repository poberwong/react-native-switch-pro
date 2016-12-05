import React, { Component } from 'react';
import Switch from 'react-native-switch-pro'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Switch value
          onValueChange={(val) => console.log(val)}
        />
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

AppRegistry.registerComponent('Example', () => Example);
