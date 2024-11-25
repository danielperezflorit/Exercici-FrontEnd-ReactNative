import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { fetchUsers } from "../services/userService";
import { fetchExperiences } from "../services/experienceService";

export default function SearchExperiences({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Obtener usuarios y experiencias
      const users = await fetchUsers();
      const experiences = await fetchExperiences();

      // Filtrar usuarios por nombre
      const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase())
      );

      // Obtener IDs de los usuarios filtrados
      const userIds = filteredUsers.map((user) => user._id);

      // Filtrar experiencias donde el propietario o participantes coincidan
      const filteredExperiences = experiences.filter(
        (exp) =>
          userIds.includes(exp.owner) ||
          exp.participants.some((id) => userIds.includes(id))
      );

      setResults(filteredExperiences);
    } catch (error) {
      console.error("Error al buscar experiencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Buscar experiencias por usuario:</Text>
      <TextInput
        placeholder="Ingresa el nombre del usuario"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />
      <Button title="Buscar" onPress={handleSearch} />

      {loading ? (
        <Text style={styles.loading}>Cargando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>Descripción: {item.description}</Text>
              <Text style={styles.resultText}>Propietario: {item.owner}</Text>
              <Text style={styles.resultText}>Participantes: </Text>
              {item.participants.length > 0 ? (
                item.participants.map((participantId) => (
                  <Text key={participantId} style={styles.participant}>
                    - {participantId}
                  </Text>
                ))
              ) : (
                <Text style={styles.participant}>Sin participantes</Text>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noResults}>No se encontraron resultados</Text>
          }
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  resultItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  participant: {
    fontSize: 14,
    color: "#666",
  },
  noResults: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#666",
  },
  backButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
