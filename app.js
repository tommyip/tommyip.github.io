let content_tag = document.getElementById("content-tag");
let url_mapping = {
    "#about": {
        tag: "ABOUT",
    },
    "#projects": {
        tag: "PROJECTS",
    },
    "#blog": {
        tag: "BLOG",
    },
};


function handle_url() {
    let url = window.location.hash;
    let url_obj = url_mapping[url];

    if (url_obj !== undefined) {
        content_tag.innerHTML = url_obj.tag;
    } else {
        // TODO: Redirect to error 404 page.
        console.log(`Cannot find /${url}.`);
    }
}

if (window.location.hash === "") {
    // Auto redirect to the /#about page.
    window.location.hash = "#about";
}
handle_url();

window.onhashchange = handle_url;
