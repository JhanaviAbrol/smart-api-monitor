
function analyzeFailure(statusCode, errorMessage) {
  if (!statusCode || statusCode === 0) {
    return {
      rootCause: "The service did not respond at all — it may be down or unreachable.",
      suggestedSolution: "Check that the service is running and reachable from this server.",
    };
  }

  if (statusCode >= 500) {
    return {
      rootCause: `A ${statusCode} response usually means an unhandled error on the server.`,
      suggestedSolution: "Check the service's server logs around this time for the exact error.",
    };
  }

  if (statusCode === 429) {
    return {
      rootCause: "The service is rejecting requests due to rate limiting.",
      suggestedSolution: "Reduce how often you're calling it, or raise its rate limit.",
    };
  }

  return {
    rootCause: `Unexpected status code ${statusCode}${errorMessage ? ": " + errorMessage : ""}.`,
    suggestedSolution: "Review recent changes to the service and check its logs.",
  };
}

module.exports = { analyzeFailure };
