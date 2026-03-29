import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Book, useCart } from '../CartContext';
import BookCard from './BookCard';
import CartSummary from './CartSummary';

//api base url
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5046';
const API_URL = `${API_BASE_URL}/Books`;

//normalize api response to book type
const normalizeBook = (raw: any): Book => ({
  BookID: raw.BookID ?? raw.bookID,
  Title: raw.Title ?? raw.title,
  Author: raw.Author ?? raw.author,
  Publisher: raw.Publisher ?? raw.publisher,
  ISBN: raw.ISBN ?? raw.isbn,
  Category: raw.Category ?? raw.category,
  PageCount: raw.PageCount ?? raw.pageCount,
  Price: raw.Price ?? raw.price,
});

const BookList: React.FC = () => {
  //state for books, pagination, sorting, and filtering
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { totalItems } = useCart();

  //calculate total pages for pagination
  const totalPages = Math.ceil(totalBooks / pageSize);

  //fetch books from api with pagination, sorting, and filtering
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { pageSize, pageNum, sortOrder };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const res = await axios.get(API_URL, { params });
      const rawBooks = res.data.books ?? res.data.Books ?? [];
      setBooks(rawBooks.map((book: any) => normalizeBook(book)));
      setTotalBooks(res.data.totalBooks ?? res.data.TotalBooks ?? 0);
    } catch (err) {
      setError('failed to load books. is the api running?');
    } finally {
      setLoading(false);
    }
  }, [pageNum, pageSize, sortOrder, selectedCategory]);

  //fetch book categories from api
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(['all', ...res.data]);
    } catch {
      //fallback if categories endpoint doesn't exist
      setCategories(['all']);
    }
  };

  //load categories once on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  //fetch books whenever dependencies change
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  //derive categories from loaded books as fallback
  useEffect(() => {
    if (books.length > 0 && categories.length <= 1) {
      //can accumulate categories from fetched books if api lacks categories endpoint
    }
  }, [books, categories]);

  //handle category selection change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPageNum(1);
  };

  //handle sort order change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
    setPageNum(1);
  };

  //handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  };

  //generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, pageNum - 2);
    const end = Math.min(totalPages, pageNum + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      {/*cart summary banner*/}
      <CartSummary />

      <div className="row g-4">
        {/*sidebar with filters and sorting*/}
        <div className="col-12 col-md-3">
          {/*category filter card*/}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-dark text-white">
              <h6 className="mb-0">
                <i className="bi bi-funnel-fill me-2"></i>filter by category
              </h6>
            </div>
            {/*NEW BOOTSTRAP FEATURE 1 ACCORDION*/}
            <div className="accordion accordion-flush" id="categoryAccordion">
              <div className="accordion-item border-0">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button py-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#categoryCollapse"
                    aria-expanded="true"
                    aria-controls="categoryCollapse"
                  >
                    categories
                  </button>
                </h2>
                <div
                  id="categoryCollapse"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#categoryAccordion"
                >
                  <div className="accordion-body p-0">
                    <div className="list-group list-group-flush">
                      {/*category buttons*/}
                      {categories.map(cat => (
                        <button
                          key={cat}
                          className={`list-group-item list-group-item-action py-2 px-3 border-0 ${
                            selectedCategory === cat ? 'active' : ''
                          }`}
                          onClick={() => handleCategoryChange(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*sort options card*/}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white">
              <h6 className="mb-0">
                <i className="bi bi-sort-alpha-down me-2"></i>sort
              </h6>
            </div>
            <div className="card-body">
              {/*sort order*/}
              <label className="form-label form-label-sm mb-1">order</label>
              <select
                className="form-select form-select-sm"
                value={sortOrder}
                onChange={handleSortChange}
              >
                <option value="asc">title: a → z</option>
                <option value="desc">title: z → a</option>
              </select>

              {/*page size*/}
              <label className="form-label form-label-sm mt-3 mb-1">books per page</label>
              <select
                className="form-select form-select-sm"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/*main content area*/}
        <div className="col-12 col-md-9">
          {/*header showing results count and selected category*/}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0 small">
              showing <strong>{books.length}</strong> of <strong>{totalBooks}</strong> books
              {selectedCategory !== 'All' && (
                <span className="ms-1">
                  in <strong>{selectedCategory}</strong>
                </span>
              )}
            </p>

            {/*badge for cart items on small screens*/}
            {totalItems > 0 && (
              <span className="badge bg-danger rounded-pill d-md-none">
                {totalItems} in cart
              </span>
            )}
          </div>

          {/*loading spinner*/}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">loading...</span>
              </div>
            </div>
          )}

          {/*error message*/}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/*no books found*/}
          {!loading && !error && books.length === 0 && (
            <div className="text-center py-5 text-muted">
              <h4>no books found</h4>
              <p>try a different category or search.</p>
            </div>
          )}

          {/*grid of book cards*/}
          <div className="row g-3">
            {books.map(book => (
              <div className="col-12 col-sm-6 col-xl-4" key={book.BookID}>
                <BookCard book={book} />
              </div>
            ))}
          </div>

          {/*pagination controls*/}
          {totalPages > 1 && (
            <nav className="mt-4" aria-label="book pagination">
              <ul className="pagination justify-content-center">
                {/*first page*/}
                <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(1)}
                    aria-label="first"
                  >
                    «
                  </button>
                </li>

                {/*previous page*/}
                <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(p => p - 1)}
                  >
                    ‹
                  </button>
                </li>

                {/*page numbers*/}
                {getPageNumbers().map(p => (
                  <li
                    key={p}
                    className={`page-item ${p === pageNum ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => setPageNum(p)}>
                      {p}
                    </button>
                  </li>
                ))}

                {/*next page*/}
                <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(p => p + 1)}
                  >
                    ›
                  </button>
                </li>

                {/*last page*/}
                <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(totalPages)}
                    aria-label="last"
                  >
                    »
                  </button>
                </li>
              </ul>

              {/*current page info*/}
              <p className="text-center text-muted small">
                page {pageNum} of {totalPages}
              </p>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;