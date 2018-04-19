import React, { Component } from 'react'
import PropTypes from "prop-types"
import {
  ViewPropTypes,
  ColorPropType,
  StyleSheet,
  Animated,
  Easing,
  PanResponder,
  TouchableOpacity
} from 'react-native'

const SCALE = 6 / 5

export default class extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    circleColorActive: ColorPropType,
    circleColorInactive: ColorPropType,
    backgroundActive: ColorPropType,
    backgroundInactive: ColorPropType,
    onAsyncPress: PropTypes.func,
    onSyncPress: PropTypes.func,
    style: ViewPropTypes.style,
    circleStyle: ViewPropTypes.style
  }

  static defaultProps = {
    width: 40,
    height: 21,
    value: false,
    disabled: false,
    circleColorActive: 'white',
    circleColorInactive: 'white',
    backgroundActive: '#43d551',
    backgroundInactive: '#dddddd',
    onAsyncPress: (callback) => {callback(true)}
  }

  constructor (props, context) {
    super(props, context)
    const { width, height, value } = props

    this.offset = width - height + 1
    this.handlerSize = height - 2
    
    this.state = {
      value,
      toggleable: true,
      alignItems: value ? 'flex-end' : 'flex-start',
      handlerAnimation: new Animated.Value(this.handlerSize),
      switchAnimation: new Animated.Value(value ? -1 : 1)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (typeof nextProps.value !== 'undefined' && nextProps.value !== this.props.value) {
      this.animateSwitch(nextProps.value, () => {
        this.setState({ value: nextProps.value })
      })
    }
  }

  componentWillMount () {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease
    })
  }

  _onPanResponderGrant = (evt, gestureState) => {
    const { disabled } = this.props
    if (disabled) return

    this.animateHandler(this.handlerSize * SCALE)
  }

  _onPanResponderMove = (evt, gestureState) => {
    const { value, toggleable } = this.state
    const { disabled } = this.props
    if (disabled) return

    this.setState({
      toggleable: value ? (gestureState.dx < 10) : (gestureState.dx > -10)
    })
  }

  _onPanResponderRelease = (evt, gestureState) => {
    const { handlerAnimation, toggleable, value } = this.state
    const { height, disabled, onAsyncPress, onSyncPress } = this.props

    if (disabled) return

    if (toggleable) {
      if (onSyncPress) {
        this.toggleSwitch(true, onSyncPress)
      } else {
        onAsyncPress(this.toggleSwitch)
      }
    } else {
      this.animateHandler(this.handlerSize)
    }
  }

  toggleSwitch = (result, callback = () => null) => { // "result" is result of task
    const { value, switchAnimation } = this.state
    const toValue = !value

    this.animateHandler(this.handlerSize)
    if (result) {
      this.animateSwitch(toValue, () => {
        this.setState({
          value: toValue,
          alignItems: toValue ? 'flex-end' : 'flex-start'
        }, () => {
          callback(toValue)
        })
        switchAnimation.setValue(toValue ? -1 : 1)
      })
    }
  }

  animateSwitch = (value, callback = () => null) => {
    const { switchAnimation } = this.state

    Animated.timing(switchAnimation,
      {
        toValue: value ? this.offset : -this.offset,
        duration: 200,
        easing: Easing.linear
      }
    ).start(callback)
  }

  animateHandler = (value, callback = () => null) => {
    const { handlerAnimation } = this.state

    Animated.timing(handlerAnimation,
      {
        toValue: value,
        duration: 200,
        easing: Easing.linear
      }
    ).start(callback)
  }

  render() {
    const { switchAnimation, handlerAnimation, alignItems, value } = this.state
    const {
      backgroundActive, backgroundInactive,
      width, height, circleColorActive, circleColorInactive, style,
      circleStyle,
      ...rest
    } = this.props

    const interpolatedBackgroundColor = switchAnimation.interpolate({
      inputRange: value ? [-this.offset, -1]: [1, this.offset],
      outputRange: [backgroundInactive, backgroundActive]
    })

    const interpolatedCircleColor = switchAnimation.interpolate({
      inputRange: value ? [-this.offset, -1]: [1, this.offset],
      outputRange: [circleColorInactive, circleColorActive]
    })

    return (
      <Animated.View
        {...rest}
        {...this._panResponder.panHandlers}
        style={[styles.container, style, {
          width, height,
          alignItems,
          borderRadius: height / 2,
          backgroundColor: interpolatedBackgroundColor }]}>
        <Animated.View style={[{
          backgroundColor: interpolatedCircleColor,
          width: handlerAnimation,
          height: this.handlerSize,
          borderRadius: height / 2,
          transform: [{ translateX: switchAnimation }]
        }, circleStyle]} />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center'
  }
})
