// Seleccionamos los elementos del HTML que vamos a usar
const inputAcortado = document.querySelector(".acortado");
const botonAcortado = document.querySelector(".botonAcortado");
const seccionCortados = document.querySelector(".cortados");
const links = JSON.parse(localStorage.getItem("cortados")) || [];

renderLinks(links)


let cantidadLinks = 0;
console.log(cantidadLinks)
// Agregamos un evento click al botón

botonAcortado.addEventListener("click", () => {
  const urlEntrante = inputAcortado.value;

  if (!urlEntrante) {
    alert("Ingresa la URL");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    "apikey": "cfa839f0f2b248f48b7a267b43e71151",
  }

  async function shorten(url) {
    const endpoint = "https://api.rebrandly.com/v1/links";
    const linkRequest = {
      destination: url,
      domain: { fullName: "rebrand.ly" }
    };
    const apiCall = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(linkRequest)
    };
    const response = await fetch(endpoint, apiCall);
    const link = await response.json();
    return link.shortUrl;
  }

  if (cantidadLinks < 6) { // Verificar que no se hayan acortado ya 6 links
    shorten(urlEntrante)
      .then(data => {
        cantidadLinks++; // Incrementar la variable
        const links = JSON.parse(localStorage.getItem("cortados")) || [];
        const newLink = { linkOriginal: urlEntrante, linkCortado: data };
        links.unshift(newLink);
        localStorage.setItem("cortados", JSON.stringify(links));
        renderLinks(links);
      })
      .catch(error => {
        console.error(error);
        alert("Hubo un error al procesar la petición, intente más tarde");
      });
  } else {
    alert("Ya se han acortado 6 links, no se pueden acortar más");
  }
});




function renderLinks(links) {
  // Selecciona el elemento HTML con id "seccionCortados" y borra su contenido
  seccionCortados.innerHTML = "";
  
  // Define el número máximo de enlaces que se deben renderizar
  let maxLinks = 6;
  
  // Si estamos en la versión móvil, cambia el número máximo de enlaces renderizados a 4
  if (window.matchMedia("(max-width: 415px)").matches) {
    maxLinks = 4;
  }
  
  // Para cada objeto "element" en la lista "links", inserta HTML en el elemento "seccionCortados"
  links.slice(0, maxLinks).forEach((element, index) => {
    if (index < maxLinks) {
      seccionCortados.insertAdjacentHTML(
        'beforeend',
        `
        <div class="links">
          <p class="url">${element.linkOriginal}</p>
          <p class="urlCortado"><a href="${element.linkCortado}" target="_blank">${element.linkCortado}</a></p>
          <div class="botones">
          <button class="btn copiar">
            <span class="iconify" data-icon="material-symbols:file-copy-outline"></span>
            <span class="text">Copiar</span>
          </button>
          <button class="btn eliminar">
            <span class="iconify" data-icon="material-symbols:delete-outline-rounded"></span>
            <span class="text">Eliminar</span>
          </button>
        </div>        
        </div>
        `
      );
    }
  });

  // Selecciona todos los botones de eliminación en el DOM y les asigna un controlador de eventos "click"
  const deleteButtons = document.querySelectorAll('.eliminar');

  deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      var mismo = event.target.closest('.links')

      // Actualiza la lista "links" en localstorage
      const links = JSON.parse(localStorage.getItem("cortados"));
      const linksActual = links.filter(links => links.linkOriginal !== mismo.querySelector('.url').textContent)
      localStorage.setItem("cortados", JSON.stringify(linksActual));

      // Elimina el elemento HTML "div" del DOM
      mismo.remove()

      // Disminuye la cantidad de links en 1
      cantidadLinks--;
    });
  });

  const botonesCopiar = document.querySelectorAll('.copiar');

  botonesCopiar.forEach(boton => {
    boton.addEventListener('click', event => {
      const enlace = event.target.parentElement.previousElementSibling.querySelector('a');
      const seleccion = window.getSelection();
      const rango = document.createRange();
      rango.selectNode(enlace);
      seleccion.removeAllRanges();
      seleccion.addRange(rango);
      document.execCommand('copy');
      seleccion.removeAllRanges();
    });
  });

}


const cutButton = document.querySelector('.botonAcortado');
cutButton.addEventListener('click', () => {
  console.log('Botón "Cortar" pulsado');
});


