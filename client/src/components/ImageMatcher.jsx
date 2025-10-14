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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                        Visual Product Matcher
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Discover visually similar products instantly. Upload an image or paste a URL to find matching items from our extensive catalog.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="p-8 md:p-12">
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
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => { setUseUrl(false); setImageUrl(""); setPreview(null); setFile(null); }}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${!useUrl
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <div className="font-semibold">Upload File</div>
                                                        <div className="text-sm opacity-75">Choose from device</div>
                                                    </div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => { setUseUrl(true); setFile(null); setPreview(null); }}
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${useUrl
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <div className="font-semibold">Image URL</div>
                                                        <div className="text-sm opacity-75">Paste link</div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* File/URL Input */}
                                    {!useUrl ? (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={onFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50">
                                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                                                <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                type="url"
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={e => setImageUrl(e.target.value)}
                                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg"
                                            />
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
                                <button
                                    onClick={handleSearch}
                                    disabled={loading || (!file && (!useUrl || !imageUrl))}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing Image...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Find Similar Products
                                        </>
                                    )}
                                </button>
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

                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 shadow-inner">
                                    <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                        {preview ? (
                                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
                                                <div className="text-center">
                                                    <svg className="mx-auto h-16 w-16 mb-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-lg font-medium text-gray-500">No image selected</p>
                                                    <p className="text-sm text-gray-400 mt-2">Upload a file or paste a URL to see preview</p>
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
                                            className="product-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 stagger-item"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div className="relative overflow-hidden">
                                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <img
                                                        src={r.image}
                                                        alt={r.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                                                    <span className="text-xs font-bold text-blue-600">{r.score.toFixed(3)}</span>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h4 className="font-bold text-gray-800 text-base mb-2 line-clamp-2 leading-tight">{r.name}</h4>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {r.category}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs text-gray-500">
                                                        <span>Similarity</span>
                                                        <span>{Math.round(r.score * 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${r.score * 100}%` }}
                                                        ></div>
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
