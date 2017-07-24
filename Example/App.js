import React, {Component} from "react";
import Switch from "./Switch";
import {AppRegistry, StyleSheet, View} from "react-native";

export default class Example extends Component {

  state = {
    value: false
  };

  render() {
    return (
      <View style={styles.container}>
        <Switch />
        <Switch defaultValue={true} style={{marginTop: 20}}/>
        <Switch disabled style={{marginTop: 20}}/>
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

AppRegistry.registerComponent('Example', () => Example);
