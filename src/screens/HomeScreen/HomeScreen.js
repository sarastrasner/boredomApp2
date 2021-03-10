import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import styles from './styles';
import { firebase } from '../../firebase/config';
import RNShake from 'react-native-shake';

export default function HomeScreen(props) {
  const [entityText, setEntityText] = useState('');
  const [weight, setWeight] = useState('');
  const [entities, setEntities] = useState([]);
  const [weightedItems, setWeightedItems] = useState([]);

  useEffect(() => {
    console.log('Meow! The component has mounted');
    RNShake.addEventListener('ShakeEvent', () => {
      console.log('You shook the phone!');
    });
    return () => {
      console.log('Boop! The component has unmounted');
    };
  }, []);

  const entityRef = firebase.firestore().collection('entities');
  const userID = props.extraData.id;

  useEffect(() => {
    entityRef
      .where('authorID', '==', userID)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const newEntities = [];
          querySnapshot.forEach(doc => {
            const entity = doc.data();
            entity.id = doc.id;
            newEntities.push(entity);
          });
          setEntities(newEntities);
        },
        error => {
          console.log(error);
        }
      );
  }, []);

  const resetWeightedItemsState = () => setWeightedItems([]);

  const generateWeightedItemsList = items => {
    resetWeightedItemsState();
    console.log("Has the array been reset?", weightedItems);
    console.log('------------');
    items.forEach(item => {
      item = { ...item, newWeight: item.weight };
      //console.log(item);
      while (item.newWeight > 0) {
        setWeightedItems([...weightedItems, item]);
        item.newWeight--;
        // console.log(item.text);
      }
    });
    // weightedItems.forEach(thing => {
    //   let count = 0;
    //     console.log(count++, thing.text);
    //   })
    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log("Here's the NEW stuff", weightedItems);
  };

  const onAddButtonPress = () => {
    if (entityText && entityText.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        text: entityText,
        authorID: userID,
        createdAt: timestamp,
        weight: weight,
      };
      entityRef
        .add(data)
        .then(_doc => {
          setEntityText('');
          Keyboard.dismiss();
        })
        .catch(error => {
          alert(error);
        });
    }
  };

  const onRandomTaskButtonPress = () => {
    generateWeightedItemsList(entities);
    let randomIndex = parseInt(Math.random() * (weightedItems.length - 1));
    alert(weightedItems[randomIndex].text);
  };

  const renderEntity = ({ item }) => {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.entityText}>{item.text}</Text>
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add new item"
            required
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setEntityText(text)}
            value={entityText}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            required
            placeholder="Add a weight"
            keyboardType="number-pad"
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setWeight(text)}
            value={weight}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {entities && (
          <View style={styles.listContainer}>
            <FlatList
              data={entities}
              renderItem={renderEntity}
              keyExtractor={item => item.id}
              removeClippedSubviews={true}
            />
          </View>
        )}
      </View>
      <View style={styles.footerView}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={onRandomTaskButtonPress}
        >
          <Text style={styles.buttonText}>Get Random Task</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
