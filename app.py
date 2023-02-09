from flask import Flask, render_template, redirect, url_for, request
import validators
from validators import ValidationFailure
import replicate
app = Flask(__name__)

placeholder_imgs = ["https://img.freepik.com/free-vector/flat-winter-landscape_23-2149166540.jpg?w=500",
                    "https://thumbs.dreamstime.com/b/vector-winter-landscape-mountains-cote-background-my-creative-handdrawing-you-can-use-christmas-design-etc-30405576.jpg",
                    "https://cdna.artstation.com/p/assets/images/images/009/266/694/large/martin-strehovsky-winterlandscape-hd-s.jpg?1518020239",
                    "https://cdn.dribbble.com/users/2489595/screenshots/8659556/winter_landscape_with_deep_4x.jpg"]
LOCKED = [False, False, False, False]
NUM_IMAGES = 4
WIDTH = 512
HEIGHT = 256
OUTPUTS = placeholder_imgs
PROMPT = ""
START_URL = ""


def is_url(url):
    result = validators.url(url)
    return not isinstance(result, ValidationFailure)


def gen_image(i):
    model = replicate.models.get("stability-ai/stable-diffusion")
    if START_URL:  # use initial image
        output_url = model.predict(
            prompt=PROMPT, width=WIDTH, height=HEIGHT, init_image=START_URL)[0]
    else:  # no initial image
        output_url = model.predict(
            prompt=PROMPT, width=WIDTH, height=HEIGHT)[0]
    # output_url = placeholder_imgs[i]
    return output_url


def gen_set():  # generate set of images
    outputs = []
    for i in range(NUM_IMAGES):
        if LOCKED[i]:  # don't regenerate if image locked
            outputs.append(OUTPUTS[i])
        else:  # otherwise, generature new image
            outputs.append(gen_image(i))
    return outputs


def update_locked(new_locked):  # update which photos are locked
    global LOCKED
    lock_split = new_locked.split(",")
    LOCKED = [("True" in i) for i in lock_split]


@app.route('/')
def home():
    # load page
    return render_template("base.html", outputs=OUTPUTS, prompt=PROMPT, start_url=START_URL, locked=LOCKED)


@app.route("/update", methods=['POST'])  # update images
def update():
    global OUTPUTS
    global PROMPT
    global START_URL
    global LOCKED

    new_prompt = request.form.get("prompt")
    PROMPT = new_prompt
    START_URL = request.form.get("inspo")
    update_locked(request.form.get("lock"))

    if new_prompt and new_prompt != "Error. No prompt provided.":  # if non-empty & non-error prompt
        # update global params
        if START_URL == "" or is_url(START_URL):
            OUTPUTS = gen_set()
        else:
            START_URL = "Error. Invalid URL: \"" + START_URL + "\""
    else:
        PROMPT = "Error. No prompt provided."
    return redirect(url_for("home"))   # reload page


if __name__ == "__main__":
    app.run(debug=True)
