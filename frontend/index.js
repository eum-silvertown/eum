/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import axios from 'axios';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';

// baseURL 설정
axios.defaults.baseURL = Config.BACKEND_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

messaging().setBackgroundMessageHandler(async msg => {
  console.log(msg)  
});

AppRegistry.registerComponent(appName, () => App);