import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import products from "./routes/productsRouter.js"
import carts from "./routes/cartsRouter.js"
import views from "./routes/viewsRouter.js"
import { Server } from "socket.io";
import ProductManager from "./productManager.js";



const app = express();
const routerproducts = products;
const routercarts = carts
const productManager = new ProductManager();


app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/static", express.static(__dirname + "/public"))

/* routers */
app.use("/api/products", routerproducts)
app.use("/api/carts", routercarts)
app.use("/", views)


const server = app.listen(8080, () => {
    console.log("servidor 8080!");
});

const socketServer = new Server(server);

socketServer.on("connection", socket => {
    console.log("nuevo cliente conectado")

    socket.on("addProduct", async (newProduct) => {
        try {
            await productManager.addProduct(newProduct);
            const updatedProducts = await productManager.getProducts();
            socket.emit("updateProductList", updatedProducts);
        }
        catch (error) {
            console.error("Error al agregar producto desde sockets:", error);
        }

    });

    socket.on("deleteProduct", async (productId) => {
        try {
            const deletedProduct = await productManager.deleteProductsById(productId);
            if (deletedProduct) {
                console.log("Producto eliminado desde sockets:", deletedProduct);
                /* Emitir un evento a la vista en tiempo real para actualizar la lista */
                socket.emit("productDeleted", deletedProduct);
            } else {
                console.error("El producto no existe");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    })
})




