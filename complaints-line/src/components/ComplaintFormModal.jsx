import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { getComplaintTypes, createComplaint } from '../api/ciudadanoApi';

const ComplaintFormModal = ({ isVisible, onClose }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchComplaintTypes = async () => {
      try {
        const types = await getComplaintTypes();
        setComplaintTypes(types);
      } catch (error) {
        console.error(error);
        alert('Error fetching complaint types: ' + error.message);
      }
    };

    fetchComplaintTypes();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocation(`${location.coords.latitude}, ${location.coords.longitude}`);
    })();
  }, []);

  const handleLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLocation(`${location.coords.latitude}, ${location.coords.longitude}`);
  };

  const handleSubmit = async () => {
    try {
      const complaintData = {
        description,
        type_id: selectedType,
        location_coordinates: { lat: latitude, lon: longitude },
      };
      console.log('Complaint Data:', complaintData);
      const response = await createComplaint(complaintData);
      alert(response.message);
      onClose();
    } catch (error) {
      alert('Error creating complaint: ' + error.message);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Report a Complaint</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe your complaint..."
          value={description}
          onChangeText={setDescription}
        />
        <Picker
          selectedValue={selectedType}
          style={styles.input}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          <Picker.Item label="Select Complaint Type" value="" />
          {complaintTypes.map((type) => (
            <Picker.Item key={type._id} label={type.name} value={type._id} />
          ))}
        </Picker>
        <View style={styles.locationContainer}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
            editable={false}
          />
          <TouchableOpacity onPress={handleLocation}>
            <Icon name="location-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onClose} />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ComplaintFormModal;
