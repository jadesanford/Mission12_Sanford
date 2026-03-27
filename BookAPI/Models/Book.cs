using System.ComponentModel.DataAnnotations;

namespace BookAPI.Models
{
    //Book entity in the database
    public class Book
    {
        //all table columns
        [Key]
        public int BookID { get; set; }

        public string Title { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public string ISBN { get; set; }
        public string Category { get; set; }
        public int PageCount { get; set; }
        public double Price { get; set; }
    }
}