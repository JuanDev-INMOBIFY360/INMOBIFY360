import { uploadImage, deleteImage } from './src/config/cloudinary.js';

// Imagen de prueba 1x1 pixel rojo en base64
const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

async function testCloudinaryUpload() {
  console.log('🧪 Iniciando prueba de Cloudinary...\n');

  try {
    // Probar subida
    console.log('📤 Subiendo imagen de prueba...');
    const result = await uploadImage(testImage, 'test');
    console.log('✅ Imagen subida exitosamente!');
    console.log('URL:', result.url);
    console.log('Public ID:', result.publicId);
    console.log('');

    // Probar eliminación
    console.log('🗑️  Eliminando imagen de prueba...');
    await deleteImage(result.publicId);
    console.log('✅ Imagen eliminada exitosamente!');
    console.log('');

    console.log('🎉 Todas las pruebas pasaron correctamente!');
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    console.error('Detalles:', error.error || error.message);
    process.exit(1);
  }
}

testCloudinaryUpload();