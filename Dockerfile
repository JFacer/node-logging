FROM node:12.18-alpine
ENV NODE_ENV=development
WORKDIR /workspace
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install -g nodemon && npm install --silent && mv node_modules ../
#COPY . .
EXPOSE 3000

