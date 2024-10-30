document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const wallpapersPerPage = 6;
    let wallpapers = [];
    let filteredWallpapers = [];
    const defaultThumbnail = '/themes-nav/wallpapers/animated/thumbnails/backgroundmin1.png';
    const baseURL = window.location.origin; // Agregar el dominio actual

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
            filteredWallpapers = wallpapers; // Inicialmente, todos los wallpapers están disponibles
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
            const isGif = wallpaper.url.endsWith('.gif');

            wallpaperElement.innerHTML = `
                <img src="${isGif ? wallpaper.thumbnail : wallpaper.url}" alt="${wallpaper.name}" class="gif-thumbnail"
                    data-static="${wallpaper.thumbnail}" data-gif="${wallpaper.url}">
                <p>${wallpaper.name}</p>
                <span class="tag">${wallpaper.type}</span>
                <span class="tag">${wallpaper.theme}</span>
            `;
            wallpapersContainer.appendChild(wallpaperElement);

            const img = wallpaperElement.querySelector('img');
            img.onerror = () => {
                img.src = isGif ? defaultThumbnail : wallpaper.url;
            };

            if (isGif) {
                img.addEventListener('mouseenter', () => img.src = wallpaper.url);
                img.addEventListener('mouseleave', () => img.src = wallpaper.thumbnail);
            }

            img.addEventListener('click', () => showPopup(wallpaper.url, wallpaper.name, isGif));
        });

        document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(filteredWallpapers.length / wallpapersPerPage)}`;
        document.getElementById('prev').disabled = currentPage === 1;
        document.getElementById('next').disabled = currentPage === Math.ceil(filteredWallpapers.length / wallpapersPerPage);
    }

    // Mostrar popup
    function showPopup(url, name, isGif) {
        const fullURL = baseURL + url; // URL completa con el dominio
        document.getElementById('popup-image').src = url;
        document.getElementById('popup-title').textContent = name;
        document.getElementById('wallpaper-popup').style.display = 'block';
        document.getElementById('popup-background').style.display = 'block';

        // Descargar
        document.getElementById('download-btn').onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = name + (isGif ? '.gif' : '.png');
            link.click();
        };

        // Copiar URL
        document.getElementById('share-btn').textContent = 'Copy URL';
        document.getElementById('share-btn').onclick = async () => {
            try {
                await navigator.clipboard.writeText(fullURL);
                alert('URL copied to clipboard: ' + fullURL);
            } catch (err) {
                console.error('Failed to copy URL:', err);
            }
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

    // Búsqueda y filtrado
    function filterWallpapers() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        const themeFilter = document.getElementById('themeFilter').value;

        filteredWallpapers = wallpapers.filter(wallpaper => {
            const matchesSearch = wallpaper.name.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === "" || wallpaper.type === typeFilter;
            const matchesTheme = themeFilter === "" || wallpaper.theme === themeFilter;
            return matchesSearch && matchesType && matchesTheme;
        });

        currentPage = 1; // Reiniciar a la primera página después de filtrar
        renderWallpapers();
    }

    // Event listeners para los filtros
    document.getElementById('search').addEventListener('input', filterWallpapers);
    document.getElementById('typeFilter').addEventListener('change', filterWallpapers);
    document.getElementById('themeFilter').addEventListener('change', filterWallpapers);

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
});
