import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const filePath = path.join(process.cwd(), 'app/data/books.json')

// GET semua buku
export async function GET() {
  const file = fs.readFileSync(filePath, 'utf-8')
  const books = JSON.parse(file)
  return NextResponse.json(books)
}

// POST untuk tambah buku
export async function POST(request) {
  const newBook = await request.json()
  const file = fs.readFileSync(filePath, 'utf-8')
  const books = JSON.parse(file)

  const updatedBooks = [
    ...books,
    { ...newBook, id: Date.now() }
  ]

  fs.writeFileSync(filePath, JSON.stringify(updatedBooks, null, 2))
  return NextResponse.json({ success: true })
}
