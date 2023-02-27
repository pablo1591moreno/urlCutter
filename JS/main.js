// Cambia el texto del titulo al pasar de a otra ventana
let tituloActual = document.title;
window.addEventListener('blur', () => {
  tituloActual = document.title;
  document.title = 'Vuelve Que sin ti la vida se me va Oh...';
})
window.addEventListener('focus', () => {
  document.title = tituloActual;
})

// Seleccionamos los elementos del HTML que vamos a usar
const inputAcortado = document.querySelector(".acortado");
const botonAcortado = document.querySelector(".botonAcortado");
const seccionCortados = document.querySelector(".cortados");
const links = JSON.parse(localStorage.getItem("cortados")) || [];
const linksHistorial = JSON.parse(localStorage.getItem("cortadosHistorial")) || [];
const seccionHistorial = document.querySelector(".historialCortados");

renderHistorial(linksHistorial)
renderLinks(links)


// Agregamos un evento click al botón
botonAcortado.addEventListener("click", () => {
  const urlEntrante = inputAcortado.value;

  if (!urlEntrante) {
    alert("ingresa la URL")
    return
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
  shorten(urlEntrante)
    .then(data => {
      const links = JSON.parse(localStorage.getItem("cortados")) || [];
      const newLink = { linkOriginal: urlEntrante, linkCortado: data };
      links.unshift(newLink);
      localStorage.setItem("cortados", JSON.stringify(links));

      const linksHistorial = JSON.parse(localStorage.getItem("cortadosHistorial")) || [];
      linksHistorial.unshift(newLink)
      localStorage.setItem("cortadosHistorial", JSON.stringify(linksHistorial));

      renderHistorial(linksHistorial)
      renderLinks(links)
    })
    .catch(error => {
      console.error(error);
      alert("Hubo un error al procesar la petición, intente más tarde");
    });
});

function renderLinks(links) {
  // Selecciona el elemento HTML con id "seccionCortados" y borra su contenido
  seccionCortados.innerHTML = "";
  // Para cada objeto "element" en la lista "links", inserta HTML en el elemento "seccionCortados"
  links.slice(0, 6).forEach((element, index) => {
    if (index < 6) {
      seccionCortados.insertAdjacentHTML(
        'beforeend',
        `
        <div class="links">
          <p class="url">${element.linkOriginal}</p>
          <p><a href="${element.linkCortado}" target="_blank">${element.linkCortado}</a></p>
          <div class="botonescopiarEliminar" >
          <button class="copiar">Copiar</button>
          <button class="eliminar">Eliminar</button>
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

function renderHistorial(linksHistorial) {
  if (seccionHistorial) {
    linksHistorial.forEach(element => {
      seccionHistorial.insertAdjacentHTML(
        'beforeend',
        `
        <div class="links">
          <p class="url">${element.linkOriginal}</p>
          <p><a href="${element.linkCortado}" target="_blank">${element.linkCortado}</a></p>
          <button class="copiar">Copiar</button>
        </div>
        `
      )
    }
    )

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

    borraHistorial = document.querySelector('.borraHistorial')

    borraHistorial.addEventListener('click', () => {
      localStorage.removeItem("cortadosHistorial")
      seccionHistorial.remove()
    });
  }
}

