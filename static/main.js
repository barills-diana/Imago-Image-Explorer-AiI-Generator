const colorThief = new ColorThief(); // color palette extractor
const googleProxyURL =
    "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=";
const imgs = document.querySelectorAll("img");
for (let i in imgs) { // make sure we can generate color palettes
    let img = imgs[i];
    img.crossOrigin = "Anonymous";
    img.src = googleProxyURL + encodeURIComponent(img.src);
}

// suggestions
// story 1
const prompt1 = "a photo of an astronaut riding a horse on mars, digital illustration";
const url1 = "https://replicate.delivery/pbxt/44IRUUzl7fVtUygwhfS97r2lIaQ8JWVNn8TA9o5OTYEIQccQA/out-0.png";
// story 2
const prompt2 = "a photo of an astronaut riding a horse on mars, digital illustration";
const url2 = "https://replicate.delivery/pbxt/44IRUUzl7fVtUygwhfS97r2lIaQ8JWVNn8TA9o5OTYEIQccQA/out-0.png";

// text vars for story 2
const text2 = "a photo of an astronaut riding a horse on mars, digital illustration."
const cont2 = "dark, mysterious forest"
const style2 = "oil painting, muted colors"

function get_palette(img) { // save colors
    let colors = colorThief.getPalette(img).slice(0, 5);
    let palette = img.previousElementSibling;
    palette.html = ""; // clear html
    for (let i in colors) {
        let color = colors[i];
        let swatch = document.createElement("div");
        swatch.style = "background-color: rgb(" + color + ")";
        palette.appendChild(swatch);
    };
}

async function downloadImage(button) { // download img on click
    const image = button.parentElement.previousElementSibling;
    const img = await fetch(image.src);
    const blob = await img.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_image.png'
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function reset_copy_color() { // reset copy icons for color palette
    let copy_icons = $(".copy-icon");
    copy_icons.addClass("fa-clipboard");
    copy_icons.removeClass("fa-check");
    copy_icons.removeClass("copied");
}

function reset_copy_img() { // reset copy icons for image url
    let link_icons = $(".link-icon");
    link_icons.addClass("fa-link");
    link_icons.removeClass("fa-check");
    link_icons.removeClass("copied");
}

function get_url(button) { // helper function to extract image url
    const full_url = button.parent().prev().attr("src");
    let short_url = full_url.replace(googleProxyURL, ""); // remove proxy string
    short_url = decodeURIComponent(short_url); // decode
    return short_url
}

function download_all() { // download all imgs
    $(".download-icon").click();
}

// function email_writer() { // send writer list of image urls
//     let all_urls = "";
//     $(".link-icon").each(function () {
//         all_urls += get_url($(this)) + "%0D%0A";
//     })
//     const subject = "Reference Image Ideas"

//     let body = "Hi, here are some reference images I generated with ImagExplorer based on your requests:%0D%0A%0D%0A"
//     body += all_urls;
//     body += "%0D%0ALet me know what you think -- thanks!"

//     var mail = document.createElement("a");
//     mail.href = "mailto:catherineyeh@g.harvard.edu?subject=" + subject + "&body=" + body;
//     mail.click();
// }

function isStory2() { // check if story 2 should be loaded
    return $("#content-wrapper").hasClass("story2");
}

// load correct story on render
function load_story() {
    if (isStory2()) { // switch content
        $("#text-req").html(text2);
        $("#cont-req").html(cont2);
        $("#style-req").html(style2);
    }
}

$(document).ready(function () {
    load_story();

    // copy palette info
    $(".copy-icon").click(function () {
        let swatches = $(this).parent().find("div");
        let color_string = "";
        swatches.each(function () {
            color_string += $(this).css("background-color") + "\n";
        })

        navigator.clipboard.writeText(color_string);
        $(this).removeClass("fa-clipboard");
        $(this).addClass("fa-check");
        $(this).addClass("copied");
        reset_copy_img();
    })

    // copy image url
    $(".link-icon").click(function () {
        let short_url = get_url($(this));
        navigator.clipboard.writeText(short_url);
        $(this).removeClass("fa-link");
        $(this).addClass("fa-check");
        $(this).addClass("copied");
        reset_copy_color();
    })

    $(".img-wrapper").mouseleave(function () {
        // reset copy icons
        reset_copy_color();
        reset_copy_img();
    })

    $("#prompt-suggest").click(function () {
        // fill in suggested prompt
        $("#prompt").val((isStory2()) ? prompt2 : prompt1);
    })

    $("#image-suggest").click(function () {
        // fill in suggested url
        $("#inspo").val((isStory2()) ? url2 : url1);
    })

    $("#submit").click(function () { // show loading msg when new images being generated
        if ($("#prompt").val() && $("#prompt").val() != " ") { // non-empty prompt
            $("#img-grid").html("<div class='loading'></div>")
        }
    })

    $(".lock-icon").click(function () {
        $(this).toggleClass("locked");
        $(this).toggleClass("fa-lock");
        $(this).toggleClass("fa-unlock");

        let index = $(".lock-icon").index(this);
        let lock_data = $("#lock").val();
        if (lock_data.includes("[")) {
            lock_data = lock_data.slice(1, -1); // trim extra brackets
        }
        lock_data = lock_data.split(",");
        if (lock_data[index].includes("False")) {
            lock_data[index] = "True";
        } else {
            lock_data[index] = "False";
        } // toggle lock status

        $("#lock").val(lock_data.toString()); // update
    })
});