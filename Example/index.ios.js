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
  state={
    value: false
  }

  render() {
    return (
      <View style={styles.container}>
        <Switch onAsyncPress={(result, callback) => {
          console.log('async')
          callback(true)
        }}
        />
        <Switch value={false} style={{marginTop: 20}}/>
        <Switch
          width={60}
          height={30}
          circleColor={'white'}
          backgroundInactive={'rgba(255,255,255,0.2)'}
          style={{marginTop: 20}}
          backgroundActive={'green'}
          value={this.state.value}
          onSyncPress={value => this.setState({value})}
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
