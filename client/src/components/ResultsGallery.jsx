// This is a simple card component for one product
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <p>{product.name}</p>
    </div>
  );
}

// This component displays the whole grid of results
function ResultsGallery({ results }) {
  if (!results || results.length === 0) {
    return <p>No similar products found.</p>;
  }

  return (
    <div className="results-container">
      <h2>Matching Products</h2>
      <div className="results-grid">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ResultsGallery;