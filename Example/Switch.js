import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableWithoutFeedback
} from 'react-native'
import LG from 'react-native-linear-gradient'

export default class Switch extends Component {
  static propTypes = {
    onValueChange: PropTypes.func,
    disabled: PropTypes.bool,
    backgroundActive: PropTypes.string,
    backgroundInactive: PropTypes.string,
    value: PropTypes.bool
  };
  static defaultProps = {
    value: false,
    onValueChange: () => null,
    disabled: false,
    backgroundActive: 'green',
    backgroundInactive: '#dddddd',
  };

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: props.value,
      transformSwitch: new Animated.Value(props.value ? 10 : -10)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { disabled } = this.props
    if (nextProps.value === this.props.value || disabled) {
      return
    }

    this.animateSwitch(nextProps.value, () => {
      this.setState({ value: nextProps.value })
    })
  }

  handleSwitch = () => {
    const { value } = this.state
    const { onValueChange, disabled } = this.props
    if (disabled) {
      return
    }

    this.animateSwitch(!value, () => {
      this.setState({ value: !value }, () => onValueChange(this.state.value))
    })
  }

  animateSwitch = (value, cb = () => {}) => {
    const { transformSwitch } = this.state
    Animated.timing(transformSwitch,
      { // 按钮的位移
        toValue: value ? 10 : -10,
        duration: 200
      }
    ).start(cb)
  }

  render() {
    const { transformSwitch } = this.state

    const { backgroundActive, backgroundInactive } = this.props

    const interpolatedBackgroundColor = transformSwitch.interpolate({
      inputRange: [-10, 10],
      outputRange: [backgroundInactive, backgroundActive]
    })

    return (
      <TouchableWithoutFeedback onPress={this.handleSwitch}>
        <Animated.View style={[styles.container, { backgroundColor: interpolatedBackgroundColor }]}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {transform: [{ translateX: transformSwitch }]},
            ]}>
            <View style={styles.circle} />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}
// 51 / 31

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 30,
    overflow: 'hidden'
  },
  animatedContainer: {
    flex: 1,
    width: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white'
  }
})
