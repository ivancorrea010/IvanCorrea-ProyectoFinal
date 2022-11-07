import {contenedor,contador,abrirCarrito,modal, boxForm} from "./variables.js"

fetch("./datos.json").then(response => response.json()).then(data => {
  crearCards(data)
})

let arrayCarrito = JSON.parse(localStorage.getItem("carrito")) || [];


abrirCarrito.addEventListener("click", () => {
  modal.classList.toggle("vis");
});

function crearCards(arrayProductos) {
  arrayProductos.forEach((producto) => {
    console.log(producto.id);
    const { img, nombre, precio, id } = producto;
    contenedor.innerHTML += `
        <div class="div-card">
            <img class="img-producto" src=${img}>
            <div class="div-titulo-producto">
                <h2>${nombre}</h2>
                <p>$${precio}</p>
                <button id="prod-${id}" data-id="${id}" class="btn-agregar">Agregar</button>
            </div>
        </div>
    `;
   
  });

  darFuncionalidadBtn(arrayProductos);
}

function darFuncionalidadBtn(arrayProductos) {
  arrayProductos.forEach((producto) => {
    document
      .querySelector(`#prod-${producto.id}`)
      .addEventListener("click", () => {
        agregarProdAlCarrito(producto, arrayProductos);
      });
  });
}

function agregarProdAlCarrito(prod, arrayProductos) {
  let existe = arrayCarrito.some((producto) => producto.id == prod.id);

  if (existe === false) {
    prod.cantidad = 1;
    arrayCarrito.push(prod);
  } else {
    let producto = arrayProductos.find((element) => element.id == prod.id);
    producto.cantidad++;
  }
  renderizarProds();
}

function renderizarProds() {
  modal.innerHTML = "";
  let divTotal = document.createElement("div");
  arrayCarrito.forEach((producto) => {
    const { nombre, precio, cantidad, id } = producto;
    modal.innerHTML += `
        <div class="div-card">
            
            <div class="div-titulo-producto">
                <h2>${nombre}</h2>
                <p>$${precio}</p>
                <p>CANTIDAD: ${cantidad}</p>
                <button id="prod-eliminar-${id}" data-id="${id}" class="btn-agregar btn-eliminar">Eliminar</button>
                <button id="prod-menos-${id}" class="btn-agregar">-</button>
            </div>
        </div>
    `;
  });
  contador.innerText = arrayCarrito.reduce((acc,ite)=>acc+ite.cantidad,0)

  let totalReduce = arrayCarrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0
  );

  if(totalReduce !== 0){
 
  divTotal.innerHTML = `Total:$${totalReduce}`;
  modal.appendChild(divTotal);
  eliminarProd();
  restarProd();
  localStorage.setItem("carrito", JSON.stringify(arrayCarrito));
  /* Se crea boton para finalizar la compra */
  let btnFinal = document.createElement("button")
  btnFinal.innerText = "Finalizar Compra"
  modal.appendChild(btnFinal)
  /* Se crea boton para vaciar el carrito ( sin hacer la compra ) */
  let btnVaciar = document.createElement("button")
  btnVaciar.innerText = "Vaciar carrito"
  modal.appendChild(btnVaciar)
  btnFinal.addEventListener("click",()=>{
    cargarFormulario(totalReduce)
  })
  btnVaciar.addEventListener("click",()=>{
    borrarTodo()
  })
  }
}

function eliminarProd() {
  arrayCarrito.forEach((producto) => {
    document
      .querySelector(`#prod-eliminar-${producto.id}`)
      .addEventListener("click", () => {
        arrayCarrito = arrayCarrito.filter((prod) => prod.id != producto.id);
        Swal.fire({
          text: "Se eliminó el producto de tu carrito",
          icon: 'success',
          confirmButtonColor: '#cf0a2c',
          confirmButtonText: 'Aceptar',
        })
          
       
        renderizarProds();
      });
  });
}

function restarProd() {
  arrayCarrito.forEach((producto) => {
    document
      .querySelector(`#prod-menos-${producto.id}`)
      .addEventListener("click", () => {
        producto.cantidad--;
        producto.cantidad === 0 && (producto.cantidad = 1);
        renderizarProds();
      });
  });
}

function borrarTodo(){
  arrayCarrito = []
  localStorage.setItem("carrito", JSON.stringify(arrayCarrito));
  renderizarProds()
}

function cargarFormulario(totalReduce){
  productosFinales(totalReduce)
  contenedor.remove()
  modal.remove()
  boxForm.classList.remove("vis")
  let miForm = document.querySelector(".send-form")
  
  miForm.addEventListener("submit",(e)=>{
  e.preventDefault()
  let card = document.querySelector(".box-card")
  
  if(card.value.length !== 16 ){
    return Swal.fire("Error","Debe ingresar 16 digitos de tarjeta")
  }
  
  miForm.reset()
  borrarTodo()
  
  Swal.fire({
    title: 'Tu compra fue confirmada',
    text:"La pagina se recargara...",
    confirmButtonText: 'ok',
    icon:"success"
    }).then((result) => {
     if (result.isConfirmed) {
      window.location.reload()
    } 
  })
  })

}

function productosFinales(totalReduce){
let divBox = document.querySelector(".box-form")

arrayCarrito.forEach(element=>{
  divBox.innerHTML += `<div class="card-final">
  <h5>${element.nombre}</h5>
  <p>PRECIO: $${element.precio}</p>
  <p>CANTIDAD: ${element.cantidad}</p>
  </div>`
})

let boxFinal = document.createElement("div")
boxFinal.innerHTML = `<h3 class="abono-final">Debe abonar : $${totalReduce}</h3>`
divBox.append(boxFinal)

}

renderizarProds();

