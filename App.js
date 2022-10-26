import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Header, Input, Button, ListItem, Icon } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglist.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [itemList, setItemList] = useState([]);

   useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, product text, amount text);');
    }, null, updateList); 
  }, []);

  // Save shoppinglist
  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);',
        [product, amount]);
    },  updateList);
  }

  // Update shoppinglist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
        setItemList(rows._array)
      ); 
    });
  }

  // Delete shoppinglist
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  const renderitem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
      </ListItem.Content>
            <ListItem onPress={() => deleteItem(item.id)}>
              <Icon name="delete" size={20} color='red' />
            </ListItem>
    </ListItem>
  )

  return (
    <View>
      <Header
        centerComponent={{ text: 'SHOPPINGLIST', style: { color: '#fff' } }}
      />

      <View>
        <Input
          placeholder='Product'
          label='Product'
          onChangeText={ product => setProduct(product)}
          value={product} 
        />

        <Input
          placeholder='Amount'
          label='Amount'
          onChangeText={ amount => setAmount(amount)}
          value={amount} 
          />

        <Button icon={{name: 'save'}} onPress={saveItem} title='Save' />
  
          <FlatList
            keyExtractor={item => item.id}
            renderItem = {renderitem}
            data={itemList}
            ItemSeparatorComponent={listSeparator}
          />
        </View>
      </View>
    );
  }


