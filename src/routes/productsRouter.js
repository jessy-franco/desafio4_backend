import { Router } from "express";
import ProductManager from "../productManager.js";
import { promises as fs } from "fs";

const products = Router();

const productManager = new ProductManager();

/* muestra los prod */

products.get("/", async (req, res) => {
    try {
        let products;
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            products = await productManager.getProductLimit(limit);
        } else {
            products = await productManager.getProducts();
        }

        /* Renderiza la página home.handlebars con la lista de productos */
        res.render("home", {
            productos: products,
            style: "index.css",
        });
    }
    catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    };

});
/* muestra los prod por id */
products.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productManager.getProductById(id);
        console.log("ID recibido:", id);

        if (product) {
            console.log("Producto encontrado:", product);
            res.send(product);
        } else {
            console.error("Producto no encontrado");
            res.status(404).send("El producto no existe");
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error del servidor");
    }
});


/* ruta para agregar prod */
products.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails, } = req.body;
        if (title && description && code && price && stock && category) {
            const newProduct = {
                title, description, code, price, stock, category, thumbnails: thumbnails || [],
                status: true,
            };
            const addProd = await productManager.addProduct(newProduct);
            res.status(201).send(addProd);
            console.log(req.body)
        } else {
            res.status(400).send("Falta completar campos obligatorios")
        }
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).send("Error del servidor");
    }
}
);
/* ruta para actualizar prod */
products.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedFields = req.body;

        /* Validar que el producto exista antes de actualizar */
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send({ error: "El producto no existe" });
        }

        // Definir la función updateProduct fuera del bloque try
        const updatedProducts = await updateProduct({ id: pid, ...updatedFields });



        res.send(updatedProducts); // Enviar los productos actualizados como respuesta
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).send({ error: "Error del servidor", details: error.stack });
    }
});


async function updateProduct({ id, ...updatedFields }) {
    const products = await productManager.readProducts();
    const updatedProducts = products.map(product => {
        if (product.id === id) {
            return { ...product, ...updatedFields };
        }
        return product;
    });

    try {
        await fs.writeFile(productManager.path, JSON.stringify(updatedProducts));
        console.log("Producto actualizado:", updatedProducts);
        return updatedProducts; // Devuelve los productos actualizados
    } catch (error) {
        console.error("Error al escribir el archivo:", error);
        throw error;
    }
}

/* Ruta para eliminar un producto por ID */
products.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;

        const deletedProduct = await productManager.deleteProductsById(pid);

        if (deletedProduct) {
            res.status(200).json({ message: "Producto eliminado correctamente", deletedProduct });
        } else {
            console.error("El producto no existe");
            res.status(404).send("El producto no existe");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send("Error del servidor");
    }
});

products.use("/realtimeproducts", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("realtimeproducts", { productos: productos, style: "index.css", });
    }
    catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }


})


export default products