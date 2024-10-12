document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const wallpapersPerPage = 10;
    let wallpapers = [];
    let filteredWallpapers = [];
    const defaultThumbnail = '/themes-nav/wallpapers/animated/thumbnails/backgroundmin1.png'; // Ruta de la imagen predeterminada

    // Cargar JSON
    fetch('/themes-nav/wallpapers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el JSON');
            }
            return response.json();
        })
        .then(data => {
            wallpapers = data;
            filteredWallpapers = wallpapers;
            renderWallpapers();
        })
        .catch(error => {
            console.error('Error al cargar los wallpapers:', error);
        });

    // Mostrar wallpapers
    function renderWallpapers() {
        const wallpapersContainer = document.getElementById('wallpapers');
        wallpapersContainer.innerHTML = '';

        const start = (currentPage - 1) * wallpapersPerPage;
        const end = start + wallpapersPerPage;
        const wallpapersToShow = filteredWallpapers.slice(start, end);

        wallpapersToShow.forEach(wallpaper => {
            const wallpaperElement = document.createElement('div');
            wallpaperElement.classList.add('wallpaper');
            
            // Aquí creamos la miniatura por defecto y el GIF para el hover
            wallpaperElement.innerHTML = `
                <img src="${wallpaper.thumbnail}" alt="${wallpaper.name}" class="gif-thumbnail" 
                    data-static="${wallpaper.thumbnail}" data-gif="${wallpaper.url}">
                <p>${wallpaper.name}</p>
                <span class="tag">${wallpaper.type}</span>
                <span class="tag">${wallpaper.theme}</span>
            `;
            wallpapersContainer.appendChild(wallpaperElement);

            // Obtener la imagen y agregar el evento onerror
            const img = wallpaperElement.querySelector('img');
            img.onerror = () => {
                img.src = defaultThumbnail; // Cargar imagen predeterminada si falla la miniatura
            };

            // Agregar eventos de hover para cambiar la imagen
            img.addEventListener('mouseenter', () => {
                img.src = wallpaper.url; // Mostrar el GIF al pasar el mouse
            });

            img.addEventListener('mouseleave', () => {
                img.src = wallpaper.thumbnail; // Volver a la miniatura al salir el mouse
            });
        });

        document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(filteredWallpapers.length / wallpapersPerPage)}`;
        document.getElementById('prev').disabled = currentPage === 1;
        document.getElementById('next').disabled = currentPage === Math.ceil(filteredWallpapers.length / wallpapersPerPage);
    }

    // Mostrar popup
    function showPopup(url, name) {
        document.getElementById('popup-image').src = url;
        document.getElementById('popup-title').textContent = name;
        document.getElementById('wallpaper-popup').style.display = 'block';
        document.getElementById('popup-background').style.display = 'block';

        // Descargar y compartir
        document.getElementById('download-btn').onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            link.click();
        };

        document.getElementById('share-btn').onclick = () => {
            alert('Sharing wallpaper: ' + name); // Aquí puedes integrar funcionalidades de compartir
        };

        // Cerrar el popup al hacer clic fuera de él
        document.getElementById('popup-background').onclick = closePopup;
    }

    // Cerrar popup
    function closePopup() {
        document.getElementById('wallpaper-popup').style.display = 'none';
        document.getElementById('popup-background').style.display = 'none';
    }

    document.getElementById('close-popup').onclick = closePopup;

    // Búsqueda
    document.getElementById('search').addEventListener('input', function(event) {
        const searchTerm = event.target.value.toLowerCase();
        filteredWallpapers = wallpapers.filter(wallpaper => wallpaper.name.toLowerCase().includes(searchTerm));
        currentPage = 1;
        renderWallpapers();
    });

    // Paginación
    document.getElementById('prev').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderWallpapers();
        }
    });

    document.getElementById('next').addEventListener('click', function() {
        if (currentPage < Math.ceil(filteredWallpapers.length / wallpapersPerPage)) {
            currentPage++;
            renderWallpapers();
        }
    });

    // Redirigir al hacer clic en descargar temas
    document.getElementById('download').addEventListener('click', function() {
        window.location.href = 'https://example.com'; // Cambiar por tu enlace
    });

    // Filtrar por tipo y tema
    document.getElementById('typeFilter').addEventListener('change', filterWallpapers);
    document.getElementById('themeFilter').addEventListener('change', filterWallpapers);

    function filterWallpapers() {
        const typeFilter = document.getElementById('typeFilter').value;
        const themeFilter = document.getElementById('themeFilter').value;

        filteredWallpapers = wallpapers.filter(wallpaper => {
            const matchesType = typeFilter === "" || wallpaper.type === typeFilter;
            const matchesTheme = themeFilter === "" || wallpaper.theme === themeFilter;
            return matchesType && matchesTheme;
        });

        currentPage = 1;
        renderWallpapers();
    }
});
