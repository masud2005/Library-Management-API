
import express, { NextFunction, Request, Response } from "express";
import { SortOrder } from "mongoose";
import { Book } from "../models/book.model";

export const booksRoutes = express.Router();

// Create Book
booksRoutes.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const book = await Book.create(body);

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        })
    } catch (error: any) {
        next(error);
    }
})

// Get All Books with filtering, sorting, and limiting
booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { filter, sortBy, sort, limit } = req.query;

        // Filtering
        const query: any = {};
        if (filter) {
            query.genre = filter;
        }

        // Sorting
        const sortOrder: SortOrder = (sort as string)?.toLowerCase() === 'desc' ? -1 : 1;
        const sortOptions: any = {};
        if (sortBy) {
            sortOptions[sortBy as string] = sortOrder;
        } else {
            sortOptions.createdAt = -1;
        }

        // Limiting
        const parsedLimit = limit ? parseInt(limit as string) : 10;
        const findQuery = Book.find(query).sort(sortOptions).limit(parsedLimit);

        // Execute
        const books = await findQuery.exec();

        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        })
    } catch (error: any) {
        next(error);
    }
})

// Get Book by ID
booksRoutes.get('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        // console.log(bookId);
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
                data: null
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book retrieved successfully',
            data: book
        })
    } catch (error: any) {
        next(error)
    }
})

// Update Book
booksRoutes.put('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        const updatedBookData = req.body;
        const book = await Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });

        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            })
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        })
    } catch (error: any) {
        next(error)
    }
})

// Delete Book
booksRoutes.delete('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        const book = await Book.findByIdAndDelete(bookId);

        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            })
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        })
    } catch (error: any) {
        next(error)
    }
})

// Global error handler
booksRoutes.use((error: any, req: Request, res: Response, next: NextFunction) => {
    // console.log("Error", error);
    if (error.name === 'ValidationError') {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors
            }
        })
    }

    // others errors
    res.status(400).json({
        message: error.message || "Something went wrong!",
        success: false,
        error
    })
})