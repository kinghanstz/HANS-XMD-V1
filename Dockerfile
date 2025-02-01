
FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  npm i pm2 -g && \
  rm -rf /var/lib/apt/lists/*
  
RUN git clone https://github.com/devhanstz/HANS-MD-V2 /root/HANS-MD
WORKDIR /root/HANS-MD/


COPY package.json .
RUN npm install pm2 -g
RUN npm install --legacy-peer-deps
RUN npm install axios dotenv

COPY . .

EXPOSE 5000

CMD ["npm", "run" , "hans"]
