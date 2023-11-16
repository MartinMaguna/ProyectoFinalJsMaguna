const usuarios = [
    {
        username: "usuario1",
        password: "contraseña1"
    },
    {
        username: "usuario2",
        password: "contraseña2"
    },
    {
        username: "usuario3",
        password: "contraseña3"
    },
    {
        username: "usuario4",
        password: "contraseña4"
    },
];

function iniciarSesion(username, password) {
    // Buscar el usuario en el objeto
    const usuarioEncontrado = usuarios.find(user => user.username === username);

    // Verificar si se encontró un usuario y si la contraseña coincide
    if (usuarioEncontrado && usuarioEncontrado.password === password) {
        // Almacenar el estado de inicio de sesión en localStorage
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));
        return true; // Acceso correcto
    } else {
        return false; // Acceso denegado
    }
}

// Función para obtener el usuario almacenado en localStorage
function obtenerUsuarioLogueado() {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
}

// Modificar el evento submit del formulario
loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe

    // Capturar el nombre de usuario y la contraseña ingresados
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verificar usuario
    if (iniciarSesion(username, password)) {
        mensajeLogin.textContent = "Bienvenido a Contrapikado";

        location.reload();
    } else {
        mensajeLogin.textContent = "Inténtalo de nuevo.";
    }
});

// Verificar el estado de inicio de sesión al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogueado = obtenerUsuarioLogueado();

    if (usuarioLogueado) {
        mensajeLogin.textContent = "Bienvenido nuevamente, " + usuarioLogueado.username + "!";

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Bienvenido a Contrapikado",
            showConfirmButton: false,
            timer: 1500
          });

    }
});


// Modificar la función mostrarPeliculasEnPagina para cargar películas de manera asíncrona
async function mostrarPeliculasEnPagina() {
    const peliculasContainer = document.getElementById("peliculasContainer");

    try {
        // Utilizar fetch para obtener las películas de un archivo JSON
        const response = await fetch('movies.json');
        const peliculas = await response.json();

        // Mostrar las películas en la página
        peliculas.forEach(pelicula => {
            const peliculaDiv = document.createElement("div");
            peliculaDiv.className = "pelicula";

            const titulo = document.createElement("h2");
            titulo.textContent = pelicula.titulo;

            const director = document.createElement("p");
            director.textContent = "Director: " + pelicula.director;

            const genero = document.createElement("p");
            genero.textContent = "Género: " + pelicula.genero;

            const imagen = document.createElement("img");
            imagen.src = pelicula.imagen;
            imagen.alt = pelicula.titulo;

            const verMasTardeButton = document.createElement("button");
            verMasTardeButton.textContent = "Ver más tarde";
            verMasTardeButton.addEventListener("click", function () {
                agregarAVerMasTarde(pelicula);
            });

            const favoritosButton = document.createElement("button");
            favoritosButton.textContent = "Favoritos";
            favoritosButton.addEventListener("click", function () {
                agregarAFavoritos(pelicula);
            });

            peliculaDiv.appendChild(titulo);
            peliculaDiv.appendChild(director);
            peliculaDiv.appendChild(genero);
            peliculaDiv.appendChild(imagen);
            peliculaDiv.appendChild(verMasTardeButton);
            peliculaDiv.appendChild(favoritosButton);

            peliculasContainer.appendChild(peliculaDiv);
        });
    } catch (error) {
        console.error('Error al cargar las películas:', error);
    }
}

// Llama a la función para mostrar películas en la página
mostrarPeliculasEnPagina();

const verMasTardeList = [];
const favoritosList = [];


function agregarAVerMasTarde(pelicula) {
    if (!verMasTardeList.includes(pelicula)) {
        verMasTardeList.push(pelicula);
        mostrarPeliculasEnVerMasTarde();
        guardarEnLocalStorage('verMasTardeList', verMasTardeList);
    }
}

function quitarDeVerMasTarde(pelicula) {
    const index = verMasTardeList.indexOf(pelicula);
    if (index !== -1) {
        verMasTardeList.splice(index, 1);
        mostrarPeliculasEnVerMasTarde();
        guardarEnLocalStorage('verMasTardeList', verMasTardeList);
    }
}

function agregarAFavoritos(pelicula) {
    if (!favoritosList.includes(pelicula)) {
        favoritosList.push(pelicula);
        mostrarPeliculasEnFavoritos();
        guardarEnLocalStorage('favoritosList', favoritosList);
    }
}

function quitarDeFavoritos(pelicula) {
    const index = favoritosList.indexOf(pelicula);
    if (index !== -1) {
        favoritosList.splice(index, 1);
        mostrarPeliculasEnFavoritos();
        guardarEnLocalStorage('favoritosList', favoritosList);
    }
}

// Función para guardar en localStorage
function guardarEnLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function mostrarPeliculasEnVerMasTarde() {
    const verMasTardeContainer = document.getElementById("watchLaterList");
    verMasTardeContainer.innerHTML = "";

    verMasTardeList.forEach(pelicula => {
        const peliculaItem = document.createElement("li");
        peliculaItem.textContent = pelicula.titulo;

        const quitarButton = document.createElement("button");
        quitarButton.textContent = "Quitar";
        quitarButton.addEventListener("click", () => {
            quitarDeVerMasTarde(pelicula);
        });

        peliculaItem.appendChild(quitarButton);
        verMasTardeContainer.appendChild(peliculaItem);
    });
}

function mostrarPeliculasEnFavoritos() {
    const favoritosContainer = document.getElementById("favoritesList");
    favoritosContainer.innerHTML = "";

    favoritosList.forEach(pelicula => {
        const peliculaItem = document.createElement("li");
        peliculaItem.textContent = pelicula.titulo;

        const quitarButton = document.createElement("button");
        quitarButton.textContent = "Quitar";
        quitarButton.addEventListener("click", () => {
            quitarDeFavoritos(pelicula);
        });

        peliculaItem.appendChild(quitarButton);
        favoritosContainer.appendChild(peliculaItem);
    });
}


//Empleo de funciones de orden superior para filtro por género y duración.

function filtrarPeliculas(peliculas, filtro) {
    return peliculas.filter(filtro);
}

// Definir funciones de filtro
function esDocumental(pelicula) {
    return pelicula.genero === "Documental";
}

function esFiccion(pelicula) {
    return pelicula.genero === "Ficción";
}

// Usar la función de orden superior para filtrar películas
const documentales = filtrarPeliculas(peliculas, esDocumental);
const peliculasDeFiccion = filtrarPeliculas(peliculas, esFiccion);