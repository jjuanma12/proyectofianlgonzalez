

let productos = [];
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedorProductos = document.getElementById("productos-container");
    const listaCarrito = document.getElementById("lista-carrito");
    const total = document.getElementById("total");
    const btnFinalizar = document.getElementById("finalizar-compra");
    const formularioCompra = document.getElementById("formulario-compra");
    const form = document.getElementById("formulario");

    async function cargarProductos() {
      try {
        const response = await fetch("productos.json");
        productos = await response.json();
        mostrarProductos(productos);
        actualizarCarrito();
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    }

    function mostrarProductos(lista) {
      contenedorProductos.innerHTML = "";
      lista.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${prod.imagen}" alt="${prod.nombre}">
          <h3>${prod.nombre}</h3>
          <p>$${prod.precio}</p>
          <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
        `;
        contenedorProductos.appendChild(card);
      });
    }

    function agregarAlCarrito(id) {
      const producto = productos.find(p => p.id === id);
      carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
      Swal.fire({
        title: "Agregado al carrito",
        text: `${producto.nombre} se agregó correctamente` ,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    }

    function actualizarCarrito() {
      listaCarrito.innerHTML = "";
      let totalCarrito = 0;
      carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio}`;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => eliminarDelCarrito(index);
        li.appendChild(btnEliminar);
        listaCarrito.appendChild(li);
        totalCarrito += item.precio;
      });
      total.textContent = totalCarrito;
    }

    function eliminarDelCarrito(index) {
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarCarrito();
    }

    btnFinalizar.addEventListener("click", () => {
      if (carrito.length === 0) {
        Swal.fire("Tu carrito está vacío");
        return;
      }
      formularioCompra.style.display = "block";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Compra Confirmada",
        text: `Gracias por tu compra, ${form.nombre.value}!` ,
        icon: "success"
      });
      carrito = [];
      localStorage.removeItem("carrito");
      actualizarCarrito();
      formularioCompra.style.display = "none";
      form.reset();
    });

    cargarProductos();