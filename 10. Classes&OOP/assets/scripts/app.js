class Product {
    title = "DEFAULT";
    imageUrl;
    description;
    price;

    constructor(title, image, desc, price) {
        this.title = title;
        this.imageUrl = image;
        this.description = desc;
        this.price = price;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) { // alternative solution for data arraving later then execution
            this.render(); // this. refers to WHAT CALLED THE METHOD!
        }
    }

    render() {};

    createRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component {
    items = [];

    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }

    get totalAmount() {
        const sum = this.items.reduce(
            (prevValue, currentItem) => prevValue + currentItem.price,
            0
        );
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId);
    }

    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;
    }

    render() {
        const cartEl = this.createRootElement("section", "cart");
        cartEl.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;
        cartEl.className = "cart";
        this.totalOutput = cartEl.querySelector("h2");
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId, false); //required to call super() first!! ; false for the alternative method
        this.product = product;
        this.render(); // alternative for ProductList fetchProducts() solution!
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement("li", "product-item");
        prodEl.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.title}">
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button>Add to Cart</button>
                </div>
            </div>
            `;
        const addCartButton = prodEl.querySelector("button");
        addCartButton.addEventListener("click", this.addToCart.bind(this));
    }
}

class ProductList extends Component {
    products = [];

    constructor(renderHookId) {
        super(renderHookId);
        this.fetchProducts();
    };

    fetchProducts() {
        this.products = [
            new Product(
                "A Pillow",
                "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-pillows-stomach-sleepers-1582301173.png?crop=0.749xw:0.576xh;0.134xw,0.278xh&resize=1200:*",
                "A soft pillow!",
                19.99
            ),
            new Product(
                "A Carpet",
                "https://image.shutterstock.com/image-photo/old-red-carpet-colorful-antique-260nw-1021827127.jpg",
                "A carpet you might like!",
                89.99
            )
        ];
        this.renderProducts();
    }

    renderProducts() {
        for (const prod of this.products) {
            new ProductItem(prod, "prod-list");
        }
    }

    render() {
        this.createRootElement("ul", "product-list", [new ElementAttribute("id", "prod-list")]);
        if (this.products && this.products.length > 0) {
            this.renderProducts();
        }
    }
}

class Shop {
    constructor() {
        this.render(); // Don't need to call super() because we only need the render() method!
    }

    render() {
        this.cart = new ShoppingCart("app");
        new ProductList("app");
    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();

