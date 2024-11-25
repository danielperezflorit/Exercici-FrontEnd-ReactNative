import axios from "axios";

//const API_URL = "http://10.0.2.2:3000/api/experiencias";
const API_URL = "http://localhost:3000/api/experiencias";

// Obtener todas las experiencias desde la API
export const fetchExperiences = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Devolvemos los datos de las experiencias
  } catch (error) {
    console.error("Error al obtener las experiencias:", error);
    throw error;
  }
};

// Agregar una nueva experiencia a la API
export const addExperience = async (newExperience) => {
  try {
    const response = await axios.post(API_URL, newExperience);
    const nuevaExperiencia = response.data;

    // Actualizar a los usuarios participantes con la nueva experiencia
    const { participants } = newExperience;
    if (participants && participants.length > 0) {
      await Promise.all(
        participants.map((userId) =>
          axios.post(
            //`http://10.0.2.2:3000/api/user/addExperiencias/${userId}/${nuevaExperiencia._id}`,
            `http://localhost:3000/api/user/addExperiencias/${userId}/${nuevaExperiencia._id}`,
          ),
        ),
      );
    }
    return nuevaExperiencia;
  } catch (error) {
    console.error("Error al agregar experiencia:", error);
    throw error;
  }
};

// Eliminar una experiencia de la API
export const deleteExperience = async (experienceId) => {
  try {
    if (!experienceId) {
      throw new Error("El ID de la experiencia es indefinido");
    }

    // Primero obtenemos la experiencia completa para extraer los participantes
    const experienceResponse = await axios.get(`${API_URL}/${experienceId}`);
    const participants = experienceResponse.data.participants; // Obtenemos los participantes de la experiencia

    // Verificamos si el vector de participantes existe y tiene usuarios
    if (participants && participants.length > 0) {
      // Recorremos el vector de participantes para eliminar la experiencia de sus arrays de experiencias
      await Promise.all(
        participants.map(async (userId) => {
          await axios.delete(
            //`http://10.0.2.2:3000/api/user/delParticipant/${userId}/${experienceId}`,
            `http://localhost:3000/api/user/delParticipant/${userId}/${experienceId}`,
          );
        }),
      );
    }

    // Finalmente eliminamos la experiencia en sí
    await axios.delete(`${API_URL}/${experienceId}`);
  } catch (error) {
    console.error("Error al eliminar experiencia:", error);
    throw error;
  }
};
