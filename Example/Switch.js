import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ViewPropTypes,
  ColorPropType,
  StyleSheet,
  Animated,
  Easing,
  PanResponder
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
    onAsyncPress: callback => {
      callback(true)
    }
  }

  constructor (props, context) {
    super(props, context)
    const { width, height, value } = props

    this.offset = width - height + 1
    this.handlerSize = height - 2

    this.offset = width - height + 1
    this.handlerSize = height - 2

    this.state = { value }
    this.handlerAnimation = new Animated.Value(this.handlerSize)
    this.switchAnimation = new Animated.Value(value ? -1 : 1)
    this.toggleable = true
  }

  componentWillReceiveProps (nextProps) {
    // unify inner state and outer props
    if (nextProps.value === this.state.value) {
      return
    }

    if (
      typeof nextProps.value !== 'undefined' &&
      nextProps.value !== this.props.value
    ) {
      /**
       /* you can add animation when changing value programmatically like following:
       /* this.animateHandler(this.handlerSize * SCALE, () => {
      /*   setTimeout(() => {
      /*    this.toggleSwitchToValue(true, nextProps.value)
      /*    }, 800)
      /* })
       */
      this.toggleSwitchToValue(true, nextProps.value)
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
    if (this.props.disabled) return
    this.togglable = true
    this.animateHandler(this.handlerSize * SCALE)
  }

  _onPanResponderMove = (evt, gestureState) => {
    if (this.props.disabled) return
    const { value } = this.state
    this.toggleable = value ? gestureState.dx < 10 : gestureState.dx > -10
  }

  _onPanResponderRelease = (evt, gestureState) => {
    if (this.props.disabled) return
    const { toggleable } = this
    const { onAsyncPress, onSyncPress } = this.props

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

  /**
   *
   * @param result result of task
   * @param callback invoke when task is finished
   */
  toggleSwitch = (result, callback = () => null) =>
    this.toggleSwitchToValue(result, !this.state.value, callback)

  /**
   * @param result result of task
   * @param toValue next status of switch
   * @param callback invoke when task is finished
   */
  toggleSwitchToValue = (result, value, callback = () => null) => {
    this.animateHandler(this.handlerSize)
    if (result) {
      this.animateSwitch(value, () => {
        this.setState({ value }, () => {
          callback(value)
        })
        this.switchAnimation.setValue(value ? -1 : 1)
      })
    }
  }

  animateSwitch = (value, callback = () => null) => {
    Animated.timing(this.switchAnimation, {
      toValue: value ? this.offset : -this.offset,
      duration: 200,
      easing: Easing.linear
    }).start(callback)
  }

  animateHandler = (value, callback = () => null) =>
    Animated.timing(this.handlerAnimation, {
      toValue: value,
      duration: 200,
      easing: Easing.linear
    }).start(callback)

  render () {
    const { switchAnimation, handlerAnimation } = this
    const { value } = this.state
    const {
      backgroundActive,
      backgroundInactive,
      width,
      height,
      circleColorActive,
      circleColorInactive,
      style,
      circleStyle,
      ...rest
    } = this.props

    const alignItems = value ? 'flex-end' : 'flex-start'
    const borderWidth = value ? 0 : 1
    const range = value ? [-this.offset, -1] : [1, this.offset]

    const interpolate = outputRange =>
      switchAnimation.interpolate({
        inputRange: range,
        outputRange,
        extrapolate: 'clamp'
      })

    const interpolatedBackgroundColor = interpolate([
      backgroundInactive,
      backgroundActive
    ])

    const interpolatedCircleColor = interpolate([
      circleColorInactive,
      circleColorActive
    ])

    const interpolatedTranslateX = interpolate(range)

    return (
      <Animated.View
        {...rest}
        {...this._panResponder.panHandlers}
        style={[
          styles.container,
          style,
          {
            width,
            height,
            alignItems,
            borderRadius: height / 2,
            backgroundColor: interpolatedBackgroundColor
          }
        ]}
      >
        <Animated.View
          style={[
            {
              backgroundColor: interpolatedCircleColor,
              width: handlerAnimation,
              height: this.handlerSize,
              borderRadius: this.handlerSize / 2,
              transform: [{ translateX: interpolatedTranslateX }]
            },
            circleStyle
          ]}
        />
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
