const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  read: "Read" | "Not Read";
  uid: string;
}

async function authHeaders(user: { getIdToken: () => Promise<string> }) {
  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchBooks(user: { getIdToken: () => Promise<string> }): Promise<Book[]> {
  const res = await fetch(`${API_URL}/api/books`, {
    headers: await authHeaders(user),
  });
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function addBook(
  user: { getIdToken: () => Promise<string> },
  book: Omit<Book, "id" | "uid">
): Promise<Book> {
  const res = await fetch(`${API_URL}/api/books`, {
    method: "POST",
    headers: await authHeaders(user),
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
}

export async function updateBook(
  user: { getIdToken: () => Promise<string> },
  id: number,
  updates: Partial<Omit<Book, "id" | "uid">>
): Promise<Book> {
  const res = await fetch(`${API_URL}/api/books/${id}`, {
    method: "PUT",
    headers: await authHeaders(user),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}

export async function deleteBook(
  user: { getIdToken: () => Promise<string> },
  id: number
): Promise<void> {
  const res = await fetch(`${API_URL}/api/books/${id}`, {
    method: "DELETE",
    headers: await authHeaders(user),
  });
  if (!res.ok) throw new Error("Failed to delete book");
}
