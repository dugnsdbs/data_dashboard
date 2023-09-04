export const evQuery = (formattedStartDate, formattedEndDate) => {
  let query = `SELECT count(vin) FROM "lms_tms_tran*"
      WHERE "@timestamp" >= CAST('${formattedStartDate}' AS DATETIME)
      AND "@timestamp" < CAST('${formattedEndDate}' AS DATETIME) 
    AND company = '02'
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
