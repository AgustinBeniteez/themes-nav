document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    const wallpapersPerPage = 6;
    let wallpapers = [];
    let filteredWallpapers = [];
    const defaultThumbnail = '../wallpapers/animated/thumbnails/backgroundmin1.png';
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
        if (wallpaper.type === 'animated') {
            wallpaperElement.classList.add('animated');
        }
            const isGif = wallpaper.url.endsWith('.gif');

            wallpaperElement.innerHTML = `
                <img src="${isGif ? wallpaper.thumbnail : wallpaper.url}" alt="${wallpaper.name}" class="gif-thumbnail"
                    data-static="${wallpaper.thumbnail}" data-gif="${wallpaper.url}">
                <p>${wallpaper.name}</p>
                <span class="tag">${wallpaper.type}</span>
                ${Array.isArray(wallpaper.theme) ? 
                    wallpaper.theme.map(theme => `<span class="tag">${theme}</span>`).join('') : 
                    `<span class="tag">${wallpaper.theme}</span>`}
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

    function showPopup(url, name, isGif) {
        document.getElementById('popup-image').src = url;
        document.getElementById('popup-title').textContent = name;
        document.getElementById('wallpaper-popup').style.display = 'block';
        document.getElementById('popup-background').style.display = 'block';
    
        // Corregir la URL eliminando los dos puntos después de .io
        const baseUrl = 'https://agustinbeniteez.github.io';
        const cleanUrl = url.replace('../', '/');
        const fullURL = baseUrl + cleanUrl;
    
        // Descargar imagen
        document.getElementById('download-btn').onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = name + (isGif ? '.gif' : '.png');
            link.click();
        };
    
        // Copiar URL al portapapeles
        document.getElementById('copy-btn').onclick = () => {
            navigator.clipboard.writeText(fullURL)
                .catch(err => console.error('Error al copiar la URL:', err));
        };
    
        // Cerrar el popup al hacer clic fuera de él
        document.getElementById('popup-background').onclick = closePopup;
    }
    
    document.getElementById('close-popup').onclick = closePopup;
    

    // Cerrar popup
    function closePopup() {
        document.getElementById('wallpaper-popup').style.display = 'none';
        document.getElementById('popup-background').style.display = 'none';
    }

    document.getElementById('close-popup').onclick = closePopup;

    // Búsqueda y filtrado
    function filterWallpapers() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const staticChecked = document.getElementById('staticFilter').checked;
        const animatedChecked = document.getElementById('animatedFilter').checked;
        const themeFilter = document.getElementById('themeFilter').value;

        filteredWallpapers = wallpapers.filter(wallpaper => {
            const matchesSearch = wallpaper.name.toLowerCase().includes(searchTerm);
            const matchesType = (staticChecked && wallpaper.type === 'static') || (animatedChecked && wallpaper.type === 'animated');
            const matchesTheme = themeFilter === "" || 
                (Array.isArray(wallpaper.theme) ? 
                    wallpaper.theme.includes(themeFilter) : 
                    wallpaper.theme === themeFilter);
            return matchesSearch && matchesType && matchesTheme;
        });

        currentPage = 1; // Reiniciar a la primera página después de filtrar
        renderWallpapers();
    }

    // Event listeners para los filtros
    document.getElementById('search').addEventListener('input', filterWallpapers);
    document.getElementById('staticFilter').addEventListener('change', filterWallpapers);
    document.getElementById('animatedFilter').addEventListener('change', filterWallpapers);
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


document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Función para aplicar el modo oscuro o claro
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.classList.add('dark');
            themeToggleBtn.textContent = 'Switch to Light Mode';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.classList.remove('dark');
            themeToggleBtn.textContent = 'Switch to Dark Mode';
        }
    }

    // Detectar modo preferido del sistema
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Aplicar la preferencia del usuario o del sistema
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    // Cambiar entre temas al hacer clic
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Guardar preferencia del usuario
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copy-button');

    copyButton.addEventListener('click', async () => {
        try {
            const textToCopy = "URL_to_copy"; // Reemplaza esto con el enlace que deseas copiar
            await navigator.clipboard.writeText(textToCopy);
            copyButton.classList.add('copied'); // Añadir la clase para cambiar el color
            copyButton.textContent = 'Copied!';

            // Volver al estado original después de 2 segundos
            setTimeout(() => {
                copyButton.classList.remove('copied');
                copyButton.textContent = 'Copy Link';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });
});
