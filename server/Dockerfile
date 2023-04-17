FROM node:16-alpine

# 이미지 내에서 명령어를 실행할 디렉토리 설정
RUN mkdir -p /app
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

COPY ./ ./

# 컨테이너가 켜지자마자 실행할 명령어 
CMD ["npm", "run", "start"]