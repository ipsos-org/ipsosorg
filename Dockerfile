FROM node:8

RUN mkdir -p /tmp/ipsos
WORKDIR /tmp/ipsos

RUN curl -sL https://install.meteor.com | sed s/--progress-bar/-sL/g | /bin/sh
RUN curl -sL https://deb.nodesource.com/setup_8.x | sed s/--progress-bar/-sL/g | bash -

RUN git clone --depth=1 https://github.com/ipsos-org/ipsosorg.git

RUN cd ./ipsosorg \
&& meteor npm install --production \
&& meteor build --allow-superuser --architecture os.linux.x86_64 /tmp/ipsos-build

RUN cd /tmp/ipsos-build \
&& gunzip ipsosorg.tar.gz \
&& tar -xvf ipsosorg.tar 

RUN cd /tmp/ipsos-build/bundle/programs/server \ 
&& npm install --production --unsafe-perm

ENV ROOT_URL http://localhost
ENV PORT 8080
EXPOSE 8080
WORKDIR /tmp/ipsos-build/bundle
CMD ["nodejs", "main.js"]


