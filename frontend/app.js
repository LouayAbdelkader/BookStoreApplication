let currentUser = null;

// Backend API URLs
const AUTH_API = 'http://localhost:5000/api/auth';
const PRODUCT_API = 'http://localhost:5001/api/products';
const CART_API = 'http://localhost:5002/api/cart';
const ORDER_API = 'http://localhost:5003/api/orders';

// Register a new user
async function register() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch(`${AUTH_API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('Registration successful! You can now log in.');
        toggleToLogin();
    } else {
        alert('Registration failed. Please try again.');
    }
}

// Log in a user
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        currentUser = { username, token: data.token };
        alert(`Welcome back, ${username}!`);
        loadMainSection();
    } else {
        alert('Invalid username or password');
    }
}

// Load the main section
async function loadMainSection() {
    document.getElementById('login-signup-form').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    await loadProducts();
    await loadCart();
    await loadOrders();
}

// Load products
async function loadProducts() {
    const response = await fetch(`${PRODUCT_API}`);
    const products = await response.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${product.title} - $${product.price}`;
        li.onclick = () => addToCart(product.id);
        productList.appendChild(li);
    });
}

// Load cart
async function loadCart() {
    const response = await fetch(`${CART_API}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
    });
    const cartItems = await response.json();
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    cartItems.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${item.title} - $${item.price}`;
        cartList.appendChild(li);
    });
}

// Add to cart
async function addToCart(productId) {
    await fetch(`${CART_API}/add`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${currentUser.token}` 
        },
        body: JSON.stringify({ productId }),
    });
    alert('Product added to cart!');
    loadCart();
}

// Load orders
async function loadOrders() {
    const response = await fetch(`${ORDER_API}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
    });
    const orders = await response.json();
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    orders.forEach(order => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `Order #${order.id} - Total: $${order.total}`;
        orderList.appendChild(li);
    });
}

// Checkout
async function checkout() {
    await fetch(`${ORDER_API}/checkout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` },
    });
    alert('Checkout successful!');
    loadCart();
    loadOrders();
}

// Log out
function logout() {
    currentUser = null;
    document.getElementById('main-section').style.display = 'none';
    document.getElementById('login-signup-form').style.display = 'block';
}

// Toggle to Login
function toggleToLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Toggle to Signup
function toggleToSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}
