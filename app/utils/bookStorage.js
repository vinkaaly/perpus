// utils/booksStorage.js

const STORAGE_KEY = 'books_data'

export const getBooks = () => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const saveBooks = (books) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }
}

export const addBook = (book) => {
  const books = getBooks()
  books.push({ ...book, id: Date.now() })
  saveBooks(books)
}

export const updateBook = (updatedBook) => {
  const books = getBooks().map(book =>
    book.id === updatedBook.id ? updatedBook : book
  )
  saveBooks(books)
}

export const deleteBook = (id) => {
  const books = getBooks().filter(book => book.id !== id)
  saveBooks(books)
}
