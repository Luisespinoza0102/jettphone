// =========================================================================
// JETTPHONE - CAPA DE DATOS INTERNA SINCRONIZADA
// =========================================================================

const INITIAL_CATEGORIES = [
    { id: "audifonos", name: "Audífonos" },
    { id: "cargadores", name: "Cargadores" },
    { id: "forros", name: "Forros" },
    { id: "applewatch", name: "Apple Watch" }
];

const INITIAL_PRODUCTS = [
    {
        id: "airpods-pro-2",
        title: "AirPods Pro 2 ✅🎧",
        price: "20$",
        category: "audifonos",
        quote: "Sonido 1.1 y cancelación pasiva",
        shipping: "🚚 Entregas personales sin costo adicional",
        description: "<strong>Funciones 🔥</strong><br><br><ul><li>• Vinculación directa 📲</li><li>• Controladores táctil 🎛️</li></ul>",
        features: ["Vinculación directa 📲"],
        imagenes: ["img/airpods1.jpeg", "img/airpods2.jpeg"],
        wa_msg: "Hola Jettphone, estoy interesado en los AirPods Pro 2 de 20$"
    }
];

// Inicializar almacenamiento local si está vacío
if (!localStorage.getItem('jettphone_products')) {
    localStorage.setItem('jettphone_products', JSON.stringify(INITIAL_PRODUCTS));
}
if (!localStorage.getItem('jettphone_categories')) {
    localStorage.setItem('jettphone_categories', JSON.stringify(INITIAL_CATEGORIES));
}

// --- FUNCIONES DE PRODUCTOS ---
async function getProducts() {
    const data = localStorage.getItem('jettphone_products');
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
}

async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === id) || null;
}

async function saveProduct(product) {
    let products = JSON.parse(localStorage.getItem('jettphone_products') || '[]');
    const idx = products.findIndex(p => p.id === product.id);
    
    if (idx >= 0) {
        products[idx] = product; // Actualizar existente
    } else {
        products.push(product); // Crear nuevo
    }
    
    localStorage.setItem('jettphone_products', JSON.stringify(products));
    return true;
}

async function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem('jettphone_products') || '[]');
    products = products.filter(p => p.id !== id);
    localStorage.setItem('jettphone_products', JSON.stringify(products));
    return true;
}

// --- FUNCIONES DE CATEGORÍAS ---
function getCategories() {
    const data = localStorage.getItem('jettphone_categories');
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
}

function saveCategory(cat) {
    let categories = getCategories();
    if (!categories.some(c => c.id === cat.id)) {
        categories.push(cat);
        localStorage.setItem('jettphone_categories', JSON.stringify(categories));
    }
    return true;
}

function deleteCategory(id) {
    let categories = getCategories();
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem('jettphone_categories', JSON.stringify(categories));
    return true;
}