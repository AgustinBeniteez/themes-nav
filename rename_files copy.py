from PIL import Image
import os
import json

# Carpeta donde se encuentran los archivos GIF
input_directory = 'wallpapers/animated/'
# Carpeta donde se guardarán las miniaturas
output_directory = 'wallpapers/animated/thumbnails/'

# Asegúrate de que la carpeta de salida exista
os.makedirs(output_directory, exist_ok=True)

# Lista para almacenar la información de los wallpapers
wallpapers_data = []

# Procesar cada archivo GIF en la carpeta
for i in range(1, 22):  # Del 1 al 21
    filename = f'background{i}.gif'
    gif_path = os.path.join(input_directory, filename)
    
    # Verificar si el archivo GIF existe
    if os.path.exists(gif_path):
        with Image.open(gif_path) as img:
            # Seleccionar el primer cuadro
            img.seek(0)  # Asegúrate de que estás en el primer cuadro

            # Redimensionar a 1920x1080
            thumbnail = img.resize((1920, 1080), Image.LANCZOS)

            # Crear la ruta para la miniatura
            thumbnail_filename = f'backgroundmin{i}.png'
            thumbnail_path = os.path.join(output_directory, thumbnail_filename)
            thumbnail.save(thumbnail_path, 'PNG')  # Guardar como PNG

            # Agregar la información al JSON
            wallpaper_info = {
                "name": f"background{i}",
                "url": gif_path,
                "type": "animated",
                "theme": "landscapes",
                "thumbnail": thumbnail_path.replace('\\', '/')  # Reemplazar para compatibilidad en JSON
            }
            wallpapers_data.append(wallpaper_info)

        print(f'Miniatura creada: {thumbnail_path}')
    else:
        print(f'El archivo {filename} no se encontró.')

# Guardar el JSON
json_output_path = 'wallpapers/animated/wallpapers_data.json'
with open(json_output_path, 'w') as json_file:
    json.dump(wallpapers_data, json_file, indent=4)

print(f'Data JSON guardada en: {json_output_path}')
