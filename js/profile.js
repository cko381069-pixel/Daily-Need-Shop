 const PROFILE_USER_KEY = "dayliUser";
const PROFILE_LOGIN_KEY = "dayliLoggedIn";

// ===============================
// Get Saved User
// ===============================
function getProfileUser() {

    try {

        const user = JSON.parse(
            localStorage.getItem(PROFILE_USER_KEY)
        );

        return user || null;

    } catch (error) {

        console.error("Unable to read user:", error);

        return null;
    }
}


// ===============================
// Display Profile
// ===============================
function displayProfile() {

    const user = getProfileUser();

    if (!user) {

        alert("No user account found.");

        window.location.href = "login.html";

        return;
    }


    // Profile Name
    const profileName =
        document.getElementById("profileName");

    if (profileName) {

        profileName.textContent =
            user.name || "User";
    }


    // Full Name
    const profileFullName =
        document.getElementById("profileFullName");

    if (profileFullName) {

        profileFullName.textContent =
            user.name || "-";
    }


    // Email
    const profileEmail =
        document.getElementById("profileEmail");

    if (profileEmail) {

        profileEmail.textContent =
            user.email || "-";
    }


    // Phone
    const profilePhone =
        document.getElementById("profilePhone");

    if (profilePhone) {

        profilePhone.textContent =
            user.phone || "-";
    }


    // Address
    const profileAddress =
        document.getElementById("profileAddress");

    if (profileAddress) {

        profileAddress.textContent =
            user.address || "-";
    }
}


// ===============================
// Logout
// ===============================
function profileLogout() {

    localStorage.removeItem(PROFILE_LOGIN_KEY);

    alert("You have been logged out successfully.");

    window.location.href = "login.html";
}


// ===============================
// Initialize Profile
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Check Login Status
        const loggedIn =
            localStorage.getItem(PROFILE_LOGIN_KEY);

        if (loggedIn !== "true") {

            alert("Please login first.");

            window.location.href = "login.html";

            return;
        }


        // Show User Information
        displayProfile();


        // Logout Button
        const logoutButton =
            document.getElementById("logoutBtn");

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                profileLogout
            );
        }

    }
);