# react-native-switch-pro
an universal switch for android and iOS, it could be the best switch for react-native on Github.

## Preview
<img src="http://ww4.sinaimg.cn/large/005zU9b3jw1faioulkg79j30kq10wq3c.jpg" width="340" height="600"/>
&nbsp;&nbsp;&nbsp;
<img src="http://ww2.sinaimg.cn/large/005zU9b3jw1faioygbedfg30a90iejrd.gif" width="340" height="600"/>

## Feature
* Almost perfect switch on react-native
* Have a good peformance on both iOS and Andriod
* Add gesture with `PanResponder`  
* More animations to follow iOS native performance

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

## License
*MIT*