import React, { Component, PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  PanResponder,
  TouchableOpacity
} from 'react-native'

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
    backgroundActive: '#43d551',
    backgroundInactive: '#dddddd',
    onValueChange: () => null
  }

  constructor (props, context) {
    super(props, context)
    const { width, height } = props

    this.state = {
      value: props.value,
      toggleable: true,
      alignItems: props.value ? 'flex-end' : 'flex-start',
      handlerAnimation: new Animated.Value(props.height - 2),
      switchAnimation: new Animated.Value(props.value ? -1 : 1)
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
    const { height } = this.props

    this.animateHandler(height * 6 / 5).start()
  }

  _onPanResponderMove = (evt, gestureState) => {
    const {value, toggleable} = this.state

    this.setState({
      toggleable: value ? (gestureState.dx < 10) : (gestureState.dx > -10)
    })
  }

  _onPanResponderRelease = (evt, gestureState) => {
    const { handlerAnimation } = this.state
    const { height } = this.props

    this.animateHandler(height - 2).start()
    this.state.toggleable && this.toggleSwitch()
  }

  toggleSwitch = () => {
    const { value, switchAnimation } = this.state
    const { onValueChange, disabled } = this.props

    if (disabled) {
      return
    }

    this.animateSwitch(!value, () => {
      this.setState({
        value: !value,
        alignItems: !value ? 'flex-end' : 'flex-start'
      }, () => onValueChange(this.state.value))
      switchAnimation.setValue(!value ? -1 : 1)
    })
  }

  animateSwitch = (value, callback = () => {}) => {
    const { height, width } = this.props
    const { switchAnimation } = this.state

    Animated.parallel([
      Animated.timing(switchAnimation,
        {
          toValue: value ? (width - height + 1) : -(width - height + 1),
          duration: 200,
          easing: Easing.linear
        }
      ),
      this.animateHandler(height - 2)
    ]).start(callback)
  }

  animateHandler = (value) => {
    const { handlerAnimation } = this.state

    return (
      Animated.timing(handlerAnimation,
        {
          toValue: value,
          duration: 200,
          easing: Easing.linear
        }
      )
    )
  }

  render() {
    const { switchAnimation, handlerAnimation, alignItems, value } = this.state
    const {
      backgroundActive, backgroundInactive,
      width, height, circleColor, style
    } = this.props

    const interpolatedBackgroundColor = switchAnimation.interpolate({
      inputRange: value ? [height - width - 1, -1]: [1, width - height + 1],
      outputRange: [backgroundInactive, backgroundActive]
    })

    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[styles.container, style, {
        width, height,
        alignItems,
        borderRadius: height / 2,
        backgroundColor: interpolatedBackgroundColor }]}>
        <Animated.View style={{
          backgroundColor: circleColor,
          width: handlerAnimation,
          height: height - 2,
          borderRadius: height / 2,
          transform: [{ translateX: switchAnimation }]
          }}
          {...this._panResponder.panHandlers} />
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
