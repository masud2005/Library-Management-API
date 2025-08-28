# 📚 Library Management API

A simple RESTful API for managing books and borrowing records in a library system using **Node.js**, **Express**, **TypeScript**, and **MongoDB** (Mongoose).

---

## 🚀 Features

* Add, view, update, and delete books
* Borrow books with stock validation
* Aggregated summary of borrowed books
* Clean structure with TypeScript and proper error handling

---

### 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (with Mongoose)
* **Language:** TypeScript

---

### 📦 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/masud2005/Library-Management-API.git
   cd .\Library-Management-API\
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup `.env` file**
   Create a `.env` file in the root:

   ```md
    your_database_name
    your_database_password
   ```

4. **Run the server**

   ```bash
   npm run dev
   ```

---

### 📂 Folder Structure (Simplified)

```md   
src/
├── app/
│   ├── controllers/
│   ├── models/
│   ├── interfaces/
├── server.ts
├── app.ts
```

### 🔗 API Endpoints

#### 📘 Books

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/books`     | Get all books  |
| POST   | `/api/books`     | Add a new book |
| PATCH  | `/api/books/:bookId` | Update a book  |
| DELETE | `/api/books/:bookId` | Delete a book  |

#### 📗 Borrow

| Method | Endpoint      | Description                   |
| ------ | ------------- | ----------------------------- |
| POST   | `/api/borrow` | Borrow a book                 |
| GET    | `/api/borrow` | Get summary of borrowed books |

---

### 🧪 Testing

You can use **Postman** or **Another Software** to test the API. Make sure MongoDB is running locally or use a remote URI in `.env`.

> [Live link](https://library-management-api-henna.vercel.app)
