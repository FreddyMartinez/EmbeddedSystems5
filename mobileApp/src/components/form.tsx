import React from 'react';
import { useEffect, useState } from 'react';
import { getInitialState, toggleLight } from '../services/lightService';
import { State } from './types';
import { manager } from '../services/SSEManager';
import { StyleSheet, Switch, Text, View } from 'react-native';

const getLabelText = (state: boolean) => (state ? 'encendido' : 'apagado');

export function Form() {
  const [red, setRed] = useState(false);
  const [green, setGreen] = useState(false);

  const toggleRedLed = () => {
    toggleLight(red, 'red')
      .then((res) => {
        console.log(res);
        setRed((c) => !c);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const toggleGreenLed = () => {
    toggleLight(green, 'green')
      .then(() => {
        setGreen((c) => !c);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const observer = (state: State) => {
    setRed(!state.red);
    setGreen(!state.green);
  };

  useEffect(() => {
    getInitialState().then((state: State) => {
      setRed(!state.red);
      setGreen(!state.green);
    });
    manager.subscribe(observer);

    return () => {
      manager.unsubscribe(observer);
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.ledContainer}>
        <Text style={styles.label}>Led Rojo {getLabelText(red)}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={red ? '#de0202' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleRedLed}
          value={red}
        />
      </View>
      <View style={styles.ledContainer}>
        <Text style={styles.label}>Led Verde {getLabelText(green)}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={green ? '#02de23' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleGreenLed}
          value={green}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: 'black',
  },
});
