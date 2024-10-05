FROM node:16-alpine

WORKDIR /nakajimap

# package.json と package-lock.json をコピーして依存関係をインストール
COPY nakajimap/package.json nakajimap/package-lock.json ./
RUN npm install

# アプリケーションの全コードをコピー
COPY nakajimap .

# 開発用サーバーを起動
CMD ["npm", "run", "dev"]

EXPOSE 3000

# # Build Stage
# FROM node:16-alpine AS builder

# WORKDIR /nakajimap

# # package.json と package-lock.json をコピーして依存関係をインストール
# COPY nakajimap/package.json nakajimap/package-lock.json ./
# RUN npm install

# # アプリケーションの全コードをコピー
# COPY nakajimap .

# # アプリケーションをビルド
# RUN npm run build

# # Production Stage
# FROM nginx:alpine

# # ビルドされたファイルをコピーしてNGINXで提供
# COPY --from=builder /nakajimap/dist /usr/share/nginx/html

# # NGINXのポートを公開
# EXPOSE 80

# # NGINXをフォアグラウンドで実行
# CMD ["nginx", "-g", "daemon off;"]
