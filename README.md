# ImagExplorer
Unleash Your Creativity with the AI-powered Brainstorm Buddy for Writer-Artist Collaboration

Made with:
* Stable Diffusion ([Replicate API](https://replicate.com/stability-ai/stable-diffusion/api))
* Flask

## overview
![Screenshot](static/overview.png)

ImagExplorer is an innovative tool designed to help writers and artists communicate better and streamline the brainstorming process for creating reference images. This tool leverages the advanced capabilities of Stable Diffusion, a cutting-edge text-to-image AI model.

Artists are given the opportunity to view the original text and requests for illustrations from the writer, and can generate reference images by utilizing the tool's intuitive interface. ImagExplorer goes a step further and provides helpful suggestions for prompts and starting images, to help artists get started with generating images using Stable Diffusion.

The generated images are displayed in real-time on the right side of the screen, allowing artists to quickly and easily assess their results. If they are satisfied with what they see, they have the option to perform additional actions such as downloading or sharing the images with the writer.

With ImagExplorer, writers and artists can enjoy a seamless and efficient collaboration process, bridging the gap between imagination and creation.
## setup instructions
1. clone repo
```
git clone https://github.com/Diana-Barills/Image-Explorer
```

2. create virtual env
```
python3 -m venv env
```

3. activate env
```
source env/bin/activate
```

4. install requirements
```
pip3 install -r requirements.txt
```

5. set replicate API token env variable (grab token [here](https://replicate.com/account))
```
export REPLICATE_API_TOKEN=[your API key]
```

6. start app
```
python3 app.py
```
