const quoteService = require('../services/quoteService');
const asyncHandler = require('../utils/asyncHandler');

exports.createQuote = asyncHandler(async (req, res, next) => {
  const quote = await quoteService.createQuote(req.body);

  res.status(201).json({
    success: true,
    message: 'Quote request submitted successfully. We will contact you soon!',
    data: {
      id: quote._id,
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      createdAt: quote.createdAt,
    },
  });
});

exports.getQuotes = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  const result = await quoteService.getAllQuotes({ page, limit });

  res.status(200).json({
    success: true,
    count: result.quotes.length,
    total: result.total,
    page: result.page,
    pages: result.pages,
    data: result.quotes,
  });
});

exports.getQuote = asyncHandler(async (req, res, next) => {
  const quote = await quoteService.getQuoteById(req.params.id);

  res.status(200).json({
    success: true,
    data: quote,
  });
});

exports.deleteQuote = asyncHandler(async (req, res, next) => {
  await quoteService.deleteQuote(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

