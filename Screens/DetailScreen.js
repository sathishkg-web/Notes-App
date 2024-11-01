import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailScreen = ({ navigation, route }) => {
  const { item } = route.params;
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ padding: 20, borderBottomWidth: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 6 }}>
            {item.title}
          </Text>
          <Text>{item.note}</Text>
          <Text style={{color:'grey',marginTop:20}}>
            Last Modified {`\n`}{new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;
