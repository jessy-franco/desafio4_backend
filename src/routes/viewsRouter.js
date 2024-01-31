import { Router } from "express";
import ProductManager from "../productManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("home", { productos });
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        /* res.render("realtimeproducts"); */
        const productos = await productManager.getProducts();
        res.render("realtimeproducts", { productos: productos, style: "index.css", });
    } catch (error) {
        console.error("Error al renderizar la vista de productos en tiempo real", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;