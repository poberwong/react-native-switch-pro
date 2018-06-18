import React, { Component } from 'react'
import Switch from './Switch'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class Example extends Component {
  state={
    value: false,
    value1: true
  }

  render() {
    return (
      <View style={styles.container}>
        <Switch /><Text>uncontrolled</Text>
        <Switch label={2} value={this.state.value} style={{marginTop: 20}} onSyncPress={(value) => this.setState({value})} />
        <Text> two way binding</Text>
        <Switch label={3} value={this.state.value} style={{marginTop: 20}} />
        <Text> controlled by outside</Text>
        <Switch
          width={60}
          height={30}
          style={{marginTop: 20}}
          value={this.state.value}
          onAsyncPress={(callback) => {
            setTimeout(() => callback(true), 1000)
          }}
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
    backgroundColor: '#5174a2',
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
