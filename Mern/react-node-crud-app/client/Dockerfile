# Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Set environment variable for API URL
ENV REACT_APP_API_URL=http://localhost:5000

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]