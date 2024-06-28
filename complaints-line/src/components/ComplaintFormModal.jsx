import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Geolocation from 'react-native-geolocation-service';
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

  const handleLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (error) => {
        console.error(error);
        alert('Error getting location: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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
