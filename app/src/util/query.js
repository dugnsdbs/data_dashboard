export const evQuery = (formattedStartDate, formattedEndDate) => {
  let query = `SELECT count(vin) FROM "lms_tms_tran*"
      WHERE "@timestamp" >= CAST('${formattedStartDate}' AS DATETIME)
      AND "@timestamp" < CAST('${formattedEndDate}' AS DATETIME) 
    AND company = '02'
    `;

  return query;
};

export const evHourlyQuery = (hour) => {
  let query = `
    SELECT scenario FROM "lms_tms_tran*"
    WHERE "@timestamp" > DATE_ADD('minute', -${hour} ,current_timestamp)
    AND company = '02'
    group by scenario
    `;

  return query;
};

export const iceQuery = (formattedStartDate, formattedEndDate) => {
  let query = `SELECT count(vin) FROM "lms_tms_tran*"
      WHERE "@timestamp" >= CAST('${formattedStartDate}' AS DATETIME)
      AND "@timestamp" < CAST('${formattedEndDate}' AS DATETIME) 
    AND company = '01'
    `;

  return query;
};
