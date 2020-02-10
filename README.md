# IPSOS: Interactive Physics Sonification System

## Install and run using Meteor

*   If you have not already done so, install [meteor](https://www.meteor.com/)
*   Clone the repository `git clone https://github.com/ipsos-org/ipsosorg.git` (or using SSH: `git clone git@github.com:ipsos-org/ipsosorg.git`)
*   In `./ipsosorg` run the command `meteor run`
*   Go to `http://localhost` in your browser

## Install and run using Docker

*   If you have not already done so, install [docker](https://www.docker.com/)
*   Clone the repository `git clone https://github.com/ipsos-org/ipsosorg.git` (or using SSH: `git clone git@github.com:ipsos-org/ipsosorg.git`)
*   Build the docker image by running the command `docker build -t ipsosorg .` in `./ipsosorg` 
*   Once built, the image should be visible from the command `docker images`
*   Create and run a container from the image: `docker run --name ipsos -d -p 8080:8080 ipsosorg`
*   Go to `http://localhost:8080` in your browser
*   To stop it, run the `docker stop ipsos` command
*   To restart the container, run `docker start ipsos`

## Run using Docker (using an image from Docker Hub)

*   If you have not already done so, install [docker](https://www.docker.com/)
*   A docker image is available on [Docker Hub](https://hub.docker.com/r/tpmccauley/ipsos/)
*   Pull the docker image: `docker pull tpmccauley/ipsos`
*   Create a container from the image: `docker run -d -p 8080:8080 ipsos`
*   Go to `http://localhost:8080` in your browser


## Install troubleshooting

*   When you first run `meteor` you may encounter the error `Unable to resolve some modules`. This can often be fixed by following the recommendations
given by `meteor`, e.g. running `meteor npm install --save bootstrap tone nouislider` and then `meteor run`.


