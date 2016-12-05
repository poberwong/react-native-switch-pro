# react-native-switch-pro
an universal switch for android and iOS

## Preview
<img src="http://ww3.sinaimg.cn/large/005zU9b3gw1fagbb6enwzj30ku12ajs0.jpg" width="340" height="600"/>
&nbsp;&nbsp;&nbsp;
<img src="http://ww1.sinaimg.cn/large/005zU9b3gw1fagbb81p43j30ku12a74y.jpg" width="340" height="600"/>

## Feature
* Almost perfect switch on react-native
* Have a good peformance on both iOS and Andriod

## TODO
- [ ] add gesture with `PanResponder`  
- [ ] add more animation to follow iOS native performance

## Install
`npm install react-native-switch-pro --save`

## Usage
```JavaScript
import Switch from 'react-native-switch-pro'
...
  render() {
    return (
      <View style={styles.container}>
      	<Switch />
      </View>
    );
  }
...
```
## Props
 Name | Description | Default | Type
------|-------------|----------|-----------
width | width of switch | 40 | number
height | height of switch | 21 | number
value | state of switch | false | bool
disabled | whether switch is clickable | false | bool
circleColor | color for circle handler of switch | white | string
backgroundActive | color of switch when it is on | green | string
backgroundInactive | color of switch when it is off | '#ddd' | string
onValueChange | callback when switch is clicked | () => {} | func

## Thanks
Thanks to some code from [react-native-switch](https://github.com/shahen94/react-native-switch), I will complete it more perfect.

## License
*MIT*