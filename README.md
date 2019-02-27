# SceneVR
SceneVR is an engaging way to tell stories from an entirely new perspective. SceneVR turns your collection of panoramic and VR-ready photos into a series of navigable scenes, allowing you to create unique 360° narratives. A simple-to-use editor allows you to order your photos, add descriptions, and attach text right onto your pictures. Your stories can then be easily embedded and viewed anywhere using simple and intuitive controls. And best of all, because SceneVR runs entirely in your browser, your stories can be viewed on desktop, mobile devices and even the most popular VR devices without the need for any extra apps or plugins.


## Using Docker for Dev
An alternative to installing to your system is to just use Docker
Make sure you have [Docker](https://www.docker.com/products/docker-desktop) installed.

### Install 
Only need to run this once on your machine.
```
docker-compose -f docker-compose.builder.yml run --rm install
```

### Run Dev
Run this everytime you want to work on the project.
```
docker-compose up
```

## Local Installation

To use this template, your computer needs:

- [NodeJS](https://nodejs.org/en/) (0.12 or greater)

### Install dependencies by running this command from the project directory:
```bash
npm install
```

### Use this command to run the auto-compiler:
```bash
npm run start
```

### Use this command to compile for distribution:
```bash
npm run dist
```

## Data Model
```
project: {
    title: "Title",
    desc: "Description",
    scenes: [
        {
            caption: "Caption info",
            image_dir: "url_to_directory_of_images"
        },
        {
            caption: "Caption info",
            image_dir: "url_to_directory_of_images"
        }
    ]
}
```

## Image sizes
* thumbnail = 540h or 256h
* s = 1024h
* m = 2048h
* l = 4096h
