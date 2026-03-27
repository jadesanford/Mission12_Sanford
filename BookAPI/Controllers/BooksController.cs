using Microsoft.AspNetCore.Mvc;
using BookAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace BookAPI.Controllers
{
    // api controller for managing books
    [ApiController]
    [Route("[controller]")]
    public class BooksController : ControllerBase
    {
        //database context
        private BookContext _context;

        //constructor for dependency injection
        public BooksController(BookContext context)
        {
            _context = context;
        }

        //get /books/categories
        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();
            return Ok(categories);
        }

        //get sort
        [HttpGet]
        public IActionResult GetBooks(
            int pageSize = 5,
            int pageNum = 1,
            string sortOrder = "asc",
            string? category = null)
        {
            var query = _context.Books.AsQueryable();

            //filter by category if provided
            if (!string.IsNullOrWhiteSpace(category) && category != "All")
            {
                query = query.Where(b => b.Category == category);
            }

            //total count after filtering
            int totalBooks = query.Count();

            //sorting
            if (sortOrder?.ToLower() == "desc")
                query = query.OrderByDescending(b => b.Title);
            else
                query = query.OrderBy(b => b.Title);

            //pagination
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                Books = books,
                TotalBooks = totalBooks
            });
        }
    }
}