import React, { useState, useEffect } from 'react';
import { hashImage, hammingDistance, calculateSimilarity } from '../utils/imageHash.js';
import productsData from '../data/products.json';

export default function ImageMatcher() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [threshold, setThreshold] = useState(0.3);
    const [imageUrl, setImageUrl] = useState("");
    const [useUrl, setUseUrl] = useState(false);
    const [products, setProducts] = useState([]);

    // Load products on component mount
    useEffect(() => {
        setProducts(productsData);
    }, []);

    function onFileChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setUseUrl(false);
        setImageUrl("");
    }

    async function handleSearch() {
        setLoading(true);
        try {
            let imageSource = null;

            if (useUrl && imageUrl) {
                imageSource = imageUrl;
                setPreview(imageUrl);
            } else if (file) {
                imageSource = file;
                setPreview(URL.createObjectURL(file));
            } else {
                alert('Choose an image file or enter an image URL');
                setLoading(false);
                return;
            }

            // Compute hash of input image
            const inputHash = await hashImage(imageSource);

            // Compare with all products
            const matches = [];
            const maxDistance = inputHash.length * 4; // 64 chars * 4 bits each

            for (const product of products) {
                try {
                    const distance = hammingDistance(inputHash, product.hash);
                    const similarity = calculateSimilarity(distance, maxDistance);

                    if (similarity >= threshold) {
                        matches.push({
                            id: product.id,
                            name: product.name,
                            category: product.category,
                            image: product.imageUrl,
                            score: similarity
                        });
                    }
                } catch (error) {
                    console.error(`Error comparing with product ${product.id}:`, error.message);
                }
            }

            // Sort by similarity and limit to top 50
            matches.sort((a, b) => b.score - a.score);
            setResults(matches.slice(0, 50));

        } catch (err) {
            console.error('Processing error:', err);
            alert('Error processing image: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-pink-400/15 to-orange-500/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }}></div>
            </div>

            {/* Floating Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 animate-float">
                    <svg className="w-8 h-8 text-blue-300/40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </div>
                <div className="absolute top-40 right-20 animate-float-delayed">
                    <svg className="w-6 h-6 text-purple-300/40" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                </div>
                <div className="absolute bottom-32 left-16 animate-float">
                    <svg className="w-10 h-10 text-pink-300/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16 relative">
                    {/* Glow Effect Behind Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>

                    <div className="inline-flex items-center justify-center mb-8 relative z-10">
                        <div className="relative">
                            <img src="/pixel-match-logo.svg" alt="Pixel Match Logo" className="w-20 h-20 mr-6 drop-shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce-gentle" />
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg -z-10"></div>
                        </div>
                        <div className="text-left">
                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2 animate-fade-in-up">
                                Pixel Match
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto animate-slide-in"></div>
                            <p className="text-sm text-gray-500 font-medium mt-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                Visual Product Matcher
                            </p>
                        </div>
                    </div>

                    <div className="max-w-3xl mx-auto relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                        <p className="text-xl text-gray-600 leading-relaxed relative z-10 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            Discover visually similar products instantly with <span className="font-semibold text-blue-600">pixel-perfect matching</span>.
                            Upload an image or paste a URL to find matching items from our extensive catalog using advanced perceptual hashing.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex justify-center items-center mt-8 space-x-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                    {/* Subtle Border Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>

                    <div className="p-8 md:p-12 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Input Section */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </span>
                                        Upload Your Image
                                    </h2>

                                    {/* Input Method Selection */}
                                    <div className="bg-gradient-to-br from-gray-50/80 to-blue-50/40 rounded-2xl p-6 mb-6 border border-white/50 backdrop-blur-sm shadow-inner">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => { setUseUrl(false); setImageUrl(""); setPreview(null); setFile(null); }}
                                                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${!useUrl
                                                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg shadow-blue-500/25'
                                                        : 'border-gray-200 bg-white/80 text-gray-600 hover:border-blue-300 hover:shadow-md backdrop-blur-sm'
                                                    }`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="relative z-10 flex items-center">
                                                    <div className={`p-3 rounded-xl mr-4 transition-colors duration-300 ${!useUrl ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                                                        }`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-bold text-lg">Upload File</div>
                                                        <div className="text-sm opacity-75">Choose from device</div>
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => { setUseUrl(true); setFile(null); setPreview(null); }}
                                                className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${useUrl
                                                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 shadow-lg shadow-purple-500/25'
                                                        : 'border-gray-200 bg-white/80 text-gray-600 hover:border-purple-300 hover:shadow-md backdrop-blur-sm'
                                                    }`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="relative z-10 flex items-center">
                                                    <div className={`p-3 rounded-xl mr-4 transition-colors duration-300 ${useUrl ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                                                        }`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-bold text-lg">Image URL</div>
                                                        <div className="text-sm opacity-75">Paste link</div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* File/URL Input */}
                                    {!useUrl ? (
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={onFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center hover:border-blue-400 transition-all duration-300 bg-gradient-to-br from-gray-50/80 to-blue-50/40 hover:from-blue-50/60 hover:to-purple-50/40 group-hover:shadow-lg group-hover:shadow-blue-500/10 backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-300">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-6 relative z-10 group-hover:text-blue-500 transition-colors duration-300 animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-600 font-semibold text-lg mb-2 group-hover:text-blue-700 transition-colors duration-300">Click to upload or drag and drop</p>
                                                <p className="text-gray-400 text-sm group-hover:text-blue-600 transition-colors duration-300">PNG, JPG, GIF up to 10MB</p>
                                                <div className="mt-4 flex justify-center space-x-2">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={e => setImageUrl(e.target.value)}
                                                className="w-full px-6 py-5 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-blue-500/20"
                                            />
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Similarity Threshold */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                                    <div className="flex items-center mb-4">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <span className="font-semibold text-gray-800">Similarity Threshold</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold text-blue-600">{threshold.toFixed(2)}</span>
                                            <span className="text-sm text-gray-500">Maximum: 1.00</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={threshold}
                                            onChange={e => setThreshold(parseFloat(e.target.value))}
                                            className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Low similarity</span>
                                            <span>High similarity</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={loading || (!file && (!useUrl || !imageUrl))}
                                        className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-5 px-8 rounded-3xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center text-lg group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-4 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="relative z-10">Analyzing Image...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-7 h-7 mr-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <span className="relative z-10">Find Similar Products</span>
                                                <svg className="w-5 h-5 ml-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    Image Preview
                                </h2>

                                <div className="bg-gradient-to-br from-gray-100/80 to-gray-200/60 rounded-3xl p-10 shadow-inner border border-white/50 backdrop-blur-sm relative overflow-hidden group">
                                    {/* Decorative Background Elements */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
                                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-pink-400/15 to-orange-500/15 rounded-full blur-lg animate-bounce" style={{ animationDuration: '3s' }}></div>

                                    <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                                        {preview ? (
                                            <div className="relative overflow-hidden">
                                                <img src={preview} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                                                    <span className="text-xs font-bold text-blue-600 flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                        Preview
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 relative">
                                                <div className="text-center relative z-10">
                                                    <div className="relative mb-8">
                                                        <svg className="mx-auto h-20 w-20 text-gray-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                                                    </div>
                                                    <p className="text-xl font-medium text-gray-500 mb-2">No image selected</p>
                                                    <p className="text-sm text-gray-400">Upload a file or paste a URL to see preview</p>
                                                    <div className="mt-6 flex justify-center space-x-2">
                                                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                        <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="mt-16">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                                    <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    Similar Products
                                </h2>
                                {results.length > 0 && (
                                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        {results.length} results found
                                    </div>
                                )}
                            </div>

                            {results.length === 0 ? (
                                <div className="text-center py-20 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <svg className="mx-auto h-20 w-20 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No Similar Products Found</h3>
                                    <p className="text-gray-500 text-lg mb-6">Try adjusting the similarity threshold or uploading a different image</p>
                                    <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200">
                                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-600">Tip: Lower the threshold for more results</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                    {results.map((r, index) => (
                                        <div
                                            key={r.id}
                                            className="product-card group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 backdrop-blur-sm relative animate-fade-in-up"
                                            style={{ animationDelay: `${index * 150}ms` }}
                                        >
                                            {/* Card Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="relative overflow-hidden">
                                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                                    <img
                                                        src={r.image}
                                                        alt={r.name}
                                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                                    />
                                                    {/* Overlay on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                    {/* Floating action button */}
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200">
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/50">
                                                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        {r.score.toFixed(3)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 relative z-10">
                                                <h4 className="font-bold text-gray-800 text-base mb-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">{r.name}</h4>
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200/50">
                                                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                        {r.category}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                                                        <span>Similarity Match</span>
                                                        <span className="text-blue-600 font-bold">{Math.round(r.score * 100)}%</span>
                                                    </div>
                                                    <div className="relative">
                                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden"
                                                                style={{ width: `${r.score * 100}%` }}
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
