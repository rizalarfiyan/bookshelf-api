import { nanoid } from 'nanoid'
import books from './books.js'

export function addBookHandler(request, h) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400)
  }

  const id = nanoid()
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  }
  books.push(newBook)

  const isSuccess = books.some((book) => book.id === id)
  if (!isSuccess) {
    return h
      .response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      })
      .code(500)
  }

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    })
    .code(201)
}

export function getAllBooksHandler(request, h) {
  let filterBooks = [...books]
  const { name, reading, finished } = request.query

  if (typeof name !== 'undefined' && name.trim().length > 0) {
    filterBooks = filterBooks.filter((book) =>
      book.name.toLowerCase().match(new RegExp(name.toLowerCase(), 'gi'))
    )
  }

  const numReading = Number.parseInt(reading, 10)
  if (!Number.isNaN(numReading)) {
    filterBooks = filterBooks.filter(
      (book) => book.reading === Boolean(numReading)
    )
  }

  const numFinished = Number.parseInt(finished, 10)
  if (!Number.isNaN(numFinished)) {
    filterBooks = filterBooks.filter(
      (book) => book.finished === Boolean(numFinished)
    )
  }

  return h
    .response({
      status: 'success',
      data: {
        books: filterBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200)
}

export function getBookByIdHandler(request, h) {
  const { bookId } = request.params
  const book = books.find((item) => item.id === bookId)

  if (typeof book === 'undefined') {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404)
  }

  return h
    .response({
      status: 'success',
      data: { book },
    })
    .code(200)
}

export function editBookByIdHandler(request, h) {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  if (typeof name === 'undefined') {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400)
  }

  if (pageCount < readPage) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400)
  }

  const indexFindBook = books.findIndex((book) => book.id === bookId)

  if (indexFindBook === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404)
  }

  books[indexFindBook] = {
    ...books[indexFindBook],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    updatedAt: new Date().toISOString(),
  }

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200)
}
