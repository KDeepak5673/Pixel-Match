# Visual Product Matcher

A modern, client-side web application that finds visually similar products using perceptual hashing technology. Upload an image or paste a URL to discover matching items from a curated product catalog.

![Visual Product Matcher](https://img.shields.io/badge/React-19.1.1-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.10-646CFF) ![Client--Side](https://img.shields.io/badge/Client--Side-Only-green)

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

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

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

### Vercel/Netlify
1. Build the application: `npm run build`
2. Deploy the `dist` folder to Vercel, Netlify, or any static host
3. No server configuration needed!

### GitHub Pages
1. Build the application: `npm run build`
2. Use GitHub Actions to deploy the `dist` folder
3. Configure the repository settings for GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash**: High-quality product images
- **React Team**: For the amazing React framework
- **Vite Team**: For the lightning-fast build tool
- **dHash Algorithm**: For reliable perceptual hashing

## 📝 Development Notes

### Hash Generation
The `precomputedhashes.json` file contains precomputed perceptual hashes for all products. To regenerate hashes:

1. The original Node.js script was used to generate these hashes
2. Images are processed using HTML5 Canvas API
3. dHash algorithm creates 64-bit perceptual fingerprints
4. Results are saved as JSON for instant loading

### Architecture Evolution
This project evolved from a server-dependent architecture to a fully client-side solution:
- **Removed**: Node.js/Express backend, server-side image processing
- **Added**: Client-side Canvas API hashing, precomputed data
- **Benefits**: Offline capability, faster loading, no server costs

---

**Made with ❤️ using React & Vite**