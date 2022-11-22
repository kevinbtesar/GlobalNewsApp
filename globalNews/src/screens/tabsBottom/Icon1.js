import React from 'react';
import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
// import {styles} from '../../styles/styles';

Icon1 = () => (
  <View style={styles.center}>
    <Text style={styles.title}>Icon 1</Text>
  </View>
);
const styles = StyleSheet.create({
  center: {
    flex: 1,
    margin: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default Icon1;

