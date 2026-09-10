const { readDB, writeDB, nextId } = require("../utils/db");
const { analyzeFailure } = require("./ai");

const CHECK_INTERVAL_MS = 60000;

async function checkOneApi(api) {
  const start = Date.now();
  let statusCode = null;
  let errorMessage = null;

  try {
    const response = await fetch(api.url, { method: api.method || "GET" });
    statusCode = response.status;
    if (!response.ok) {
      errorMessage = `Received error status ${statusCode}`;
    }
  } catch (err) {
    statusCode = 0; // couldn't connect at all
    errorMessage = err.message;
  }

  const responseTime = Date.now() - start;
  return { statusCode, errorMessage, responseTime };
}

async function checkAllApis() {
  const db = readDB();

  for (const api of db.apis) {
    const { statusCode, errorMessage, responseTime } = await checkOneApi(api);

    const log = {
      id: nextId(db.logs),
      apiId: api.id,
      apiName: api.name,
      statusCode,
      responseTime,
      errorMessage,
      timestamp: new Date().toISOString(),
    };
    db.logs.unshift(log); 

    const connectionFailed = !statusCode || statusCode >= 400;

    let status;
    if (connectionFailed) {
      status = "Down";
    } else if (responseTime < 200) {
      status = "Healthy";
    } else if (responseTime <= 500) {
      status = "Moderate";
    } else {
      status = "Slow";
    }

    const failed = status === "Down";
    const moderate = status === "Moderate";
    const slow = status === "Slow";

    api.status = status;
    api.responseTime = responseTime;
    api.lastChecked = new Date().toISOString();

    if (failed) {
      const analysis = analyzeFailure(statusCode, errorMessage);

      db.incidents.unshift({
        id: nextId(db.incidents),
        title: `${api.name} check failed (status ${statusCode})`,
        apiName: api.name,
        severity: "Critical",
        aiRootCause: analysis.rootCause,
        suggestedSolution: analysis.suggestedSolution,
        time: new Date().toISOString(),
      });

      db.alerts.unshift({
        id: nextId(db.alerts),
        email: "dev-team@example.com",
        apiName: api.name,
        alertType: "Downtime",
        time: new Date().toISOString(),
        status: "Sent",
      });
    } else if (slow) {
      db.alerts.unshift({
        id: nextId(db.alerts),
        email: "dev-team@example.com",
        apiName: api.name,
        alertType: "Slow Response",
        time: new Date().toISOString(),
        status: "Sent",
      });
    }
  }

  writeDB(db);
}

function startMonitoring() {
  console.log(`Monitoring scheduler started — checking every ${CHECK_INTERVAL_MS / 1000}s`);
  checkAllApis(); 
  setInterval(checkAllApis, CHECK_INTERVAL_MS);
}

module.exports = { startMonitoring };
