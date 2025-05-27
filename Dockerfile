FROM node:18

# Set working directory
WORKDIR /app

# Install pip (and other required packages like make, g++, and python3)
RUN apt-get update && \
    apt-get install -y python3-pip python3 make g++ && \
    apt-get clean

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "start"]
