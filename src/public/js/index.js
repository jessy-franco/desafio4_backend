
const socket = io();


/* actualizar la lista de productos */

socket.on("updateProductList", (productos) => {
    const productList = document.getElementById("productListTime");
    productList.innerHTML = "";

    /* Agrega los nuevos elementos a la lista */
    productos.forEach(product => {
        const listItem = document.createElement("li");
        listItem.textContent = `${product.id} - ${product.title} - ${product.price}`;

        /*crear eliminar producto en nuevo producto */
        const deleteButton = document.createElement("deleteProduct");
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => eliminarProducto(product.id);

        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });
});



// Evento para agregar producto
document.getElementById("addProductBtn").addEventListener("click", () => {
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productId = uuid.v4();
    if (productName.trim() !== "" && productPrice.trim() !== "") {
        socket.emit("addProduct", {
            id: productId,
            name: productName,
            price: productPrice,
        });

        // Limpiar los campos después de agregar el producto
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
    } else {
        alert("Por favor, ingrese un nombre y un precio para el producto.");
    }
});

// Evento para eliminar producto
document.addEventListener("click", (event) => {
    console.log(event)
    if (event.target.classList.contains("delete-btn")) {
        const productId = event.target.getAttribute("data-product-id");
        console.log(productId)
        socket.emit("deleteProduct", productId);
    }
});
