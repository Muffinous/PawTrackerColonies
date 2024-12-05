export interface Cat {
  id?: string | null; // ID opcional
  img: string | null; // URL de la imagen o base64
  name: string; // Nombre del gato
  furColor?: string | null; // Color del pelaje
  spayedNeutered?: boolean | null; // Marca de castración (true = castrado, false = no castrado)
  approximateAge?: number | null; // Edad aproximada en años
  gender?: 'M' | 'F' | null; // Género del gato
  observations?: string | null; // Observaciones adicionales (opcional)
}
