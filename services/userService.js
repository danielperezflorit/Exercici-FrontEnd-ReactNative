import axios from "axios";

/*const API_URL = "http://10.0.2.2:3000/api/user"; 
const EXPERIENCE_URL = "http://10.0.2.2:3000/api/experiencias";*/
const API_URL = "http://localhost:3000/api/user"; 
const EXPERIENCE_URL = "http://localhost:3000/api/experiencias";

// Obtener un usuario por su ID
export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data.name; 
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
};

// Obtener la lista de todos los usuarios
export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Agregar un nuevo usuario
export const addUser = async (newUser) => {
  try {
    await axios.post(API_URL, newUser);
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error("El ID del usuario es indefinido");
    }

    // Primero obtenemos todas las experiencias en las que el usuario es participante
    const experiencesResponse = await axios.get(`${EXPERIENCE_URL}`);
    const experiences = experiencesResponse.data;

    // Recorremos las experiencias y eliminamos al usuario de los participantes
    await Promise.all(
      experiences.map(async (experience) => {
        if (experience.participants.includes(userId)) {
          await axios.delete(
            `${EXPERIENCE_URL}/delParticipant/${experience._id}/${userId}`
          );
        }
      })
    );

    // Finalmente eliminamos al usuario de la base de datos
    await axios.delete(`${API_URL}/${userId}`);
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};
