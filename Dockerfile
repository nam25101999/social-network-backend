FROM node:18

WORKDIR /app

# Chỉ copy package.json để đảm bảo install lại đúng môi trường
COPY package*.json ./

# Cài đặt bên trong Docker (sẽ build lại bcrypt đúng môi trường Linux)
RUN npm install

# Sau đó mới copy mã nguồn
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
