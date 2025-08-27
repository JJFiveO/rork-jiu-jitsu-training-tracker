import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('GoTrain', () => App);

// Run the app
AppRegistry.runApplication('GoTrain', {
  rootTag: document.getElementById('root'),
});