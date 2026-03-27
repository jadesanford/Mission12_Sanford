using Microsoft.EntityFrameworkCore;
using BookAPI.Models;

namespace BookAPI.Data
{
    //used to interact with the database
    public class BookContext : DbContext
    {
        //accepts DbContext options and passes them to the base class
        public BookContext(DbContextOptions<BookContext> options) : base(options) { }
        //Book object corresponds to a row in the table
        public DbSet<Book> Books { get; set; }
    }
}