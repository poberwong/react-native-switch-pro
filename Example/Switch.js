import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableWithoutFeedback
} from 'react-native'

export default class Switch extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    circleColor: PropTypes.string,
    onValueChange: PropTypes.func,
    disabled: PropTypes.bool,
    backgroundActive: PropTypes.string,
    backgroundInactive: PropTypes.string,
    value: PropTypes.bool
  };
  static defaultProps = {
    width: 40,
    height: 21,
    value: false,
    circleColor: 'white',
    onValueChange: () => null,
    disabled: false,
    backgroundActive: 'green',
    backgroundInactive: '#dddddd',
  };

  constructor(props, context) {
    super(props, context)
    const { width, height } = props
    const offset = (width - height) / 2
    this.state = {
      offset,
      value: props.value,
      transformSwitch: new Animated.Value(props.value ? offset : -offset)
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
    const { transformSwitch, offset } = this.state
    Animated.timing(transformSwitch,
      { // 按钮的位移
        toValue: value ? offset : -offset,
        duration: 200
      }
    ).start(cb)
  }

  render() {
    const { transformSwitch, offset } = this.state

    const { backgroundActive, backgroundInactive, width, height, circleColor } = this.props

    const interpolatedBackgroundColor = transformSwitch.interpolate({
      inputRange: [-offset, offset],
      outputRange: [backgroundInactive, backgroundActive]
    })

    return (
      <TouchableWithoutFeedback onPress={this.handleSwitch}>
        <Animated.View style={[styles.container, {
          width, height,
          borderRadius: height / 2,
          backgroundColor: interpolatedBackgroundColor }]}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {transform: [{ translateX: transformSwitch }], width},
            ]}>
            <View style={{
              backgroundColor: circleColor,
              width: height - 2,
              height: height - 2,
              borderRadius: height / 2
            }} />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  animatedContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
