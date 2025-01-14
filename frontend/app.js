let currentUser = null;

// Backend API URLs
const AUTH_API = 'http://localhost:5000';
const PRODUCT_API = 'http://localhost:5001';
const ORDER_API = 'http://localhost:5002';

// Register a new user
async function register() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch(`${AUTH_API}/register`, {
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
        currentUser = { username, userId: data.userId }; // Store userId only
        alert(`Welcome back, ${username}!`);
        loadMainSection(username);  // Pass username to loadMainSection
    } else {
        alert('Invalid username or password');
    }
}


// Load the main section
async function loadMainSection(username) {
    document.getElementById('login-signup-form').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';

    // Display logged-in username
    document.getElementById('uname').textContent = `${username}`;

    await loadProducts();
    await loadOrders();
}

// Load products
async function loadProducts() {
    const response = await fetch(`${PRODUCT_API}/books`); // Correct endpoint
    const products = await response.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear the current list before adding new items

    products.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        // Creating elements for book details
        const title = document.createElement('h5');
        title.textContent = `${product.title} - $${product.price}`;
        li.appendChild(title);

        const author = document.createElement('p');
        author.textContent = `Author: ${product.author}`;
        li.appendChild(author);

        const description = document.createElement('p');
        description.textContent = `Description: ${product.description}`;
        li.appendChild(description);

        // Adding an "Add to Order" button
        const addButton = document.createElement('button');
        addButton.classList.add('btn', 'btn-primary', 'btn-sm', 'ml-3');
        addButton.textContent = 'Add to Order';
        addButton.onclick = () => addToOrder(product._id); // Call addToOrder with product ids
        li.appendChild(addButton);

        productList.appendChild(li);
    });
}


// Get the active order for the current user
async function getActiveOrder() {
    const response = await fetch(`${ORDER_API}/user/orders?userId=${currentUser.userId}`);
    if (response.ok) {
        const orders = await response.json();
        return orders.find(order => !order.completed); // Find the active, incomplete order
    }
    return null; // No active orders found
}

// Add product to order or create a new order if none exists
async function addToOrder(productId) {
    if (!currentUser) {
        alert("You need to log in to add items to your order.");
        return;
    }

    const data = {
        userId: currentUser.userId,  // Pass userId to associate with the order
        productId: productId
    };

    const response = await fetch(`${ORDER_API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Product added to your order!');
        loadOrders();  // Reload the orders after adding a product
    } else {
        alert('Failed to add product to order.');
    }
}

// Load orders
async function loadOrders() {
    if (!currentUser) {
        alert("You need to log in to view your orders.");
        return;
    }

    const response = await fetch(`${ORDER_API}/orders?userId=${currentUser.userId}`, {
        headers: { 'Content-Type': 'application/json' },
    });
    const orders = await response.json();
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';
    orders.forEach(order => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `Order #${order._id} - Total: $${order.total || 'TBD'}`;
        orderList.appendChild(li);
    });
}


// Checkout
async function checkout() {
    if (!currentUser) {
        alert("You need to log in to checkout.");
        return;
    }

    const response = await fetch(`${ORDER_API}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        alert('Checkout successful!');
        loadOrders();  // Reload orders after checkout
    } else {
        alert('Checkout failed.');
    }
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
