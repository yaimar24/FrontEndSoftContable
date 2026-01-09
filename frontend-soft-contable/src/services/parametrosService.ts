const BASE_URL = import.meta.env.VITE_API_URL;

export const getParametros = async () => {
  try {
    const res = await fetch(`${BASE_URL}/Parametros/parametros`);
    if (!res.ok) throw new Error("Error al obtener parámetros");
    return await res.json();
  } catch (error) {
    console.error("Error en parametroService:", error);
    throw error;
  }
};