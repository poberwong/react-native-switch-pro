import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity
} from 'react-native'
// TODO: add gesture with 'PanResponder'

export default class extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    circleColor: PropTypes.string,
    backgroundActive: PropTypes.string,
    backgroundInactive: PropTypes.string,
    onValueChange: PropTypes.func,
    style: View.propTypes.style
  }

  static defaultProps = {
    width: 40,
    height: 21,
    value: false,
    disabled: false,
    circleColor: 'white',
    backgroundActive: 'green',
    backgroundInactive: '#dddddd',
    onValueChange: () => null
  }

  constructor (props, context) {
    super(props, context)
    const { width, height } = props
    const offset = (width - height) / 2

    this.state = {
      offset,
      value: props.value,
      transformSwitch: new Animated.Value(props.value ? offset : -offset)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { disabled } = this.props
    if (nextProps.value === this.props.value || disabled) {
      return
    }

    this.animateSwitch(nextProps.value, () => {
      this.setState({ value: nextProps.value })
    })
  }

  toggleSwitch = () => {
    const { value } = this.state
    const { onValueChange, disabled } = this.props
    if (disabled) {
      return
    }

    this.animateSwitch(!value, () => {
      this.setState({ value: !value }, () => onValueChange(this.state.value))
    })
  }

  animateSwitch = (value, callback = () => {}) => {
    const { transformSwitch, offset } = this.state
    Animated.timing(transformSwitch,
      {
        toValue: value ? offset : -offset,
        duration: 200
      }
    ).start(callback)
  }

  render() {
    const { transformSwitch, offset } = this.state
    const {
      backgroundActive, backgroundInactive,
      width, height, circleColor, style
    } = this.props

    const interpolatedBackgroundColor = transformSwitch.interpolate({
      inputRange: [-offset, offset],
      outputRange: [backgroundInactive, backgroundActive]
    })

    return (
      <TouchableOpacity
        onPress={this.toggleSwitch}
        activeOpacity={1} style={style}>
        <Animated.View style={[styles.container, {
          width, height,
          borderRadius: height / 2,
          backgroundColor: interpolatedBackgroundColor }]}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {transform: [{ translateX: transformSwitch }], width}
            ]}>
            <View style={{
              backgroundColor: circleColor,
              width: height - 2,
              height: height - 2,
              borderRadius: height / 2
            }} />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
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
    alignItems: 'center'
  }
})
