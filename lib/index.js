import React, { Component } from 'react'
import PropTypes from "prop-types"
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
    circleStyle: ViewPropTypes.style,
    accessible: ViewPropTypes.accessible,
		accessibilityLabel: ViewPropTypes.accessibilityLabel,
		accessibilityHint: ViewPropTypes.accessibilityHint,
    accessibilityLiveRegion: ViewPropTypes.accessibilityLiveRegion,
    animationDuration: PropTypes.number,
    easing: PropTypes.oneOf([
      'step0',
      'step1',
      'linear',
      'ease',
      'quad',
      'cubic',
      'poly',
      'sin',
      'circle',
      'exp',
      'elastic',
      'back',
      'bounce',
      'bezier',
      'in',
      'out',
      'inOut'
    ])
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
    accessible: true,
		accessibilityLabel: "Switch button",
    accessibilityHint: "Switch the button state",
    animationDuration: 200,
    easing: 'linear',
    accessibilityLiveRegion: 'none',
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    // unify inner state and outer props
    if (nextProps.value === this.state.value) {
      return
    }

    if (typeof nextProps.value !== 'undefined' && nextProps.value !== this.props.value) {
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

  _onPanResponderGrant = (evt, gestureState) => {
    const { disabled } = this.props
    if (disabled) return

    this.setState({toggleable: true})
    this.animateHandler(this.handlerSize * SCALE)
  }

  _onPanResponderMove = (evt, gestureState) => {
    const { value } = this.state
    const { disabled } = this.props
    if (disabled) return

    this.setState({
      toggleable: value ? (gestureState.dx < 10) : (gestureState.dx > -10)
    })
  }

  _onPanResponderRelease = (evt, gestureState) => {
    const { toggleable } = this.state
    const { disabled, onAsyncPress, onSyncPress } = this.props

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

  /**
   *
   * @param result result of task
   * @param callback invoke when task is finished
   */
  toggleSwitch = (result, callback = () => null) => {
    const { value } = this.state
    this.toggleSwitchToValue(result, !value, callback)
  }

  /**
   * @param result result of task
   * @param toValue next status of switch
   * @param callback invoke when task is finished
   */
  toggleSwitchToValue = (result, toValue, callback = () => null) => {
    const { switchAnimation } = this.state

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
        duration: this.props.animationDuration,
        easing: Easing[this.props.easing],
        useNativeDriver: false
      }
    ).start(callback)
  }

  animateHandler = (value, callback = () => null) => {
    const { handlerAnimation } = this.state

    Animated.timing(handlerAnimation,
      {
        toValue: value,
        duration: this.props.animationDuration,
        easing: Easing[this.props.easing],
        useNativeDriver: false
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
      outputRange: [backgroundInactive, backgroundActive],
      extrapolate: 'clamp'
    })

    const interpolatedCircleColor = switchAnimation.interpolate({
      inputRange: value ? [-this.offset, -1]: [1, this.offset],
      outputRange: [circleColorInactive, circleColorActive],
      extrapolate: 'clamp'
    })

    const circlePosition = (value) => {
      const modifier = value ? 1 : -1
      let position = modifier * -1

      if (circleStyle && circleStyle.borderWidth) {
        position += modifier
      }

      if (style && style.borderWidth) {
        position += modifier
      }

      return position
    }

    const interpolatedTranslateX = switchAnimation.interpolate({
      inputRange: value ? [-this.offset, -1]: [1, this.offset],
      outputRange: value ? [-this.offset, circlePosition(value)]: [circlePosition(value), this.offset],
      extrapolate: 'clamp'
    })

    return (
      <Animated.View
        {...rest}
        {...this._panResponder.panHandlers}
        style={[styles.container, {
          width, height,
          alignItems,
          borderRadius: height / 2,
          backgroundColor: interpolatedBackgroundColor }, style]}>
        <Animated.View style={[{
          backgroundColor: interpolatedCircleColor,
          width: handlerAnimation,
          height: this.handlerSize,
          borderRadius: height / 2,
          transform: [{ translateX: interpolatedTranslateX }]
        }, circleStyle]}
          accessible={this.props.accessible}
					accessibilityLabel={this.props.accessibilityLabel}
					accessibilityHint={this.props.accessibilityHint}
					accessibilityIgnoresInvertColors={false}
					accessibilityLiveRegion={this.props.accessibilityLiveRegion}
					accessibilityRole="switch"
					accessibilityState={{
						disabled: this.props.disabled,
						checked: this.state.value
					}}
					accessibilityValue={{
						text: this.state.value ? "on" : "off"
					}}
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
