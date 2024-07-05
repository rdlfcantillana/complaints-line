import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { getComplaintTypes, createComplaint } from '../api/ciudadanoApi';

const ComplaintFormModal = ({
  isVisible,
  onClose,
  resetForm,
  description,
  setDescription,
  selectedType,
  setSelectedType,
  location,
  setLocation,
  latitude,
  setLatitude,
  longitude,
  setLongitude
}) => {
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

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
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (isVisible) {
      resetForm();
    }
  }, [isVisible]);

  const handleLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLocation(`${location.coords.latitude}, ${location.coords.longitude}`);
    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
    setLocation(`${latitude}, ${longitude}`);
    setRegion({
      ...region,
      latitude,
      longitude,
    });
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
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
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
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          onPress={handleMapPress}
        >
          {latitude && longitude && (
            <Marker coordinate={{ latitude, longitude }} />
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onClose} />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    maxHeight: '90%',
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
    marginBottom: 10,
  },
  locationInput: {
    flex: 1,
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ComplaintFormModal;
