
let contadorID = 1;

function generarIDSecuencial() {
    return contadorID++;
}
const socket = io();

/* actualizar la lista de productos */

socket.on("updateProductList", (productos) => {
    const productList = document.getElementById("productListTime");
    productList.innerHTML = "";

    /* Agrega los nuevos elementos a la lista */
    productos.forEach(product => {
        const listItem = document.createElement("li");
        listItem.textContent = `${product.id} - ${product.title} - ${product.description}- ${product.code} - ${product.price}-${product.stock}-${product.category}-${product.thumbnails}`;

        /*crear eliminar producto en nuevo producto */
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Eliminar";
        deleteButton.setAttribute("data-product-id", product.id);
        deleteButton.onclick = () => deleteProduct(product.id);

        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });
});
/* Función para eliminar un producto en el cliente */
function deleteProduct(productId) {
    console.log(`Eliminar producto con ID: ${productId}`);
    socket.emit("deleteProduct", productId);
}

/* Evento para agregar producto */
document.getElementById("addProductBtn").addEventListener("click", () => {
    const productName = document.getElementById("title").value;
    const productDescription = document.getElementById("description").value;
    const productCode = document.getElementById("code").value;
    const productPrice = document.getElementById("price").value;
    const productStock = document.getElementById("stock").value;
    const productCategory = document.getElementById("category").value;
    const productThumbnails = document.getElementById("thumbnails").value;
    const productId = generarIDSecuencial();
    if (productName.trim() !== "" && productDescription.trim() !== "" && productCode.trim() !== "" && productPrice.trim() !== "" && productStock.trim() !== "" && productCategory.trim() !== "" && productThumbnails.trim() === thumbnails || []) {
        socket.emit("addProduct", {
            id: productId,
            title: productName,
            description: productDescription,
            code: productCode,
            price: productPrice,
            stock: productStock,
            category: productCategory,
            thumbnails: productThumbnails
        });

        // Limpiar los campos después de agregar el producto
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("code").value = "";

        document.getElementById("price").value = "";
        document.getElementById("stock").value = "";
        document.getElementById("category").value = "";
        document.getElementById("thumbnails").value = "";
    } else {
        alert("Por favor, ingrese los campos necesarios para agregar el producto.");
    }
});




