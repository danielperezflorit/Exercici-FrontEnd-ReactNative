import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { fetchUsers } from "../services/userService"; // Servicio para obtener usuarios
import { fetchExperiences } from "../services/experienceService"; // Servicio para obtener experiencias

export default function SearchScreen() {
  const [query, setQuery] = useState(""); // Nombre del usuario para buscar
  const [users, setUsers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);

  useEffect(() => {
    // Carga inicial de usuarios y experiencias
    const loadData = async () => {
      try {
        const usersData = await fetchUsers();
        const experiencesData = await fetchExperiences();
        setUsers(usersData);
        setExperiences(experiencesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    loadData();
  }, []);

  const handleSearch = () => {
    // Filtra los usuarios por el nombre ingresado
    const foundUser = users.find((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );

    if (foundUser) {
      const userExperiences = experiences.filter((exp) =>
        exp.participants.includes(foundUser._id)
      );
      setFilteredExperiences(userExperiences);
    } else {
      setFilteredExperiences([]); // No se encontraron experiencias
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Experiencias</Text>
      <TextInput
        placeholder="Nombre del usuario"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredExperiences}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.experienceItem}>
            <Text style={styles.label}>Propietario: {item.owner}</Text>
            <Text style={styles.label}>Descripción: {item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>No se encontraron experiencias.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#42f44b",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  experienceItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  noResults: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    fontStyle: "italic",
  },
});
