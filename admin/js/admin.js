 // =========================
// ADMIN ACCESS CHECK
// =========================

const isAdminDashboard =
    window.location.pathname.includes("/admin/dashboard.html");

if (isAdminDashboard) {

    const admin = localStorage.getItem("dayliAdmin");

    if (!admin) {
        window.location.href = "login.html";
    }
}
 // =========================
// ADMIN LOGIN
// =========================

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("adminEmail").value.trim();

        const password =
            document.getElementById("adminPassword").value;

        if (!email || !password) {

            alert("Please enter email and password.");

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/admin-login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Admin login failed."
                );

                return;
            }

            // Save admin information

            localStorage.setItem(
                "dayliAdmin",
                JSON.stringify(data.user)
            );

            alert("Admin login successful!");

            // Go to admin dashboard

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );

            alert(
                "Cannot connect to server. Please make sure the backend server is running."
            );
        }
    });
}


// =========================
// LOAD ADMIN DASHBOARD DATA
// =========================

const dashboardPage =
    document.querySelector(".dashboard-cards");

if (dashboardPage) {

    async function loadDashboardData() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/admin/dashboard"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Failed to load dashboard data"
                );
            }


            // =========================
            // UPDATE STATISTICS
            // =========================

            document.getElementById(
                "totalProducts"
            ).textContent =
                data.statistics.totalProducts;


            document.getElementById(
                "totalOrders"
            ).textContent =
                data.statistics.totalOrders;


            document.getElementById(
                "totalCustomers"
            ).textContent =
                data.statistics.totalCustomers;


            document.getElementById(
                "totalRevenue"
            ).textContent =
                "฿" +
                Number(
                    data.statistics.totalRevenue
                ).toLocaleString();

                // =========================
// SALES OVERVIEW
// =========================

if (data.salesOverview) {

    document.getElementById("todaySales").textContent =
        "฿" + Number(data.salesOverview.today || 0).toLocaleString();

    document.getElementById("monthlySales").textContent =
        "฿" + Number(data.salesOverview.thisMonth || 0).toLocaleString();

    document.getElementById("yearlySales").textContent =
        "฿" + Number(data.salesOverview.thisYear || 0).toLocaleString();

}


            // =========================
            // LOAD RECENT ORDERS
            // =========================

            const recentOrdersBody =
                document.getElementById(
                    "recentOrdersBody"
                );


            if (recentOrdersBody) {

                recentOrdersBody.innerHTML = "";


                // No orders

                if (
                    !data.recentOrders ||
                    data.recentOrders.length === 0
                ) {

                    recentOrdersBody.innerHTML = `
                        <tr>
                            <td colspan="4">
                                No orders found
                            </td>
                        </tr>
                    `;

                } else {

                    // Add each recent order

                    data.recentOrders.forEach(
                        function (order) {

                            const row =
                                document.createElement("tr");


                            // Example:
                            // Database ID 9
                            // Display: #DNS0009

                            const orderId =
                                "#DNS" +
                                String(order.id)
                                    .padStart(4, "0");


                            const customerName =
                                order.customer_name ||
                                "Unknown Customer";


                            const amount =
                                Number(
                                    order.total_amount || 0
                                ).toLocaleString();


                            const status =
                                order.status ||
                                "pending";


                            const statusClass =
                                status.toLowerCase();


                            const displayStatus =
                                status.charAt(0).toUpperCase() +
                                status.slice(1);


                            row.innerHTML = `

                                <td>
                                    ${orderId}
                                </td>

                                <td>
                                    ${customerName}
                                </td>

                                <td>
                                    ฿${amount}
                                </td>

                                <td>
                                    <span class="status ${statusClass}">
                                        ${displayStatus}
                                    </span>
                                </td>

                            `;


                            recentOrdersBody.appendChild(
                                row
                            );

                        }
                    );

                }
            }


        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );


            // Show error inside Recent Orders table

            const recentOrdersBody =
                document.getElementById(
                    "recentOrdersBody"
                );


            if (recentOrdersBody) {

                recentOrdersBody.innerHTML = `
                    <tr>
                        <td colspan="4">
                            Failed to load recent orders
                        </td>
                    </tr>
                `;

            }

        }
    }


    // Load dashboard automatically

    loadDashboardData();

} 
// =========================
// ADMIN PRODUCTS
// =========================

const productsTableBody =
    document.getElementById("productsTableBody");

const productSearch =
    document.getElementById("productSearch");

let allProducts = [];


// =========================
// LOAD PRODUCTS
// =========================

async function loadAdminProducts() {

    if (!productsTableBody) {
        return;
    }

    try {

        productsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Loading products...
                </td>
            </tr>
        `;


        const response = await fetch(
            "http://localhost:5000/api/products"
        );


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Failed to load products"
            );

        }


        allProducts =
            data.products || [];


        displayProducts(allProducts);


    } catch (error) {

        console.error(
            "Products loading error:",
            error
        );


        productsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load products
                </td>
            </tr>
        `;

    }

}


// =========================
// DISPLAY PRODUCTS
// =========================

function displayProducts(products) {

    if (!productsTableBody) {
        return;
    }


    productsTableBody.innerHTML = "";


    if (!products || products.length === 0) {

        productsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No products found.
                </td>
            </tr>
        `;

        return;

    }


    products.forEach(function (product) {

        const row =
            document.createElement("tr");


      let image = "../assets/placeholder.jpg";

if (product.image) {

    if (
        product.image.startsWith("http://") ||
        product.image.startsWith("https://") ||
        product.image.startsWith("../")
    ) {

        image = product.image;

    } else {

        image = "../assets/" + product.image;

    }

}


        const category =
            product.category_name
                ? product.category_name
                : "Uncategorized";


        const price =
            Number(product.price || 0)
                .toLocaleString();


        const stock =
            Number(product.stock || 0);


        row.innerHTML = `

            <td>

                <img
                    src="${image}"
                    width="60"
                    height="60"
                    style="
                        object-fit: cover;
                        border-radius: 8px;
                    "
                    alt="${product.name}"
                    onerror="
                        this.src='../assets/placeholder.jpg'
                    "
                >

            </td>

            <td>
                ${product.name}
            </td>

            <td>
                ${category}
            </td>

            <td>
                ฿${price}
            </td>

            <td>
                ${stock}
            </td>

            <td>

                <button
                    type="button"
                    class="btn edit-product-btn"
                    data-id="${product.id}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn delete-btn delete-product-btn"
                    data-id="${product.id}"
                >
                    Delete
                </button>

            </td>

        `;


        productsTableBody.appendChild(row);

    });

}


// =========================
// SEARCH PRODUCTS
// =========================

if (productSearch) {

    productSearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .trim()
                    .toLowerCase();


            const filteredProducts =
                allProducts.filter(
                    function (product) {

                        const name =
                            product.name
                                ? product.name.toLowerCase()
                                : "";


                        const category =
                            product.category_name
                                ? product.category_name.toLowerCase()
                                : "";


                        return (
                            name.includes(searchText) ||
                            category.includes(searchText)
                        );

                    }
                );


            displayProducts(
                filteredProducts
            );

        }
    );

}


// =========================
// LOAD PRODUCTS
// =========================

loadAdminProducts();


// =========================
// ADD PRODUCT
// =========================

const addProductBtn =
    document.getElementById("addProductBtn");

const productModal =
    document.getElementById("productModal");

const closeProductModal =
    document.getElementById("closeProductModal");

const cancelProductBtn =
    document.getElementById("cancelProductBtn");

const addProductForm =
    document.getElementById("addProductForm");


// =========================
// OPEN MODAL
// =========================

if (addProductBtn && productModal) {

    addProductBtn.addEventListener(
        "click",
        function () {

            productModal.style.display = "flex";

        }
    );

}


// =========================
// CLOSE MODAL
// =========================

function closeProductModalWindow() {

    if (productModal) {

        productModal.style.display = "none";

    }

}


if (closeProductModal) {

    closeProductModal.addEventListener(
        "click",
        closeProductModalWindow
    );

}


if (cancelProductBtn) {

    cancelProductBtn.addEventListener(
        "click",
        closeProductModalWindow
    );

}


// =========================
// ADD PRODUCT FORM
// =========================

if (addProductForm) {

    addProductForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "productName"
                ).value.trim();


            const category_id =
                Number(
                    document.getElementById(
                        "productCategory"
                    ).value
                );


            const description =
                document.getElementById(
                    "productDescription"
                ).value.trim();


            const price =
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                );


            const stock =
                Number(
                    document.getElementById(
                        "productStock"
                    ).value
                );


            const image =
                document.getElementById(
                    "productImage"
                ).value.trim();


            if (!name) {

                alert(
                    "Please enter product name."
                );

                return;

            }


            if (!category_id) {

                alert(
                    "Please enter category ID."
                );

                return;

            }


            if (price < 0 || stock < 0) {

                alert(
                    "Price and stock cannot be negative."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/products",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                category_id:
                                    category_id,

                                name:
                                    name,

                                description:
                                    description,

                                price:
                                    price,

                                image:
                                    image,

                                stock:
                                    stock

                            })

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to add product"
                    );

                }


                alert(
                    "Product added successfully!"
                );


                addProductForm.reset();


                closeProductModalWindow();


                // Reload product list

                if (
                    typeof loadAdminProducts ===
                    "function"
                ) {

                    loadAdminProducts();

                } else {

                    window.location.reload();

                }


            } catch (error) {

                console.error(
                    "Add product error:",
                    error
                );


                alert(
                    error.message ||
                    "Failed to add product."
                );

            }

        }
    );

}
// =========================
// EDIT PRODUCT
// =========================

// Category list
const editCategories = [
    {
        id: 1,
        name: "Vegetables"
    },
    {
        id: 2,
        name: "Fruits"
    },
    {
        id: 3,
        name: "Rice"
    },
    {
        id: 4,
        name: "Oil"
    },
    {
        id: 5,
        name: "Dal"
    },
    {
        id: 6,
        name: "Masalas"
    },
    {
        id: 7,
        name: "Snacks"
    }
];


// =========================
// CREATE EDIT MODAL
// =========================

function createEditProductModal() {

    if (document.getElementById("editProductModal")) {
        return;
    }

    const modal =
        document.createElement("div");

    modal.id = "editProductModal";

    modal.style.cssText = `
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        z-index: 9999;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
    `;


    modal.innerHTML = `

        <div style="
            width: 100%;
            max-width: 550px;
            max-height: 90vh;
            overflow-y: auto;
            background: #ffffff;
            border-radius: 15px;
            padding: 30px;
            box-sizing: border-box;
            box-shadow: 0 15px 40px rgba(0,0,0,0.25);
        ">

            <h2 style="
                margin: 0 0 8px;
                color: #222;
            ">
                Edit Product
            </h2>

            <p style="
                margin: 0 0 25px;
                color: #777;
            ">
                Update product information
            </p>


            <form id="editProductForm">


                <!-- Product Name -->

                <div style="margin-bottom: 18px;">

                    <label style="
                        display: block;
                        margin-bottom: 7px;
                        font-weight: 600;
                    ">
                        Product Name
                    </label>

                    <input
                        type="text"
                        id="editProductName"
                        required
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                            box-sizing: border-box;
                        "
                    >

                </div>


                <!-- Category -->

                <div style="margin-bottom: 18px;">

                    <label style="
                        display: block;
                        margin-bottom: 7px;
                        font-weight: 600;
                    ">
                        Category
                    </label>

                    <select
                        id="editProductCategory"
                        required
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                            box-sizing: border-box;
                            background: #fff;
                        "
                    >

                        <option value="">
                            Select Category
                        </option>

                    </select>

                </div>


                <!-- Description -->

                <div style="margin-bottom: 18px;">

                    <label style="
                        display: block;
                        margin-bottom: 7px;
                        font-weight: 600;
                    ">
                        Description
                    </label>

                    <textarea
                        id="editProductDescription"
                        rows="4"
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                            box-sizing: border-box;
                            resize: vertical;
                        "
                    ></textarea>

                </div>


                <!-- Price -->

                <div style="margin-bottom: 18px;">

                    <label style="
                        display: block;
                        margin-bottom: 7px;
                        font-weight: 600;
                    ">
                        Price
                    </label>

                    <input
                        type="number"
                        id="editProductPrice"
                        min="0"
                        step="0.01"
                        required
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                            box-sizing: border-box;
                        "
                    >

                </div>


                <!-- Stock -->

                <div style="margin-bottom: 18px;">

                    <label style="
                        display: block;
                        margin-bottom: 7px;
                        font-weight: 600;
                    ">
                        Stock
                    </label>

                    <input
                        type="number"
                        id="editProductStock"
                        min="0"
                        required
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                            box-sizing: border-box;
                        "
                    >

                </div>


                <!-- Image -->

                <div style="margin-bottom: 25px;">

                    <label style="
                        display: block;
                        margin-bottom: 7px;
                        font-weight: 600;
                    ">
                        Image File Name
                    </label>

                    <input
                        type="text"
                        id="editProductImage"
                        placeholder="Example: rice.jpeg"
                        style="
                            width: 100%;
                            padding: 12px;
                            border: 1px solid #ccc;
                            border-radius: 8px;
                            box-sizing: border-box;
                        "
                    >

                </div>


                <!-- Buttons -->

                <div style="
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                ">

                    <button
                        type="button"
                        id="cancelEditProduct"
                        class="btn"
                        style="
                            background: #777;
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="btn"
                    >
                        Save Changes
                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(modal);


    // =========================
    // ADD CATEGORIES
    // =========================

    const categorySelect =
        document.getElementById(
            "editProductCategory"
        );


    editCategories.forEach(
        function (category) {

            const option =
                document.createElement("option");

            option.value =
                category.id;

            option.textContent =
                category.name;

            categorySelect.appendChild(
                option
            );

        }
    );


    // =========================
    // CANCEL BUTTON
    // =========================

    document
        .getElementById("cancelEditProduct")
        .addEventListener(
            "click",
            function () {

                modal.style.display = "none";

            }
        );


    // =========================
    // EDIT FORM SUBMIT
    // =========================

    document
        .getElementById("editProductForm")
        .addEventListener(
            "submit",
            saveEditedProduct
        );

}


// =========================
// OPEN EDIT MODAL
// =========================

async function openEditProduct(productId) {

    createEditProductModal();


    const product =
        allProducts.find(
            function (item) {

                return String(item.id) ===
                    String(productId);

            }
        );


    if (!product) {

        alert("Product not found.");

        return;

    }


    document.getElementById(
        "editProductName"
    ).value =
        product.name || "";


    document.getElementById(
        "editProductCategory"
    ).value =
        product.category_id || "";


    document.getElementById(
        "editProductDescription"
    ).value =
        product.description || "";


    document.getElementById(
        "editProductPrice"
    ).value =
        product.price || 0;


    document.getElementById(
        "editProductStock"
    ).value =
        product.stock || 0;


    document.getElementById(
        "editProductImage"
    ).value =
        product.image || "";


    const modal =
        document.getElementById(
            "editProductModal"
        );


    modal.dataset.productId =
        productId;


    modal.style.display = "flex";

}


// =========================
// SAVE EDITED PRODUCT
// =========================

async function saveEditedProduct(event) {

    event.preventDefault();


    const modal =
        document.getElementById(
            "editProductModal"
        );


    const productId =
        modal.dataset.productId;


    const name =
        document.getElementById(
            "editProductName"
        ).value.trim();


    const category_id =
        Number(
            document.getElementById(
                "editProductCategory"
            ).value
        );


    const description =
        document.getElementById(
            "editProductDescription"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "editProductPrice"
            ).value
        );


    const stock =
        Number(
            document.getElementById(
                "editProductStock"
            ).value
        );


    const image =
        document.getElementById(
            "editProductImage"
        ).value.trim();


    // =========================
    // VALIDATION
    // =========================

    if (!name) {

        alert(
            "Please enter product name."
        );

        return;

    }


    if (!category_id) {

        alert(
            "Please select a category."
        );

        return;

    }


    if (price < 0 || stock < 0) {

        alert(
            "Price and stock cannot be negative."
        );

        return;

    }


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/products/" +
                productId,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        category_id:
                            category_id,

                        name:
                            name,

                        description:
                            description,

                        price:
                            price,

                        image:
                            image,

                        stock:
                            stock

                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to update product"
            );

        }


        alert(
            "Product updated successfully!"
        );


        modal.style.display = "none";


        // Reload products

        loadAdminProducts();


    } catch (error) {

        console.error(
            "Edit product error:",
            error
        );


        alert(
            error.message ||
            "Failed to update product."
        );

    }

}


// =========================
// EDIT BUTTON CLICK
// =========================

document.addEventListener(
    "click",
    function (event) {

        const editButton =
            event.target.closest(
                ".edit-product-btn"
            );


        if (!editButton) {
            return;
        }


        const productId =
            editButton.dataset.id;


        openEditProduct(productId);

    }
);
// =========================
// DELETE PRODUCT
// =========================

document.addEventListener(
    "click",
    async function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-product-btn"
            );

        if (!deleteButton) {
            return;
        }

        const productId =
            deleteButton.dataset.id;

        const product =
            allProducts.find(
                function (item) {

                    return String(item.id) ===
                        String(productId);

                }
            );

        const productName =
            product
                ? product.name
                : "this product";

        const confirmed =
            confirm(
                `Are you sure you want to delete "${productName}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/products/" +
                    productId,
                    {
                        method: "DELETE"
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to delete product"
                );
            }

            alert(
                "Product deleted successfully!"
            );

            await loadAdminProducts();

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );

            alert(
                error.message ||
                "Failed to delete product."
            );
        }
    }
);
// =========================
// ADMIN CATEGORIES
// =========================

const categoriesTableBody =
    document.getElementById("categoriesTableBody");

const categorySearch =
    document.getElementById("categorySearch");

let allCategories = [];


// =========================
// LOAD CATEGORIES
// =========================

async function loadAdminCategories() {

    if (!categoriesTableBody) {
        return;
    }

    try {

        categoriesTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Loading categories...
                </td>
            </tr>
        `;

        const response =
            await fetch(
                "http://localhost:5000/api/categories"
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Failed to load categories"
            );
        }

        allCategories =
            data.categories || [];

        displayCategories(
            allCategories
        );

    } catch (error) {

        console.error(
            "Categories loading error:",
            error
        );

        categoriesTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load categories
                </td>
            </tr>
        `;
    }
}


// =========================
// DISPLAY CATEGORIES
// =========================

function displayCategories(categories) {

    if (!categoriesTableBody) {
        return;
    }

    categoriesTableBody.innerHTML = "";

    if (
        !categories ||
        categories.length === 0
    ) {

        categoriesTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No categories found.
                </td>
            </tr>
        `;

        return;
    }

    categories.forEach(
        function (category) {

            const row =
                document.createElement("tr");

            const createdDate =
                category.created_at
                    ? new Date(
                        category.created_at
                    ).toLocaleDateString()
                    : "-";

             row.innerHTML = `
    <td>
        ${category.id}
    </td>

    <td>
        ${
            category.image
                ? `
                    <img
                        src="http://localhost:5000/uploads/${category.image}"
                        alt="${category.name}"
                        style="
                            width: 60px;
                            height: 60px;
                            object-fit: cover;
                            border-radius: 8px;
                        "
                    >
                `
                : "No Image"
        }
    </td>

    <td>
        ${category.name}
    </td>
                <td>
                    ${category.description || "-"}
                </td>

                <td>
                    ${createdDate}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn edit-category-btn"
                        data-id="${category.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn delete-btn delete-category-btn"
                        data-id="${category.id}"
                    >
                        Delete
                    </button>

                </td>
            `;

            categoriesTableBody.appendChild(
                row
            );
        }
    );
}


// =========================
// SEARCH CATEGORIES
// =========================

if (categorySearch) {

    categorySearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .trim()
                    .toLowerCase();

            const filteredCategories =
                allCategories.filter(
                    function (category) {

                        const name =
                            category.name
                                ? category.name.toLowerCase()
                                : "";

                        const description =
                            category.description
                                ? category.description.toLowerCase()
                                : "";

                        return (
                            name.includes(searchText) ||
                            description.includes(searchText)
                        );
                    }
                );

            displayCategories(
                filteredCategories
            );
        }
    );
}


// =========================
// LOAD CATEGORIES
// =========================

loadAdminCategories();

// =========================
// ADD CATEGORY
// =========================

const addCategoryBtn =
    document.getElementById("addCategoryBtn");

const categoryModal =
    document.getElementById("categoryModal");

const closeCategoryModal =
    document.getElementById("closeCategoryModal");

const cancelCategoryBtn =
    document.getElementById("cancelCategoryBtn");

const addCategoryForm =
    document.getElementById("addCategoryForm");


// OPEN CATEGORY MODAL

if (addCategoryBtn && categoryModal) {

    addCategoryBtn.addEventListener(
        "click",
        function () {

            categoryModal.style.display = "flex";

        }
    );
}


// CLOSE CATEGORY MODAL

function closeCategoryModalWindow() {

    if (categoryModal) {

        categoryModal.style.display = "none";

    }
}


if (closeCategoryModal) {

    closeCategoryModal.addEventListener(
        "click",
        closeCategoryModalWindow
    );

}


if (cancelCategoryBtn) {

    cancelCategoryBtn.addEventListener(
        "click",
        closeCategoryModalWindow
    );

}


// =========================
// ADD CATEGORY FORM
// =========================

 if (addCategoryForm) {
    addCategoryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "categoryName"
                ).value.trim();

            const description =
                document.getElementById(
                    "categoryDescription"
                ).value.trim();

            const imageInput =
                document.getElementById(
                    "categoryImage"
                );

            if (!name) {
                alert(
                    "Please enter category name."
                );
                return;
            }

            const formData =
                new FormData();

            formData.append(
                "name",
                name
            );

            formData.append(
                "description",
                description
            );

            if (
                imageInput &&
                imageInput.files.length > 0
            ) {
                formData.append(
                    "image",
                    imageInput.files[0]
                );
            }

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/categories",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.message ||
                        "Failed to add category"
                    );
                }

                alert(
                    "Category added successfully!"
                );

                addCategoryForm.reset();

                closeCategoryModalWindow();

                await loadAdminCategories();

            } catch (error) {

                console.error(
                    "Add category error:",
                    error
                );

                alert(
                    error.message ||
                    "Failed to add category."
                );
            }
        }
    );
}

// =========================
// EDIT CATEGORY
// =========================

const editCategoryModal =
    document.getElementById(
        "editCategoryModal"
    );

const closeEditCategoryModal =
    document.getElementById(
        "closeEditCategoryModal"
    );

const cancelEditCategoryBtn =
    document.getElementById(
        "cancelEditCategoryBtn"
    );

const editCategoryForm =
    document.getElementById(
        "editCategoryForm"
    );

const editCategoryId =
    document.getElementById(
        "editCategoryId"
    );

const editCategoryName =
    document.getElementById(
        "editCategoryName"
    );

const editCategoryDescription =
    document.getElementById(
        "editCategoryDescription"
    );

const editCategoryImage =
    document.getElementById(
        "editCategoryImage"
    );

const currentCategoryImage =
    document.getElementById(
        "currentCategoryImage"
    );


// OPEN EDIT MODAL

document.addEventListener(
    "click",
    function (event) {

        const editButton =
            event.target.closest(
                ".edit-category-btn"
            );

        if (!editButton) {
            return;
        }

        const categoryId =
            editButton.dataset.id;

        const category =
            allCategories.find(
                function (item) {
                    return String(item.id) ===
                        String(categoryId);
                }
            );

        if (!category) {
            alert(
                "Category not found."
            );
            return;
        }

        editCategoryId.value =
            category.id;

        editCategoryName.value =
            category.name || "";

        editCategoryDescription.value =
            category.description || "";

        if (
            category.image &&
            currentCategoryImage
        ) {

            currentCategoryImage.innerHTML = `
                <p
                    style="
                        margin-bottom: 6px;
                        color: #555;
                    "
                >
                    Current Image:
                </p>

                <img
                    src="http://localhost:5000/uploads/${category.image}"
                    alt="${category.name}"
                    style="
                        width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border-radius: 10px;
                    "
                >
            `;

        } else if (currentCategoryImage) {

            currentCategoryImage.innerHTML = `
                <p style="color: #777;">
                    No current image.
                </p>
            `;
        }

        if (editCategoryImage) {
            editCategoryImage.value = "";
        }

        if (editCategoryModal) {
            editCategoryModal.style.display =
                "flex";
        }
    }
);


// CLOSE EDIT MODAL

function closeEditCategoryWindow() {

    if (editCategoryModal) {

        editCategoryModal.style.display =
            "none";
    }
}


if (closeEditCategoryModal) {

    closeEditCategoryModal.addEventListener(
        "click",
        closeEditCategoryWindow
    );
}


if (cancelEditCategoryBtn) {

    cancelEditCategoryBtn.addEventListener(
        "click",
        closeEditCategoryWindow
    );
}


// UPDATE CATEGORY

if (editCategoryForm) {

    editCategoryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const categoryId =
                editCategoryId.value;

            const name =
                editCategoryName.value.trim();

            const description =
                editCategoryDescription.value.trim();

            if (!categoryId) {

                alert(
                    "Category ID is missing."
                );

                return;
            }

            if (!name) {

                alert(
                    "Please enter category name."
                );

                return;
            }

            const formData =
                new FormData();

            formData.append(
                "name",
                name
            );

            formData.append(
                "description",
                description
            );

            if (
                editCategoryImage &&
                editCategoryImage.files.length > 0
            ) {

                formData.append(
                    "image",
                    editCategoryImage.files[0]
                );
            }

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/categories/" +
                        categoryId,
                        {
                            method: "PUT",
                            body: formData
                        }
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to update category"
                    );
                }

                alert(
                    "Category updated successfully!"
                );

                closeEditCategoryWindow();

                await loadAdminCategories();

            } catch (error) {

                console.error(
                    "Update category error:",
                    error
                );

                alert(
                    error.message ||
                    "Failed to update category."
                );
            }
        }
    );
}
// =========================
// DELETE CATEGORY
// =========================

document.addEventListener(
    "click",
    async function (event) {

        const deleteButton =
            event.target.closest(
                ".delete-category-btn"
            );

        if (!deleteButton) {
            return;
        }

        const categoryId =
            deleteButton.dataset.id;

        const category =
            allCategories.find(
                function (item) {
                    return String(item.id) ===
                        String(categoryId);
                }
            );

        const categoryName =
            category
                ? category.name
                : "this category";

        const confirmed =
            confirm(
                `Are you sure you want to delete "${categoryName}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/categories/" +
                    categoryId,
                    {
                        method: "DELETE"
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to delete category"
                );
            }

            alert(
                "Category deleted successfully!"
            );

            await loadAdminCategories();

        } catch (error) {

            console.error(
                "Delete category error:",
                error
            );

            alert(
                error.message ||
                "Failed to delete category."
            );
        }
    }
);

// =====================================================
// ADMIN ORDERS
// Load real orders from backend
// =====================================================

let allAdminOrders = [];


// =========================
// LOAD ADMIN ORDERS
// =========================

async function loadAdminOrders() {

    const ordersTableBody =
        document.getElementById("ordersTableBody");

    // This prevents the code from affecting
    // pages that do not contain the orders table.
    if (!ordersTableBody) {
        return;
    }

    ordersTableBody.innerHTML = `
        <tr>
            <td colspan="6">
                Loading orders...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/orders/admin/all"
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {
            throw new Error(
                data.message ||
                "Failed to load orders"
            );
        }

        allAdminOrders =
            data.orders || [];

        displayAdminOrders(
            allAdminOrders
        );

    } catch (error) {

        console.error(
            "Load admin orders error:",
            error
        );

        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Failed to load orders.
                </td>
            </tr>
        `;
    }
}

// =========================
// LOAD ADMIN CUSTOMERS
// =========================

async function loadAdminCustomers() {

    const customersTableBody =
        document.getElementById("customersTableBody");

    // Prevent this function from affecting
    // pages that do not contain the customers table.
    if (!customersTableBody) {
        return;
    }

    customersTableBody.innerHTML = `
        <tr>
            <td colspan="7">
                Loading customers...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/users/admin/all"
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {
            throw new Error(
                data.message ||
                "Failed to load customers"
            );
        }

        const customers =
            data.users || [];

        displayAdminCustomers(
            customers
        );

    } catch (error) {

        console.error(
            "Load admin customers error:",
            error
        );

        customersTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Failed to load customers.
                </td>
            </tr>
        `;
    }
}


// =========================
// DISPLAY ADMIN ORDERS
// =========================

function displayAdminOrders(orders) {

    const ordersTableBody =
        document.getElementById(
            "ordersTableBody"
        );

    if (!ordersTableBody) {
        return;
    }

    if (
        !orders ||
        orders.length === 0
    ) {

        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No orders found.
                </td>
            </tr>
        `;

        return;
    }

    ordersTableBody.innerHTML =
        orders.map(
            function (order) {

                const orderNumber =
                    "DNS" +
                    String(order.id)
                        .padStart(4, "0");

                const customerName =
                    order.user_name ||
                    "Guest Customer";

                const total =
                    Number(
                        order.total_amount || 0
                    ).toFixed(2);

                const status =
                    order.status ||
                    "pending";

                const statusClass =
                    status
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9_-]/g,
                            ""
                        );

                const createdDate =
                    order.created_at
                        ? new Date(
                            order.created_at
                        ).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        )
                        : "-";

                return `
                    <tr>

                        <td>
                            #${orderNumber}
                        </td>

                        <td>
                            ${escapeAdminOrderHTML(
                                customerName
                            )}
                        </td>

                        <td>
                            ${createdDate}
                        </td>

                        <td>
                            ฿${total}
                        </td>

                        <td>
                            <span
                                class="status ${statusClass}"
                            >
                                ${escapeAdminOrderHTML(
                                    status
                                )}
                            </span>
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn view-order-btn"
                                data-id="${order.id}"
                            >
                                View
                            </button>

                            <button
                                type="button"
                                class="btn update-order-btn"
                                data-id="${order.id}"
                                data-status="${order.status}"
                            >
                                Update
                            </button>

                        </td>

                    </tr>
                `;
            }
        ).join("");
}


// =========================
// ESCAPE HTML
// =========================

function escapeAdminOrderHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =========================
// DISPLAY ADMIN CUSTOMERS
// =========================

function displayAdminCustomers(customers) {

    const customersTableBody =
        document.getElementById(
            "customersTableBody"
        );

    if (!customersTableBody) {
        return;
    }

    if (
        !customers ||
        customers.length === 0
    ) {

        customersTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No customers found.
                </td>
            </tr>
        `;

        return;
    }

    customersTableBody.innerHTML =
        customers
            .filter(function (customer) {

                // Do not show admin accounts
                return customer.role !== "admin";

            })
            .map(function (customer) {

                const customerId =
                    customer.id || "-";

                const customerName =
                    customer.name || "-";

                const email =
                    customer.email || "-";

                const phone =
                    customer.phone || "-";

                const createdDate =
                    customer.created_at
                        ? new Date(
                            customer.created_at
                        ).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        )
                        : "-";

                return `
                    <tr>

                        <td>
                            ${customerId}
                        </td>

                        <td>
                            ${escapeAdminOrderHTML(
                                customerName
                            )}
                        </td>

                        <td>
                            ${escapeAdminOrderHTML(
                                email
                            )}
                        </td>

                        <td>
                            ${escapeAdminOrderHTML(
                                phone
                            )}
                        </td>

                        <td>
                            ${createdDate}
                        </td>

                        <td>
                            ${Number(customer.order_count||0)}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn view-customer-btn"
                                data-id="${customerId}"
                            >
                                View
                            </button>

                        </td>

                    </tr>
                `;

            })
            .join("");
}

// =========================
// SEARCH ORDERS
// =========================

const orderSearch =
    document.getElementById(
        "orderSearch"
    );

if (orderSearch) {

    orderSearch.addEventListener(
        "input",
        function () {

            const searchText =
                this.value
                    .trim()
                    .toLowerCase();

            const filteredOrders =
                allAdminOrders.filter(
                    function (order) {

                        const orderNumber =
                            "DNS" +
                            String(order.id)
                                .padStart(4, "0");

                        const customerName =
                            order.user_name ||
                            "Guest Customer";

                        const status =
                            order.status ||
                            "";

                        return (
                            orderNumber
                                .toLowerCase()
                                .includes(searchText) ||

                            customerName
                                .toLowerCase()
                                .includes(searchText) ||

                            status
                                .toLowerCase()
                                .includes(searchText)
                        );
                    }
                );

            displayAdminOrders(
                filteredOrders
            );
        }
    );
}


 // =========================
// VIEW ORDER
// =========================

document.addEventListener(
    "click",
    async function (event) {

        const viewButton =
            event.target.closest(
                ".view-order-btn"
            );

        if (!viewButton) {
            return;
        }

        const orderId =
            viewButton.dataset.id;

        const modal =
            document.getElementById(
                "orderDetailsModal"
            );

        const content =
            document.getElementById(
                "orderDetailsContent"
            );

        if (!modal || !content) {
            return;
        }

        // Open modal
        modal.style.display = "flex";

        content.innerHTML = `
            <p>
                Loading order details...
            </p>
        `;

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/orders/" +
                    orderId
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success ||
                !data.order
            ) {
                throw new Error(
                    data.message ||
                    "Failed to load order"
                );
            }

            const order =
                data.order;

            const orderNumber =
                "DNS" +
                String(order.id)
                    .padStart(4, "0");

            const customerName =
                order.user_name ||
                "Guest Customer";

            const customerEmail =
                order.user_email ||
                "Not available";

            const status =
                order.status ||
                "pending";

            const paymentStatus =
                order.payment_status ||
                "pending";

            const total =
                Number(
                    order.total_amount || 0
                ).toFixed(2);

            const orderDate =
                order.created_at
                    ? new Date(
                        order.created_at
                    ).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "-";

            const shippingAddress =
                order.shipping_address ||
                "Not available";


            // =========================
            // ORDER ITEMS
            // =========================

            let itemsHTML = "";

            if (
                order.items &&
                order.items.length > 0
            ) {

                itemsHTML = `
                    <div style="margin-top: 25px;">

                        <h3
                            style="
                                margin-bottom: 15px;
                            "
                        >
                            Ordered Products
                        </h3>

                        <div
                            style="
                                overflow-x: auto;
                            "
                        >

                            <table
                                style="
                                    width: 100%;
                                    border-collapse: collapse;
                                "
                            >

                                <thead>

                                    <tr>

                                        <th
                                            style="
                                                padding: 10px;
                                                text-align: left;
                                                border-bottom: 1px solid #ddd;
                                            "
                                        >
                                            Product
                                        </th>

                                        <th
                                            style="
                                                padding: 10px;
                                                text-align: center;
                                                border-bottom: 1px solid #ddd;
                                            "
                                        >
                                            Qty
                                        </th>

                                        <th
                                            style="
                                                padding: 10px;
                                                text-align: right;
                                                border-bottom: 1px solid #ddd;
                                            "
                                        >
                                            Price
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    ${order.items.map(
                                        function (item) {

                                            return `
                                                <tr>

                                                    <td
                                                        style="
                                                            padding: 10px;
                                                            border-bottom: 1px solid #eee;
                                                        "
                                                    >
                                                        ${escapeAdminOrderHTML(
                                                            item.product_name ||
                                                            "Product"
                                                        )}
                                                    </td>

                                                    <td
                                                        style="
                                                            padding: 10px;
                                                            text-align: center;
                                                            border-bottom: 1px solid #eee;
                                                        "
                                                    >
                                                        ${item.quantity}
                                                    </td>

                                                    <td
                                                        style="
                                                            padding: 10px;
                                                            text-align: right;
                                                            border-bottom: 1px solid #eee;
                                                        "
                                                    >
                                                        ฿${Number(
                                                            item.price || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                </tr>
                                            `;
                                        }
                                    ).join("")}

                                </tbody>

                            </table>

                        </div>

                    </div>
                `;

            } else {

                itemsHTML = `
                    <p
                        style="
                            margin-top: 20px;
                            color: #777;
                        "
                    >
                        No product details available.
                    </p>
                `;
            }


            // =========================
            // SHOW ORDER DETAILS
            // =========================

            content.innerHTML = `

                <div>

                    <div
                        style="
                            display: grid;
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr));
                            gap: 20px;
                        "
                    >

                        <div>

                            <strong>
                                Order ID
                            </strong>

                            <p>
                                #${orderNumber}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Order Date
                            </strong>

                            <p>
                                ${orderDate}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Customer
                            </strong>

                            <p>
                                ${escapeAdminOrderHTML(
                                    customerName
                                )}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Email
                            </strong>

                            <p>
                                ${escapeAdminOrderHTML(
                                    customerEmail
                                )}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Order Status
                            </strong>

                            <p>
                                <span
                                    class="status ${escapeAdminOrderHTML(
                                        status
                                    )}"
                                >
                                    ${escapeAdminOrderHTML(
                                        status
                                    )}
                                </span>
                            </p>

                        </div>


                        <div>

                            <strong>
                                Payment Status
                            </strong>

                            <p>
                                ${escapeAdminOrderHTML(
                                    paymentStatus
                                )}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Shipping Address
                            </strong>

                            <p>
                                ${escapeAdminOrderHTML(
                                    shippingAddress
                                )}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Total Amount
                            </strong>

                            <p
                                style="
                                    font-size: 20px;
                                    font-weight: 700;
                                    color: #ff9800;
                                "
                            >
                                ฿${total}
                            </p>

                        </div>

                    </div>

                    ${itemsHTML}

                    <div class="modal-actions" style="margin-top:25px;">
    <button
        type="button"
        class="btn"
        id="generateBillBtn"
        data-id="${order.id}"
    >
        Generate Bill
    </button>
</div>

                </div>

            `;

        } catch (error) {

            console.error(
                "View order error:",
                error
            );

            content.innerHTML = `
                <p
                    style="
                        color: #d32f2f;
                    "
                >
                    Failed to load order details.
                </p>
            `;
        }
    }
);


// =========================
// CLOSE ORDER DETAILS MODAL
// =========================

function closeOrderDetailsModal() {

    const modal =
        document.getElementById(
            "orderDetailsModal"
        );

    if (modal) {
        modal.style.display = "none";
    }
}


const closeOrderDetailsModalButton =
    document.getElementById(
        "closeOrderDetailsModal"
    );

if (closeOrderDetailsModalButton) {

    closeOrderDetailsModalButton.addEventListener(
        "click",
        closeOrderDetailsModal
    );
}


const closeOrderDetailsButton =
    document.getElementById(
        "closeOrderDetailsBtn"
    );

if (closeOrderDetailsButton) {

    closeOrderDetailsButton.addEventListener(
        "click",
        closeOrderDetailsModal
    );
}

// =========================
// EXPORT ORDERS
// =========================

const exportOrdersBtn =
    document.getElementById(
        "exportOrdersBtn"
    );

if (exportOrdersBtn) {

    exportOrdersBtn.addEventListener(
        "click",
        function () {

            if (
                !allAdminOrders ||
                allAdminOrders.length === 0
            ) {

                alert(
                    "There are no orders to export."
                );

                return;
            }

            let csv =
                "Order ID,Customer,Email,Date,Total,Status,Payment Status\n";

            allAdminOrders.forEach(
                function (order) {

                    const orderNumber =
                        "DNS" +
                        String(order.id)
                            .padStart(4, "0");

                    const customer =
                        order.user_name ||
                        "Guest Customer";

                    const email =
                        order.user_email ||
                        "";

                    const date =
                        order.created_at
                            ? new Date(
                                order.created_at
                            ).toLocaleDateString(
                                "en-GB"
                            )
                            : "";

                    const total =
                        Number(
                            order.total_amount || 0
                        ).toFixed(2);

                    const status =
                        order.status ||
                        "pending";

                    const paymentStatus =
                        order.payment_status ||
                        "pending";

                    csv +=
                        `"${orderNumber}",` +
                        `"${customer}",` +
                        `"${email}",` +
                        `"${date}",` +
                        `"${total}",` +
                        `"${status}",` +
                        `"${paymentStatus}"\n`;
                }
            );

            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "dayli-orders.csv";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        }
    );
}


// =========================
// START ADMIN ORDERS
// =========================

loadAdminOrders();
loadAdminCustomers();
   
// =================================
// UPDATE ORDER STATUS MODAL
// =================================

let selectedUpdateOrderId = null;


// Open Update Status Modal
document.addEventListener("click", function (event) {

    const updateButton =
        event.target.closest(".update-order-btn");

    if (!updateButton) {
        return;
    }

    selectedUpdateOrderId =
        updateButton.dataset.id;

    if (!selectedUpdateOrderId) {
        alert("Order ID not found.");
        return;
    }

    const orderIdElement =
        document.getElementById("updateStatusOrderId");

    const statusSelect =
        document.getElementById("orderStatusSelect");

    const modal =
        document.getElementById("updateOrderStatusModal");

    if (!modal) {
        console.error(
            "Update Order Status modal not found."
        );
        return;
    }

    orderIdElement.textContent =
        `#${selectedUpdateOrderId}`;

    const currentStatus =
        updateButton.dataset.status;

    if (currentStatus) {
        statusSelect.value = currentStatus;
    }

    modal.style.display = "flex";

});


// Close Update Status Modal
function closeUpdateStatusModal() {

    const modal =
        document.getElementById("updateOrderStatusModal");

    if (modal) {
        modal.style.display = "none";
    }

    selectedUpdateOrderId = null;
}


// Close button
document.addEventListener("click", function (event) {

    if (
        event.target.id ===
        "closeUpdateStatusModal"
    ) {
        closeUpdateStatusModal();
    }

});


// Cancel button
document.addEventListener("click", function (event) {

    if (
        event.target.id ===
        "cancelUpdateStatusBtn"
    ) {
        closeUpdateStatusModal();
    }

});

// =================================
// SAVE UPDATED ORDER STATUS
// =================================

document.addEventListener("click", async function (event) {

    const saveButton =
        event.target.closest("#saveOrderStatusBtn");

    if (!saveButton) {
        return;
    }

    if (!selectedUpdateOrderId) {
        alert("Order ID not found.");
        return;
    }

    const statusSelect =
        document.getElementById("orderStatusSelect");

    const status =
        statusSelect.value;

    if (!status) {
        alert("Please select an order status.");
        return;
    }

    try {

        saveButton.disabled = true;
        saveButton.textContent = "Updating...";

        const response = await fetch(
            `http://localhost:5000/api/orders/admin/${selectedUpdateOrderId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Failed to update order status."
            );
        }

        const updatedOrderId = selectedUpdateOrderId;

        closeUpdateStatusModal();

        alert(
            `Order #${updatedOrderId} updated successfully.`
        );

        // Reload orders from database
        await loadAdminOrders();

    } catch (error) {

        console.error(
            "Save order status error:",
            error
        );

        alert(
            error.message ||
            "Failed to update order status."
        );

    } finally {

        saveButton.disabled = false;
        saveButton.textContent = "Update Status";

    }

});

// =========================
// VIEW CUSTOMER
// =========================

document.addEventListener(
    "click",
    async function (event) {

        const viewButton =
            event.target.closest(
                ".view-customer-btn"
            );

        if (!viewButton) {
            return;
        }

        const customerId =
            viewButton.dataset.id;

        const modal =
            document.getElementById(
                "customerDetailsModal"
            );

        const content =
            document.getElementById(
                "customerDetailsContent"
            );

        if (!modal || !content) {
            return;
        }


        // Open customer modal
        modal.style.display = "flex";


        // Show loading message
        content.innerHTML = `
            <p>
                Loading customer details...
            </p>
        `;


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/users/admin/" +
                    customerId
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success ||
                !data.customer
            ) {

                throw new Error(
                    data.message ||
                    "Failed to load customer"
                );

            }


            const customer =
                data.customer;


            // =========================
            // CUSTOMER INFORMATION
            // =========================

            const customerName =
                customer.name ||
                "Not available";

            const email =
                customer.email ||
                "Not available";

            const phone =
                customer.phone ||
                "Not available";

            const address =
                customer.address ||
                "Not available";

            const role =
                customer.role ||
                "customer";

            const joinDate =
                customer.created_at
                    ? new Date(
                        customer.created_at
                    ).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "-";


            // =========================
            // SHOW CUSTOMER DETAILS
            // =========================

            content.innerHTML = `

                <div
                    style="
                        display: grid;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                        gap: 20px;
                    "
                >

                    <div>

                        <strong>
                            Customer ID
                        </strong>

                        <p>
                            #${customer.id}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Join Date
                        </strong>

                        <p>
                            ${joinDate}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Name
                        </strong>

                        <p>
                            ${escapeAdminOrderHTML(
                                customerName
                            )}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Email
                        </strong>

                        <p>
                            ${escapeAdminOrderHTML(
                                email
                            )}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Phone
                        </strong>

                        <p>
                            ${escapeAdminOrderHTML(
                                phone
                            )}
                        </p>

                    </div>


                    <div>

                        <strong>
                            Account Type
                        </strong>

                        <p>
                            ${escapeAdminOrderHTML(
                                role
                            )}
                        </p>

                    </div>


                    <div
                        style="
                            grid-column: 1 / -1;
                        "
                    >

                        <strong>
                            Address
                        </strong>

                        <p>
                            ${escapeAdminOrderHTML(
                                address
                            )}
                        </p>

                    </div>

                </div>

            `;


        } catch (error) {

            console.error(
                "View customer error:",
                error
            );


            content.innerHTML = `
                <p
                    style="
                        color: #d32f2f;
                    "
                >
                    Failed to load customer details.
                </p>
            `;

        }

    }
);
// =========================
// CLOSE CUSTOMER DETAILS
// =========================

function closeCustomerDetailsModal() {

    const modal =
        document.getElementById(
            "customerDetailsModal"
        );

    if (modal) {
        modal.style.display = "none";
    }
}


const closeCustomerDetailsModalButton =
    document.getElementById(
        "closeCustomerDetailsModal"
    );

if (closeCustomerDetailsModalButton) {

    closeCustomerDetailsModalButton.addEventListener(
        "click",
        closeCustomerDetailsModal
    );

}


const closeCustomerDetailsButton =
    document.getElementById(
        "closeCustomerDetailsBtn"
    );

if (closeCustomerDetailsButton) {

    closeCustomerDetailsButton.addEventListener(
        "click",
        closeCustomerDetailsModal
    );

}

// =========================
// GENERATE BILL
// =========================

document.addEventListener(
    "click",
    function (event) {

        const generateBillButton =
            event.target.closest("#generateBillBtn");

        if (!generateBillButton) {
            return;
        }

        const orderId =
            generateBillButton.dataset.id;

        if (!orderId) {
            alert("Order ID not found.");
            return;
        }

        window.location.href =
            "billing.html?order_id=" + orderId;
    }
);