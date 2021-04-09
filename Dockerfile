FROM node:12-alpine

RUN mkdir -p /srv/app/home-server
# Create app directory
WORKDIR /srv/app/home-server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package.json /srv/app/home-server
# COPY package-lock.json /srv/app/home-server
COPY package*.json ./
COPY .npmrc .
# COPY package-lock.json .

#RUN npm install --registry=https://npm.sap.com
#RUN npm config --global set @sap:registry https://npm.sap.com
#RUN npm install @sap/hana-client
#RUN npm update @sap/hana-client
#RUN npm install ./tools/hdbclient_node/

#RUN npm config set registry https://registry.npmjs.com/

# RUN npm config set registry https://npm.sap.com &&\
#     npm install @sap/hana-client &&\
#     npm config set registry https://registry.npmjs.org/ && \
RUN npm install
RUN npm install -g nodemon

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
# COPY . /srv/app/home-server
COPY . .

# EXPOSE 8080
CMD [ "npm", "run" "devstart" ]
