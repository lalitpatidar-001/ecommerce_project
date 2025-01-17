import { isAdmin } from "./helper/auth.js";
import { injectNavbar } from "./js/index.js";

document.addEventListener("click", (e) => {
    const { target } = e;
    // Check if an anchor link is clicked
    if (target.tagName !== 'A' || !target.getAttribute("href")) return;
    e.preventDefault();

    // prevent unneccessary reload
    const isPathNotChanged = event.target.getAttribute("href")=== window.location.hash
    if(isPathNotChanged) return;

    urlRoute(e);
    window.location.reload();

});

const routes = {
    "404": {
        page: "/src/pages/404.html"
    },
    "/": {
        page: "/src/pages/home.html"
    },
    "/dashboard": {
        page: "/src/pages/dashboard.html"
    },
    "/favorite": {
        page: "/src/pages/favorite.html"
    },
    "/signin": {
        page: "/src/pages/signin.html"
    },
    "/signup": {
        page: "/src/pages/signup.html"
    },
    "/add": {
        page: "/src/pages/addProduct.html"
    },
};

function urlRoute(event) {
    event = event || window.event;
    event.preventDefault();
   
    // Use hash-based routing
    window.location.hash = event.target.getAttribute("href");
    urlLocationHandler();
}

export async function urlLocationHandler() {
   
    // Use hash to get the location
    let location = window.location.hash.replace("#", "") || "/";

    // only accessible to admin
    if(location==="/dashboard"){
        const isUserAdmin = await isAdmin();
        if(!isUserAdmin) location=window.location.hash='#/'
    }

    const route = routes[location] || routes["404"];

    try {
        // fetching and injecting html pages
        const pageToInject = await fetch(route.page).then((response) => response.text());
        document.querySelector("#root").innerHTML = pageToInject;

        // removing nav from auth pages
        if (location === "/signin" || location === "/signup") {
            document.querySelector("#navbar").style.display = "none";
        } else {
            document.querySelector("#navbar").style.display = "block";
            await injectNavbar();
        }
    } catch (err) {
        console.log("page inject error", err);
    }
}

// Run the handler for the initial load
urlLocationHandler();

// Handle back/forward navigation
window.addEventListener("hashchange", urlLocationHandler);
