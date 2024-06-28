import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getresponse } from '../api/ciudadanoApi';
import { useIsFocused } from '@react-navigation/native';

const ResponsesScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [responses, setResponses] = useState([]);

  const fetchResponses = async () => {
    try {
      const response = await getresponse();
      console.log('Fetched responses:', response); // Verifica los datos obtenidos de la API
      setResponses(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchResponses();
    }
  }, [isFocused]);

  const renderResponse = ({ item }) => (
    <ResponseCard response={item} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Responses Dashboard</Text>
      {responses.length === 0 ? (
        <Text style={styles.noResponsesText}>No responses found.</Text>
      ) : (
        <FlatList
          data={responses}
          renderItem={renderResponse}
          keyExtractor={(item) => item._id.toString()}
        />
      )}
    </View>
  );
};

const ResponseCard = ({ response }) => {
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
    <View style={styles.responseCard}>
      <Text style={styles.responseTitle}>
        {showFullDescription ? response.response : `${response.response.substring(0, 100)}...`}
      </Text>
      {response.response.length > 100 && (
        <TouchableOpacity onPress={toggleDescription}>
          <Text style={styles.toggleText}>{showFullDescription ? 'Ver menos' : 'Ver más'}</Text>
        </TouchableOpacity>
      )}
      <Text>Complaint: {response.complaint_id ? response.complaint_id.description : 'No description'}</Text>
      <Text>Type: {response.complaint_id ? response.complaint_id.type_id.name : 'No type'}</Text>
      <Text>Created By: {response.createdBy ? `${response.createdBy.name} ${response.createdBy.lastname}` : 'Unknown'}</Text>
      <Text style={getStatusStyle(response.complaint_id ? response.complaint_id.status_id.name : 'No status')}>Status: {response.complaint_id ? response.complaint_id.status_id.name : 'No status'}</Text>
      
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
  noResponsesText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  responseCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  toggleText: {
    color: 'blue',
    marginBottom: 5,
  },
});

export default ResponsesScreen;
