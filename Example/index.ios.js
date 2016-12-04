/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import  {
    View,
    Image,
    Text,
    StyleSheet,
    AppRegistry,
    TouchableOpacity,
    TextInput,
    Switch,
    PanResponder,
    Animated,
} from 'react-native';

export default class Example extends React.Component {

    constructor(props) {
        super(props);
        var deactivateBackWidthAnimInitValue = props.initValue ? props.buttonWidth : props.switchWidth;
        var buttonPositionAnimInitValue = props.initValue ? props.switchWidth-props.buttonWidth : 0;
        this.state = {
            initValue:props.initValue,
            deactivateBackWidthAnim:new Animated.Value(deactivateBackWidthAnimInitValue),
            buttonPositionAnim:new Animated.Value(buttonPositionAnimInitValue),
        }
    }
    render() {
        return (
          <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{height:this.props.switchHeight>this.props.buttonHeight? this.props.switchHeight:this.props.buttonHeight,
                            backgroundColor:'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                <View style={{flexDirection:'row',
                          justifyContent:'flex-end',
                          backgroundColor: this.props.activateBackgroundColor,
                          width:this.props.switchWidth,
                          height:this.props.switchHeight,
                          borderRadius: this.props.buttonRadius, /*为了保证滑块在switch两端时能够覆盖背景，所以背景使用滑块的borderRadius*/
                          borderColor:this.props.activateBorderColor,
                          borderWidth:this.props.activateBorderWidth,
                          }}
                    {...this._panResponder.panHandlers}>
                    <Animated.View style={{backgroundColor: this.props.deactivateBackgroundColor,
                                            width:this.state.deactivateBackWidthAnim,
                                            height:this.props.switchHeight,
                                            marginRight:-this.props.activateBorderWidth,
                                            marginTop:-this.props.activateBorderWidth,
                                            borderRadius: this.props.buttonRadius,
                                            borderColor:this.props.deactivateBorderColor,
                                            borderWidth:this.props.deactivateBorderWidth,}}>
                    </Animated.View>
                </View>
                <Animated.View style={{width: this.props.buttonWidth,
                                        height: this.props.buttonHeight,
                                        position:'absolute',
                                        top:0,
                                        left:0,
                                        transform: [{ translateX: this.state.buttonPositionAnim }],
                                        borderRadius: this.props.buttonRadius,
                                        backgroundColor: this.props.buttonBackgroundColor,
                                        borderColor:this.props.buttonBorderColor,
                                        borderWidth:this.props.buttonBorderWidth,}}
                    {...this._panResponder.panHandlers}/>
            </View>
          </View>
        );
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: this._handlePanResponderGrant.bind(this),
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
        });
    }

    _handlePanResponderGrant(e, gestureState){
    }

    _handlePanResponderEnd(e, gestureState) {
        var deactivateBackWidthAnimEndValue = !this.state.initValue ? this.props.buttonWidth : this.props.switchWidth;
        var buttonPositionAnimEndValue = !this.state.initValue ? this.props.switchWidth-this.props.buttonWidth : 0;
        Animated.parallel([
            Animated.timing(
                this.state.deactivateBackWidthAnim,
                {
                    toValue: deactivateBackWidthAnimEndValue,
                    duration: this.props.animationTime,
                }),
        Animated.timing(
            this.state.buttonPositionAnim,
            {
                toValue: buttonPositionAnimEndValue,
                duration: this.props.animationTime,
            }
        )]).start((arg) => {
            if (arg.finished) {
                this.setState({
                    deactivateBackWidthAnim: new Animated.Value(deactivateBackWidthAnimEndValue),
                    buttonPositionAnim: new Animated.Value(buttonPositionAnimEndValue),
                    initValue: !this.state.initValue,
                });
                this.props.onValueChange(this.state.initValue);
            }
        });
    }
}

Example.defaultProps = {
    switchWidth: 55,
    switchHeight: 30,
    activateBackgroundColor: '#3281DE',
    deactivateBackgroundColor: '#f9f9f9',
    activateBorderWidth: 0.5,
    activateBorderColor: '#d1d3d4',
    deactivateBorderWidth: 0.5,
    deactivateBorderColor: '#d1d3d4',

    buttonWidth:30,
    buttonHeight:30,
    buttonRadius: 15,
    buttonBackgroundColor: '#ffffff',
    buttonBorderWidth: 0.5,
    buttonBorderColor: '#d1d3d4',

    initValue: false,
    animationTime:100,

    onValueChange:()=>{},
}

AppRegistry.registerComponent('Example', () => Example);
