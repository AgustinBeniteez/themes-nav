import os

# Ruta de la carpeta donde están los archivos
folder_path = 'A:/ElementsCssDAJ - Github Conected/themes-nav/wallpapers/static'  # Cambia esto a la ruta de tu carpeta

# Obtener una lista de archivos en la carpeta
files = os.listdir(folder_path)

# Renombrar los archivos
for i, file in enumerate(files):
    # Asegúrate de que los archivos sean del tipo que deseas renombrar
    if file.endswith('.gif') or file.endswith('.png'):
        new_name = f"background{i + 1}{file[-4:]}"  # Mantiene la extensión original
        old_file = os.path.join(folder_path, file)
        new_file = os.path.join(folder_path, new_name)
        os.rename(old_file, new_file)
        print(f'Renombrado: {old_file} a {new_file}')

print("Renombrado completado.")
