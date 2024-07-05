import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getAllComplaints } from '../api/ciudadanoApi';
import ComplaintFormModal from '../components/ComplaintFormModal';
import { useIsFocused } from '@react-navigation/native';

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const [complaints, setComplaints] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const fetchComplaints = async () => {
    try {
      const response = await getAllComplaints();

      const sortedComplaints = response.sort((a, b) => {
        if (a.status === 'realizado' && b.status !== 'realizado') {
          return 1;
        }
        if (a.status !== 'realizado' && b.status === 'realizado') {
          return -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setComplaints(sortedComplaints);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchComplaints();
    }
  }, [isFocused]);

  const renderComplaint = ({ item }) => (
    <ComplaintCard complaint={item} />
  );

  const resetForm = () => {
    setDescription('');
    setSelectedType('');
    setLocation('');
    setLatitude(null);
    setLongitude(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaint Dashboard</Text>
      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item._id.toString()}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setModalVisible(true);
          resetForm();
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <ComplaintFormModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        resetForm={resetForm}
        description={description}
        setDescription={setDescription}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        location={location}
        setLocation={setLocation}
        latitude={latitude}
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
      />
    </View>
  );
};

const ComplaintCard = ({ complaint }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pendiente':
        return { color: 'red' };
      case 'en proceso':
        return { color: 'blue' };
      case 'realizado':
        return { color: 'green' };
      default:
        return { color: 'black' };
    }
  };

  return (
    <View style={styles.complaintCard}>
      <Text style={styles.complaintTitle}>
        {showFullDescription ? complaint.description : `${complaint.description.substring(0, 100)}...`}
      </Text>
      {complaint.description.length > 100 && (
        <TouchableOpacity onPress={toggleDescription}>
          <Text style={styles.toggleText}>{showFullDescription ? 'Ver menos' : 'Ver más'}</Text>
        </TouchableOpacity>
      )}
      <Text>{`${complaint.location_coordinates.lat}, ${complaint.location_coordinates.lon}`}</Text>
      <Text>Type: {complaint.type}</Text>
      <Text style={getStatusStyle(complaint.status)}>Status: {complaint.status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  complaintCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  toggleText: {
    color: 'blue',
    marginBottom: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 30,
  },
});

export default HomeScreen;
