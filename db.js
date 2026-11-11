// =========================================================================
// JETTPHONE - CAPA DE DATOS CON ARCHIVO JSON LOCAL
// =========================================================================

// Intentar cargar los datos desde el archivo data.json o usar respaldo inicial
async function getProducts() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error();
        const data = await response.json();
        return data.products || [];
    } catch (e) {
        // Respaldo por si el archivo data.json aún no ha sido cargado
        return [
            {
                id: "airpods-pro-2",
                title: "AirPods Pro 2 ✅🎧",
                price: "20$",
                category: "audifonos",
                quote: "Sonido 1.1 y cancelación pasiva",
                shipping: "🚚 Entregas personales sin costo adicional",
                description: "<strong>Funciones 🔥</strong><br><br><ul><li>• Vinculación directa 📲</li><li>• Controladores táctil 🎛️</li></ul>",
                imagenes: ["img/airpods1.jpeg", "img/airpods2.jpeg"],
                wa_msg: "Hola Jettphone, estoy interesado en los AirPods Pro 2 de 20$"
            }
        ];
    }
}

async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === id) || null;
}

function getCategories() {
    // Categorías base o almacenadas localmente para agilizar la interfaz de administración
    const saved = localStorage.getItem('jettphone_categories');
    if (saved) return JSON.parse(saved);
    
    return [
        { id: "audifonos", name: "Audífonos" },
        { id: "cargadores", name: "Cargadores" },
        { id: "forros", name: "Forros" },
        { id: "applewatch", name: "Apple Watch" }
    ];
}

function saveCategoryToLocal(cat) {
    let categories = getCategories();
    if (!categories.some(c => c.id === cat.id)) {
        categories.push(cat);
        localStorage.setItem('jettphone_categories', JSON.stringify(categories));
    }
}

function deleteCategoryFromLocal(id) {
    let categories = getCategories();
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem('jettphone_categories', JSON.stringify(categories));
}