declare module 'react-native-mathjax' {
    import { Component } from 'react';
    interface MathJaxProps {
      html: string;
    }
    export default class MathJax extends Component<MathJaxProps> {}
  }
