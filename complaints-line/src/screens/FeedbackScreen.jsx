import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getFeedback } from '../api/ciudadanoApi';
import { useIsFocused } from '@react-navigation/native';

const FeedbackScreen = ({ navigation }) => {
  
  const isFocused = useIsFocused();
  const [complaints, setComplaints] = useState([]);


  const fetchComplaints = async () => {
    try {
      const response = await getFeedback();

      // Ordenar las quejas por fecha de creación, más recientes primero
      const sortedComplaints = response.sort((a, b) => {
        if (a.status_id.name === 'realizado' && b.status_id.name !== 'realizado') {
          return 1; // Mueve las quejas realizadas hacia abajo
        }
        if (a.status_id.name !== 'realizado' && b.status_id.name === 'realizado') {
          return -1; // Mueve las quejas no realizadas hacia arriba
        }
        return new Date(b.createdAt) - new Date(a.createdAt); // Ordenar por fecha de creación, más recientes primero
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback Dashboard</Text>
      <FlatList
        data={complaints}
        renderItem={renderComplaint}
        keyExtractor={(item) => item._id.toString()}
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
      <Text>Type: {complaint.type_id.name}</Text>
      <Text style={getStatusStyle(complaint.status_id.name)}>Status: {complaint.status_id.name}</Text>
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
});

export default FeedbackScreen;
