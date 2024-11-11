// Classe représentant un produit
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// Classe représentant un article dans le panier
class ShoppingCartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    // Calculer le prix total pour cet article
    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

// Classe représentant le panier d'achat
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // Ajouter un article au panier
    addItem(product) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(new ShoppingCartItem(product));
        }
        this.updateTotal();
    }

    // Supprimer un article du panier
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateTotal();
    }

    // Modifier la quantité d'un article
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        if (item && quantity > 0) {
            item.quantity = quantity;
        } else if (item && quantity === 0) {
            this.removeItem(productId);
        }
        this.updateTotal();
    }

    // Calculer le total du panier
    getTotal() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    // Afficher le total mis à jour
    updateTotal() {
        const totalPriceElement = document.getElementById('total-price');
        totalPriceElement.textContent = this.getTotal().toFixed(2) + ' €';
    }

    // Afficher les articles du panier dans le DOM
    displayCartItems() {
        const cartItemsContainer = document.querySelector('.row.g-4');
        cartItemsContainer.innerHTML = '';

        this.items.forEach(item => {
            const cartItemHTML = `
                <div class="col-md-4">
                    <div class="card mb-3 cart-item shadow border-0" data-id="${item.product.id}">
                        <img src="./image/imge1.webp" class="card-img-top img-fluid" alt="">
                        <div class="card-body text-center">
                            <h5>${item.product.name}</h5>
                            <div class="align-items-center pt-3 mb-3">
                                <button class="btn btn-warning minus me-2">-</button>
                                <span class="quantity me-2">${item.quantity}</span>
                                <button class="btn btn-info plus me-2">+</button>
                                <span class="item-price me-4 fw-bold">${item.getTotalPrice().toFixed(2)} €</span>
                            </div>
                            <button class="btn btn-danger remove me-2">Supprimer</button>
                            <button class="btn favorite">❤️</button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        this.attachEventListeners();
    }

    // Ajouter des événements aux boutons du panier
    attachEventListeners() {
        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.updateQuantity(productId, this.getItemQuantity(productId) + 1);
                this.displayCartItems();
            });
        });

        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.updateQuantity(productId, this.getItemQuantity(productId) - 1);
                this.displayCartItems();
            });
        });

        document.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.removeItem(productId);
                this.displayCartItems();
            });
        });

        document.querySelectorAll('.favorite').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('liked');
                btn.style.color = btn.classList.contains('liked') ? 'red' : 'grey';
            });
        });
    }

    getItemQuantity(productId) {
        const item = this.items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
    }
}

// Initialiser le panier et les produits
const cart = new ShoppingCart();
const products = [
    new Product(1, "Article 1", 29.99),
    new Product(2, "Article 2", 19.99),
    new Product(3, "Article 3", 39.99),
];

// Ajouter des produits au panier pour tester
products.forEach(product => cart.addItem(product));
cart.displayCartItems();
