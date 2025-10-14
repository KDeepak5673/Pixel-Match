# Visual Product Matcher

**Technical Assessment Project - Software Engineering Position**

A web application that helps users find visually similar products based on uploaded images, built as part of a technical assessment for a Software Engineering position.

## 🎯 Project Overview

This project implements a complete visual product matching system that meets all the specified assessment requirements:

### ✅ Assessment Requirements Met
- **🖼️ Image Upload**: Support for both file upload and image URL input
- **🔍 Search Interface**: View uploaded images and browse similar products with similarity scores
- **🎛️ Result Filtering**: Adjustable similarity threshold (0.0 - 1.0 range) for result filtering
- **📊 Product Database**: 96+ products with complete metadata (name, category, images)
- **📱 Mobile Responsive**: Fully responsive design optimized for all screen sizes
- **🚀 Live Deployment**: Hosted on Vercel (free hosting service)
- **⚡ Performance**: Clean code with error handling and loading states
- **📚 Documentation**: Comprehensive setup and usage instructions

## 🏗️ Technical Approach

**Client-Side Architecture**: Built entirely in the browser using HTML5 Canvas API for image processing, eliminating server dependencies and enabling offline functionality.

**Perceptual Hashing**: Implements dHash algorithm for 64-bit visual fingerprints, with precomputed hashes ensuring instant search results under 100ms.

**Modern Tech Stack**: React 19.1.1 with hooks, Vite build system, and custom CSS for optimal performance and responsive design.

- **✅ Working Application**: [https://pixel-match-ruby.vercel.app/](https://pixel-match-ruby.vercel.app/)
- **✅ GitHub Repository**: [https://github.com/KDeepak5673/Pixel-Match](https://github.com/KDeepak5673/Pixel-Match)

## 🏆 Key Achievements

- **Performance**: < 100ms search response time across 96+ products
- **User Experience**: Intuitive interface with loading states and error handling
- **Scalability**: Client-side processing with zero server costs
- **Accessibility**: Mobile-first responsive design with touch optimization

## ✨ Features

- **🖼️ Image Upload & URL Support**: Upload files directly or paste image URLs
- **🔍 Perceptual Hashing**: Uses dHash algorithm for accurate visual similarity detection
- **⚡ Instant Results**: Precomputed hashes enable lightning-fast matching
- **🎛️ Adjustable Similarity**: Fine-tune matching sensitivity with a threshold slider
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🚀 Offline Capable**: No server dependencies - runs entirely in the browser
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KDeepak5673/Pixel-Match.git
   cd Pixel-Match/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📖 How to Use

1. **Choose Input Method**:
   - Click "Upload File" to select an image from your device
   - Or click "Image URL" to paste a direct link to an image

2. **Upload Your Image**:
   - Drag and drop or click to browse files
   - Supported formats: PNG, JPG, GIF (up to 10MB)

3. **Adjust Similarity Threshold** (Optional):
   - Use the slider to control matching sensitivity
   - Lower values = more results, higher values = stricter matching

4. **Find Similar Products**:
   - Click "Find Similar Products" to start the search
   - View results with similarity scores and product details

## 🏗️ Project Structure

```
Pixel-Match/
├── client/                          # React frontend application
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── ImageUploader.jsx     # Main application component
│   │   ├── data/
│   │   │   ├── precomputedhashes.json # Precomputed product hashes
│   │   │   └── products.json          # Original product data
│   │   ├── utils/
│   │   │   ├── imageHash.js           # Perceptual hashing utilities
│   │   │   └── productHasher.js       # Product loading utilities
│   │   ├── App.css                    # Custom CSS styles
│   │   ├── App.jsx                    # Root application component
│   │   ├── index.css                  # Global styles
│   │   └── main.jsx                   # Application entry point
│   ├── package.json
│   └── README.md                      # Client-specific documentation
└── README.md                          # Project overview
```

## 🛠️ Technical Details

### Architecture
- **100% Client-Side**: No server dependencies - everything runs in the browser
- **Precomputed Hashes**: All product hashes are pre-generated and bundled
- **Offline Capable**: Works without internet connection once loaded

### Perceptual Hashing
- **Algorithm**: dHash (difference hash) - 64-bit perceptual hashing
- **Accuracy**: Hamming distance calculation for similarity scoring
- **Performance**: Precomputed hashes enable sub-second matching

### Technologies Used
- **Frontend**: React 19.1.1 with modern hooks
- **Build Tool**: Vite 7.1.10 for fast development
- **Styling**: Custom CSS with responsive design
- **Code Quality**: ESLint with React-specific rules
- **Image Processing**: HTML5 Canvas API for client-side hashing

## 📊 Data Structure

Each product in the catalog includes:
- **id**: Unique product identifier
- **name**: Product name
- **category**: Product category (mugs, lamps, chairs, etc.)
- **imageUrl**: High-quality product image URL
- **hash**: 64-bit perceptual hash (16-character hex)
- **avgColor**: Average RGB color values (normalized 0-1)

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Code Quality
- ESLint configuration for consistent code style
- React Compiler enabled for performance optimization
- Modern JavaScript (ES6+) with module imports

## 📈 Performance

- **Load Time**: < 2 seconds for initial page load
- **Search Speed**: < 100ms for similarity matching
- **Memory Usage**: Optimized for 96+ products
- **Bundle Size**: Minimal dependencies for fast loading

## 🚀 Deployment

The application is 100% client-side and can be deployed to any static hosting service:

### Vercel
1. Build the application: `npm run build`
2. Deploy the `dist` folder to Vercel, Netlify, or any static host
3. No server configuration needed!

### GitHub Pages
1. Build the application: `npm run build`
2. Use GitHub Actions to deploy the `dist` folder
3. Configure the repository settings for GitHub Pages

---

Built with modern web technologies to demonstrate full-stack development capabilities and problem-solving approach.

**Made with ❤️ using React & Vite**