# IPSOS: Interactive Physics Sonification System

## Install and run using Meteor

*   If you have not already done so, install [meteor](https://www.meteor.com/)
*   Clone the repository `git clone https://github.com/KonVas/Ipsosboard.git`
*   In `/Ipsosboard` run the command `meteor run .`
*   Go to `http://localhost` in your browser

## Install and run using Docker

*   If you have not already done so, install [docker](https://www.docker.com/)
*   Use the Dockerfile provided here (which you can copy to another directory)
*   Build the docker image: `docker build -t ipsos .`
*   Once built, the image should be visible from the command `docker images`
*   Create a container from the image: `docker run -d -p 8080:8080 ipsos`
*   Go to `http://localhsot:8080` in your browser

## Run using Docker (using an image from Docker Hub)

*   If you have not already done so, install [docker](https://www.docker.com/)
*   A docker image is available on [Docker Hub](https://hub.docker.com/r/tpmccauley/ipsos/)
*   Pull the docker image: `docker pull tpmccauley/ipsos`
*   Create a container from the image: `docker run -d -p 8080:8080 ipsos`
*   Go to `http://localhsot:8080` in your browser
