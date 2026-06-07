const { BetaAnalyticsDataClient } = require("@google-analytics/data");

// Validate env early (helps debugging)
if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
  console.error("❌ Missing Google credentials in env");
}

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const getAnalytics = async (req, res) => {
  try {
    console.log("🚀 Fetching GA analytics...");

    const [response] = await analyticsDataClient.runReport({
property: "properties/536099752",
      dateRanges: [
        {
          startDate: "7daysAgo", 
          endDate: "today",
        },
      ],

      dimensions: [
        {
          name: "date",
        },
      ],

      metrics: [
        {
          name: "activeUsers",
        },
      ],
    });

    console.log("📊 Raw GA response:", JSON.stringify(response));

    const result = (response.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value,
      users: Number(row.metricValues?.[0]?.value),
    }));

    console.log("✅ Parsed result:", result);

    return res.json(result);
  } catch (error) {
    console.error("🔥 GA ERROR:", error);

    return res.status(500).json({
      error: "Failed to fetch analytics data",
      message: error.message,
    });
  }
};

module.exports = { getAnalytics };