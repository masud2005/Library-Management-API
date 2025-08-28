
import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";

export const borrowRoutes = express.Router();

// borrow a book
borrowRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { book, quantity, dueDate } = req.body;

        await Book.borrowBook(book, quantity)

        const borrow = await Borrow.create({ book, quantity, dueDate });

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrow
        });
    } catch (error) {
        next(error)
    }
})

// Borrowed Books Summary (Using Aggregation)
borrowRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await Borrow.aggregate([
            {
                // Group documents by book ID and sum the quantities
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                // Look up the book details from the 'books' collection
                $lookup: {
                    from: "books", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                // Deconstruct the bookDetails array to a single object
                $unwind: "$bookDetails"
            },
            {
                // Reshape the output documents to match the required response format
                $project: {
                    _id: 0, 
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn"
                    },
                    totalQuantity: "$totalQuantity"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: result,
        });

    } catch (error) {
        next(error);
    }
});

// global error handler
borrowRoutes.use((error: any, req: Request, res: Response, next: NextFunction) => {
    // console.log(error);
    if (error.name === 'ValidationError') {
        // return console.log('error', error);
        res.status(400).json({
            message: 'Validation failed',
            success: false,
            error: {
                name: error.name,
                errors: error.errors
            }
        })
    }

    // other errors
    res.status(400).json({
        message: error.message || 'Something went wrong',
        success: false,
        error
    });

})