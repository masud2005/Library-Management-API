"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.booksRoutes = express_1.default.Router();
// Create Book
exports.booksRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const book = yield book_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    }
    catch (error) {
        next(error);
    }
}));
// Get All Books with filtering, sorting, and limiting
exports.booksRoutes.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit } = req.query;
        // Filtering
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        // Sorting
        const sortOrder = (sort === null || sort === void 0 ? void 0 : sort.toLowerCase()) === 'desc' ? -1 : 1;
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder;
        }
        else {
            sortOptions.createdAt = -1;
        }
        // Limiting
        const parsedLimit = limit ? parseInt(limit) : 10;
        const findQuery = book_model_1.Book.find(query).sort(sortOptions).limit(parsedLimit);
        // Execute
        const books = yield findQuery.exec();
        res.status(200).json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
}));
// Get Book by ID
exports.booksRoutes.get('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        // console.log(bookId);
        const book = yield book_model_1.Book.findById(bookId);
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
        });
    }
    catch (error) {
        next(error);
    }
}));
// Update Book
exports.booksRoutes.put('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBookData = req.body;
        const book = yield book_model_1.Book.findByIdAndUpdate(bookId, updatedBookData, { new: true });
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    }
    catch (error) {
        next(error);
    }
}));
// Delete Book
exports.booksRoutes.delete('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findByIdAndDelete(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        next(error);
    }
}));
// Global error handler
exports.booksRoutes.use((error, req, res, next) => {
    // console.log("Error", error);
    if (error.name === 'ValidationError') {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors
            }
        });
    }
    // others errors
    res.status(400).json({
        message: error.message || "Something went wrong!",
        success: false,
        error
    });
});
