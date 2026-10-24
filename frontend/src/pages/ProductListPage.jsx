import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { CategoryPills } from '../components/CategoryPills';
import { Filter, SlidersHorizontal, RotateCcw, Search, Sparkles } from 'lucide-react';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active filters derived from query params
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentInStock = searchParams.get('in_stock') === 'true';

  // Local filter form state
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [inStockOnly, setInStockOnly] = useState(currentInStock);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Synchronize local input state with query params
  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
    setInStockOnly(currentInStock);
    setSearchInput(currentSearch);
  }, [currentMinPrice, currentMaxPrice, currentInStock, currentSearch]);

  // Load categories once
  useEffect(() => {
    productService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getProducts({
          category: currentCategory,
          search: currentSearch,
          sort: currentSort,
          min_price: currentMinPrice,
          max_price: currentMaxPrice,
          in_stock: currentInStock,
        });
        setProducts(data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [currentCategory, currentSearch, currentSort, currentMinPrice, currentMaxPrice, currentInStock]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set('min_price', minPrice);
    else next.delete('min_price');

    if (maxPrice) next.set('max_price', maxPrice);
    else next.delete('max_price');

    if (inStockOnly) next.set('in_stock', 'true');
    else next.delete('in_stock');

    setSearchParams(next);
    setShowMobileFilter(false);
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="container section-spacing">
      {/* Top Banner / Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
          Agricultural Products Marketplace
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem' }}>
          Browse certified chemical formulations, hybrid seeds, foliar nutrition, and machinery.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div style={{ marginBottom: '28px' }}>
        <CategoryPills
          categories={categories}
          selectedCategory={currentCategory}
          onSelectCategory={(slug) => updateParam('category', slug)}
        />
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '32px',
          alignItems: 'start',
        }}
        className="marketplace-layout"
      >
        {/* Sidebar Filters */}
        <aside
          className="agri-card"
          style={{
            padding: '24px',
            position: 'sticky',
            top: '90px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1.5px solid var(--color-mint)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
              <SlidersHorizontal size={18} color="var(--color-primary)" /> Filters
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <form onSubmit={handleApplyPriceFilter}>
            {/* Price Filter */}
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontWeight: '700' }}>Price Range (₹)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* In Stock Checkbox */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
                />
                In Stock Items Only
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              Apply Filter
            </button>
          </form>

          {/* Quick Categories Checklist */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '12px', color: 'var(--color-primary-dark)' }}>
              Categories
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
              {categories.map((c) => (
                <button
                  key={c.id || c.slug}
                  type="button"
                  onClick={() => updateParam('category', currentCategory === c.slug ? '' : c.slug)}
                  style={{
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: currentCategory === c.slug ? '700' : '500',
                    color: currentCategory === c.slug ? 'var(--color-primary)' : 'var(--color-text-main)',
                    backgroundColor: currentCategory === c.slug ? 'var(--color-mint)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{c.name}</span>
                  {c.product_count !== undefined && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({c.product_count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Column */}
        <main>
          {/* Top Sort and Results Summary */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '12px 18px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
              Showing <strong style={{ color: 'var(--color-primary-dark)' }}>{products.length}</strong> agricultural products
              {currentSearch && <span> for "<em>{currentSearch}</em>"</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>Sort by:</span>
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--color-sage)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--color-primary-dark)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
                <option value="name_asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-primary)', fontWeight: '600' }}>
              Fetching verified agricultural products...
            </div>
          ) : products.length === 0 ? (
            <div
              className="agri-card"
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-mint)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Search size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No agricultural products found</h3>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
                We could not find any products matching your selected category, search keyword, or price filters.
              </p>
              <button type="button" onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid-products">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
