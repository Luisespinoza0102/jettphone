// =========================================================================
// JETTPHONE - CAPA DE DATOS GLOBAL VIA GITHUB API (Segura)
// =========================================================================

const GITHUB_USER = 'Luisespinoza0102';
const GITHUB_REPO = 'jettphone';
const GITHUB_BRANCH = 'main';

// Función para obtener de forma segura el token guardado en el navegador
function getGitHubToken() {
    let token = localStorage.getItem('jettphone_gh_token');
    if (!token) {
        token = prompt("Por seguridad, ingresa tu GitHub Personal Access Token (solo se pedirá esta vez):");
        if (token) {
            localStorage.setItem('jettphone_gh_token', token.trim());
        }
    }
    return token ? token.trim() : '';
}

const FILE_PATH = 'data.json';

// 1. Obtener todos los productos desde el archivo data.json en GitHub
async function getProducts() {
    try {
        const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${FILE_PATH}?t=${new Date().getTime()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        return data.products || [];
    } catch (e) {
        console.error("No se pudo cargar el data.json de GitHub, usando respaldo inicial.");
        return [
            {
                id: "airpods-pro-2",
                title: "AirPods Pro 2 ✅🎧",
                price: "20$",
                category: "audifonos",
                quote: "Sonido 1.1 y cancelación pasiva",
                shipping: "🚚 Entregas personales sin costo adicional",
                description: "<strong>Funciones 🔥</strong><br><br><ul><li>• Vinculación directa 📲</li></ul>",
                imagenes: ["img/airpods1.jpeg", "img/airpods2.jpeg"],
                wa_msg: "Hola Jettphone, estoy interesado en los AirPods Pro 2 de 20$"
            }
        ];
    }
}

// 2. Obtener un producto específico por su ID
async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === id) || null;
}

// 3. Obtener las categorías desde el archivo data.json en GitHub
async function getCategories() {
    try {
        const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${FILE_PATH}?t=${new Date().getTime()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        return data.categories || [
            { id: "audifonos", name: "Audífonos" },
            { id: "cargadores", name: "Cargadores" },
            { id: "forros", name: "Forros" },
            { id: "applewatch", name: "Apple Watch" }
        ];
    } catch (e) {
        return [
            { id: "audifonos", name: "Audífonos" },
            { id: "cargadores", name: "Cargadores" },
            { id: "forros", name: "Forros" },
            { id: "applewatch", name: "Apple Watch" }
        ];
    }
}

// 4. Función central: Actualiza automáticamente el archivo data.json en GitHub
async function saveToGitHub(newProducts, newCategories) {
    const token = getGitHubToken();
    if (!token) {
        alert("Se requiere el Token de GitHub para guardar los cambios.");
        return false;
    }

    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

    try {
        // Obtener el SHA actual del archivo (requisito obligatorio de la API de GitHub)
        const getRes = await fetch(apiUrl, {
            headers: { 'Authorization': `token ${token}` }
        });
        
        if (!getRes.ok) throw new Error("No se pudo conectar con la API de GitHub. Verifica tu Token.");
        const fileData = await getRes.json();
        const sha = fileData.sha;

        // Estructura completa que se guardará en el archivo JSON
        const contentObj = {
            products: newProducts,
            categories: newCategories
        };
        
        // Codificar el contenido a Base64
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(contentObj, null, 2))));

        // Enviar la petición PUT para actualizar el archivo en vivo
        const updateRes = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: "Actualización automática de inventario - Panel Jettphone",
                content: contentBase64,
                sha: sha,
                branch: GITHUB_BRANCH
            })
        });

        if (!updateRes.ok) throw new Error("Error al guardar en el repositorio de GitHub");
        return true;
    } catch (error) {
        console.error(error);
        alert("Hubo un error al sincronizar con GitHub. Es posible que el Token sea incorrecto o haya expirado.");
        return false;
    }
}

// Funciones auxiliares para el Panel Admin
async function saveProduct(product) {
    let products = await getProducts();
    const categories = await getCategories();
    
    const idx = products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
        products[idx] = product;
    } else {
        products.push(product);
    }

    return await saveToGitHub(products, categories);
}

async function deleteProduct(id) {
    let products = await getProducts();
    const categories = await getCategories();
    
    products = products.filter(p => p.id !== id);
    return await saveToGitHub(products, categories);
}

async function saveCategory(cat) {
    const products = await getProducts();
    let categories = await getCategories();

    if (!categories.some(c => c.id === cat.id)) {
        categories.push(cat);
        return await saveToGitHub(products, categories);
    } else {
        alert("¡Esta categoría ya existe!");
        return false;
    }
}

async function deleteCategory(id) {
    const products = await getProducts();
    let categories = await getCategories();

    categories = categories.filter(c => c.id !== id);
    return await saveToGitHub(products, categories);
}