declare module 'react-native-switch-pro' {
  import { Component } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';
  export interface SwitchProps {
    width?: number;
    height?: number;
    value?: boolean;
    disabled?: boolean;
    circleColorActive?: string;
    circleColorInactive?: string;
    onAsyncPress?: (cb: (result: boolean) => void) => void;
    onSyncPress?: (value: boolean) => void;
    style?: StyleProp<ViewStyle>;
    circleStyle?: StyleProp<ViewStyle>;
  }

  export default class Switch extends Component<SwitchProps> {}
}
