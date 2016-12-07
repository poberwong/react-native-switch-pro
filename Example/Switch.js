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
    const offset = (width - height) / 2

    this.state = {
      offset,
      value: props.value,
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
    const { handlerAnimation } = this.state

    Animated.timing(handlerAnimation,
      {
        toValue: height * 6 / 5,
        duration: 100,
        easing: Easing.linear
      }
    ).start()
  }

  _onPanResponderMove = (evt, gestureState) => {
    
  }

  _onPanResponderRelease = (evt, gestureState) => {
    this.toggleSwitch()
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
    const { switchAnimation, handlerAnimation, offset } = this.state

    Animated.parallel([
      Animated.timing(switchAnimation,
        {
          toValue: value ? (width - height + 1) : -(width - height + 1),
          duration: 200,
          easing: Easing.linear
        }
      ),
      Animated.timing(handlerAnimation,
        {
          toValue: height - 2,
          duration: 200,
          easing: Easing.linear
        }
      )
    ]).start(callback)
  }

  render() {
    const { switchAnimation, handlerAnimation, alignItems, offset, value } = this.state
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
  },
  animatedContainer: {
    flex: 1,
    alignItems: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
