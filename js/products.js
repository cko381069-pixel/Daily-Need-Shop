 /* =========================================
   DAYLI NEED SHOP
   PRODUCTS JAVASCRIPT
   File: js/products.js
========================================= */


/* =========================================
   SETTINGS
========================================= */

const PRODUCTS_CART_KEY = "dayliCart";

const PRODUCTS_API_URL =
    "http://localhost:5000/api/products";


/* =========================================
   GLOBAL PRODUCT DATA
========================================= */

let allProducts = [];

let apiProductsLoaded = false;


/* =========================================
   GET CART
========================================= */

function getProductsCart() {

    try {

        const cart = JSON.parse(
            localStorage.getItem(PRODUCTS_CART_KEY)
        );

        return Array.isArray(cart) ? cart : [];

    } catch (error) {

        console.error("Cart error:", error);

        return [];

    }

}


/* =========================================
   SAVE CART
========================================= */

function saveProductsCart(cart) {

    localStorage.setItem(
        PRODUCTS_CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================
   FORMAT PRICE
========================================= */

function formatProductPrice(price) {

    return Number(price || 0).toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 2
        }
    );

}


/* =========================================
   IMAGE PATH
========================================= */

function getProductImage(image) {

    if (!image) {

        return "";

    }


    const imagePath = String(image).trim();


    /*
       If backend already gives:
       http://...
       https://...
       /...
       assets/...
    */

    if (
        imagePath.startsWith("http://") ||
        imagePath.startsWith("https://") ||
        imagePath.startsWith("/") ||
        imagePath.startsWith("assets/")
    ) {

        return imagePath;

    }


    /*
       Example:
       tomato.png

       becomes:

       assets/tomato.png
    */

    return "assets/" + imagePath;

}


/* =========================================
   GET PRODUCT DATA FROM CARD
========================================= */

function getProductFromCard(card) {

    if (!card) {

        return null;

    }


    const nameElement =
        card.querySelector("h3");


    const priceElement =
        card.querySelector(".price");


    const imageElement =
        card.querySelector("img");


    if (!nameElement || !priceElement) {

        return null;

    }


    const name =
        nameElement.textContent.trim();


    const price =
        Number(
            priceElement.textContent
                .replace(/[^0-9.]/g, "")
        ) || 0;


    const image =
        imageElement
            ? imageElement.getAttribute("src")
            : "";


    /*
       Prefer backend numeric ID
       when available.
    */

    let id =
        card.dataset.productId;


    /*
       Old/static products don't have
       backend IDs, so create a slug.
    */

    if (!id) {

        id = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

    }


    return {

        id: String(id),

        name: name,

        price: price,

        image: image,

        quantity: 1

    };

}


/* =========================================
   ADD PRODUCT TO CART
========================================= */

function addProductToCart(card) {

    const product =
        getProductFromCard(card);


    if (!product) {

        alert("Unable to add this product.");

        return;

    }


    const cart =
        getProductsCart();


    const existingProduct =
        cart.find(function (item) {

            return String(item.id) ===
                String(product.id);

        });


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push(product);

    }


    saveProductsCart(cart);


    /*
       Update cart count from app.js
    */

    if (
        typeof updateCartCount ===
        "function"
    ) {

        updateCartCount();

    }


    showProductMessage(
        product.name +
        " added to cart!"
    );

}


/* =========================================
   PRODUCT MESSAGE
========================================= */

function showProductMessage(message) {

    let messageBox =
        document.getElementById(
            "productMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement("div");


        messageBox.id =
            "productMessage";


        messageBox.style.position =
            "fixed";

        messageBox.style.top =
            "20px";

        messageBox.style.right =
            "20px";

        messageBox.style.zIndex =
            "9999";

        messageBox.style.padding =
            "14px 20px";

        messageBox.style.borderRadius =
            "8px";

        messageBox.style.background =
            "#222";

        messageBox.style.color =
            "#fff";

        messageBox.style.fontSize =
            "14px";

        messageBox.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.2)";


        document.body.appendChild(
            messageBox
        );

    }


    messageBox.textContent =
        message;


    messageBox.style.display =
        "block";


    clearTimeout(
        messageBox.hideTimer
    );


    messageBox.hideTimer =
        setTimeout(function () {

            messageBox.style.display =
                "none";

        }, 2000);

}


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {

    const card =
        document.createElement("div");


    card.className =
        "product-card";


    /*
       Store backend ID
    */

    if (product.id !== undefined) {

        card.dataset.productId =
            product.id;

    }


    /*
       Store category
    */

    if (product.category_name) {

        card.dataset.category =
            product.category_name;

    }


    const image =
        getProductImage(
            product.image
        );


    card.innerHTML = `

        <button class="wishlist">
            ❤
        </button>

        <img
            src="${image}"
            alt="${escapeHTML(product.name || "Product")}"
        >

        <h3>
            ${escapeHTML(product.name || "Product")}
        </h3>

        <div class="rating">
            ⭐⭐⭐⭐⭐
        </div>

        <p class="price">
            ฿${formatProductPrice(product.price)}
        </p>

        <button class="btn">
            Add to Cart
        </button>

        <button class="view-btn">
            Quick View
        </button>

    `;


    /*
       If image is broken, hide the broken
       image instead of showing browser error.
    */

    const imageElement =
        card.querySelector("img");


    if (imageElement) {

        imageElement.addEventListener(
            "error",
            function () {

                this.style.display =
                    "none";

            }
        );

    }


    return card;

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   LOAD PRODUCTS FROM API
========================================= */

async function loadProductsFromAPI() {

    const container =
        document.querySelector(
            ".product-container"
        );


    if (!container) {

        return;

    }


    try {

        /*
           Show loading message
        */

        container.innerHTML = `

            <div class="products-loading">

                <p>
                    Loading products...
                </p>

            </div>

        `;


        const response =
            await fetch(
                PRODUCTS_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "API request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.products)
        ) {

            throw new Error(
                "Invalid product API response"
            );

        }


        /*
           Store API products
        */

        allProducts =
            data.products;


        /*
           If database has products,
           display them.
        */

        if (allProducts.length > 0) {

            apiProductsLoaded = true;

            renderProducts(
                allProducts
            );

        } else {

            /*
               Database currently empty.

               Keep original HTML cards
               instead of showing blank page.
            */

            apiProductsLoaded = false;

            initializeProductFeatures();

            updateProductCount();

            showProductMessage(
                "No products found in database. Showing demo products."
            );

        }

    } catch (error) {

        console.error(
            "Product API error:",
            error
        );


        /*
           Keep original static products
           if backend is unavailable.
        */

        apiProductsLoaded = false;


        initializeProductFeatures();

        updateProductCount();


        showProductMessage(
            "Backend unavailable. Showing demo products."
        );

    }

}


/* =========================================
   RENDER API PRODUCTS
========================================= */

function renderProducts(products) {

    const container =
        document.querySelector(
            ".product-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!products.length) {

        container.innerHTML = `

            <div class="products-empty">

                <p>
                    No products available.
                </p>

            </div>

        `;

        updateProductCount();

        return;

    }


    products.forEach(function (product) {

        const card =
            createProductCard(
                product
            );


        container.appendChild(
            card
        );

    });


    initializeProductFeatures();

    updateProductCount();

}


/* =========================================
   SEARCH PRODUCTS
========================================= */

function initializeProductSearch() {

    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            applyProductFilters();

        }
    );

}


/* =========================================
   FILTER / SORT
========================================= */

function initializeProductFilters() {

    const selects =
        document.querySelectorAll(
            ".products-page select, .filter-box select, .products select"
        );


    if (!selects.length) {

        return;

    }


    selects.forEach(function (select) {

        select.addEventListener(
            "change",
            function () {

                applyProductFilters();

            }
        );

    });

}


/* =========================================
   APPLY SEARCH + FILTER + SORT
========================================= */

function applyProductFilters() {

    const container =
        document.querySelector(
            ".product-container"
        );


    if (!container) {

        return;

    }


    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    const selects =
        document.querySelectorAll(
            ".filter-box select, .products select"
        );


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    let categoryValue = "";

    let sortValue = "";


    if (selects[0]) {

        categoryValue =
            selects[0].value
                .trim()
                .toLowerCase();

    }


    if (selects[1]) {

        sortValue =
            selects[1].value
                .trim()
                .toLowerCase();

    }


    /*
       If API products are loaded,
       filter the original API array.
    */

    if (apiProductsLoaded) {

        let filteredProducts =
            allProducts.filter(
                function (product) {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const category =
                        String(
                            product.category_name || ""
                        ).toLowerCase();


                    /*
                       Search
                    */

                    const matchesSearch =
                        !searchText ||
                        name.includes(
                            searchText
                        );


                    /*
                       Category
                    */

                    const matchesCategory =
                        !categoryValue ||
                        categoryValue === "all" ||
                        categoryValue === "all categories" ||
                        category.includes(
                            categoryValue
                        );


                    return (
                        matchesSearch &&
                        matchesCategory
                    );

                }
            );


        /*
           SORT
        */

        if (
            sortValue.includes(
                "low to high"
            )
        ) {

            filteredProducts.sort(
                function (a, b) {

                    return Number(a.price || 0) -
                        Number(b.price || 0);

                }
            );

        } else if (
            sortValue.includes(
                "high to low"
            )
        ) {

            filteredProducts.sort(
                function (a, b) {

                    return Number(b.price || 0) -
                        Number(a.price || 0);

                }
            );

        } else if (
            sortValue.includes(
                "newest"
            )
        ) {

            filteredProducts.sort(
                function (a, b) {

                    return (
                        new Date(
                            b.created_at || 0
                        ) -
                        new Date(
                            a.created_at || 0
                        )
                    );

                }
            );

        }


        renderProductsWithoutReset(
            filteredProducts
        );


        return;

    }


    /*
       STATIC PRODUCTS FILTER
       Used when API has no data.
    */

    const cards =
        Array.from(
            container.querySelectorAll(
                ".product-card"
            )
        );


    cards.forEach(function (card) {

        const nameElement =
            card.querySelector("h3");


        const priceElement =
            card.querySelector(".price");


        const name =
            nameElement
                ? nameElement.textContent
                    .toLowerCase()
                : "";


        const price =
            priceElement
                ? Number(
                    priceElement.textContent
                        .replace(
                            /[^0-9.]/g,
                            ""
                        )
                ) || 0
                : 0;


        let showCard = true;


        /*
           Search
        */

        if (
            searchText &&
            !name.includes(searchText)
        ) {

            showCard = false;

        }


        /*
           Category
        */

        if (
            categoryValue &&
            categoryValue !== "all" &&
            categoryValue !== "all categories"
        ) {

            const category =
                card.dataset.category
                    ? card.dataset.category
                        .toLowerCase()
                    : "";


            if (
                category &&
                !category.includes(
                    categoryValue
                )
            ) {

                showCard = false;

            }

        }


        card.style.display =
            showCard ? "" : "none";

    });


    updateProductCount();

}


/* =========================================
   RENDER FILTERED API PRODUCTS
========================================= */

function renderProductsWithoutReset(
    products
) {

    const container =
        document.querySelector(
            ".product-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (!products.length) {

        container.innerHTML = `

            <div class="products-empty">

                <p>
                    No matching products found.
                </p>

            </div>

        `;


        updateProductCount();


        return;

    }


    products.forEach(function (product) {

    container.appendChild(
        createProductCard(product)
    );

});

/*
   IMPORTANT:
   Re-initialize Add to Cart,
   Wishlist and Quick View
   after filtered products
   are rendered.
*/
initializeProductFeatures();

updateProductCount();

}


/* =========================================
   WISHLIST
========================================= */

function initializeWishlist() {

    const wishlistButtons =
        document.querySelectorAll(
            ".wishlist"
        );


    wishlistButtons.forEach(
        function (button) {

            /*
               Avoid duplicate listeners
            */

            if (
                button.dataset.wishlistReady ===
                "true"
            ) {

                return;

            }


            button.dataset.wishlistReady =
                "true";


            button.addEventListener(
                "click",
                function () {

                    this.classList.toggle(
                        "active"
                    );


                    if (
                        this.classList.contains(
                            "active"
                        )
                    ) {

                        this.setAttribute(
                            "title",
                            "Remove from Wishlist"
                        );


                        showProductMessage(
                            "Added to wishlist ❤️"
                        );

                    } else {

                        this.setAttribute(
                            "title",
                            "Add to Wishlist"
                        );


                        showProductMessage(
                            "Removed from wishlist"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================
   QUICK VIEW
========================================= */

function initializeQuickView() {

    const quickViewButtons =
        document.querySelectorAll(
            ".view-btn"
        );


    quickViewButtons.forEach(
        function (button) {

            if (
                button.dataset.quickViewReady ===
                "true"
            ) {

                return;

            }


            button.dataset.quickViewReady =
                "true";


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const card =
                        this.closest(
                            ".product-card"
                        );


                    if (!card) {

                        return;

                    }


                    const product =
                        getProductFromCard(
                            card
                        );


                    if (!product) {

                        return;

                    }


                    alert(
                        product.name +
                        "\n\nPrice: ฿" +
                        formatProductPrice(
                            product.price
                        ) +
                        "\n\nClick Add to Cart to purchase this product."
                    );

                }
            );

        }
    );

}


/* =========================================
   ADD TO CART BUTTONS
========================================= */

function initializeAddToCart() {

    const buttons =
        document.querySelectorAll(
            ".product-card .btn"
        );


    buttons.forEach(
        function (button) {

            if (
                button.classList.contains(
                    "view-btn"
                )
            ) {

                return;

            }


            if (
                button.dataset.cartReady ===
                "true"
            ) {

                return;

            }


            button.dataset.cartReady =
                "true";


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const card =
                        this.closest(
                            ".product-card"
                        );


                    if (!card) {

                        return;

                    }


                    addProductToCart(
                        card
                    );

                }
            );

        }
    );

}


/* =========================================
   INITIALIZE PRODUCT FEATURES
========================================= */

function initializeProductFeatures() {

    initializeAddToCart();

    initializeWishlist();

    initializeQuickView();

}


/* =========================================
   PRODUCT COUNT
========================================= */

function updateProductCount() {

    const productInfo =
        document.querySelector(
            ".product-info p"
        );


    if (!productInfo) {

        return;

    }


    const container =
        document.querySelector(
            ".product-container"
        );


    if (!container) {

        return;

    }


    const visibleCards =
        Array.from(
            container.querySelectorAll(
                ".product-card"
            )
        ).filter(
            function (card) {

                return (
                    card.style.display !==
                    "none"
                );

            }
        );


    const count =
        visibleCards.length;


    if (count === 0) {

        productInfo.textContent =
            "No products found.";

        return;

    }


    productInfo.textContent =
        "Showing 1 - " +
        count +
        " of " +
        count +
        " Products";

}


/* =========================================
   SEARCH BUTTON
========================================= */

function initializeSearchButton() {

    const searchButton =
        document.querySelector(
            ".search-box .btn"
        );


    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    if (
        !searchButton ||
        !searchInput
    ) {

        return;

    }


    searchButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            applyProductFilters();

        }
    );

}


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
           Initialize static cards first
        */

        initializeProductFeatures();

        initializeProductSearch();

        initializeProductFilters();

        initializeSearchButton();

        updateProductCount();


        /*
           Then try backend API
        */

        await loadProductsFromAPI();

    }
);