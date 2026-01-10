const yahooFinance = require('yahoo-finance2').default;

exports.getLivePrice = async (req, res) => {
    try {
        const { symbol } = req.params;
        // Validate symbol exists
        const quote = await yahooFinance.quote(symbol);
        
        if (!quote || !quote.regularMarketPrice) {
            return res.status(404).json({ message: "Ticker symbol not found", price: 0 });
        }

        res.status(200).json({
            symbol: quote.symbol,
            price: quote.regularMarketPrice,
            name: quote.shortName || quote.symbol,
            change: quote.regularMarketChangePercent || 0
        });
    } catch (error) {
        console.error("Yahoo API Error:", error.message);
        res.status(500).json({ message: "Server error fetching stock data", price: 0 });
    }
};