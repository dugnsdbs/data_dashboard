import React from "react";
import Counter from "../Counter";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table = ({
  label,
  startDate,
  handleStartDateChange,
  endDate,
  handleEndDateChange,
  code,
  isLoading,
  resErr,
  sqlResult,
  handleSubmit,
}) => {
  return (
    <div className="flex flex-col w-full h-full items-center ">
      <div className="border-[2px] border-gray-700 mt-8 flex flex-col px-10 py-3 items-center justify-center rounded-md">
        <h2 className="mt-5 text-4xl font-semibold">{label}</h2>
        <div className="flex flex-row justify-between items-center gap-4 mt-5">
          <div>
            <p className="text-2xl">Start Date:</p>
            <div className="mt-3 text-2xl">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
              />
            </div>
          </div>
          <div className="mt-5 text-2xl"> ~ </div>
          <div>
            <p className="text-2xl">End Date:</p>
            <div className="mt-3 text-2xl">
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
              />
            </div>
          </div>
          <div className="mt-7 ml-3">
            <button
              onClick={() => handleSubmit(code)}
              className="btn border rounded py-2 px-4 text-xl text-green-100 bg-blue-600 border-blue-800 hover:bg-blue-400"
            >
              start
            </button>
          </div>
        </div>
      </div>

      <div className="w-full p-1 h-160 overflow-auto mt-4">
        {isLoading ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Counter />
          </div>
        ) : (
          <>
            {resErr.length > 1 ? (
              <div
                className="mt-7 bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md"
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-red-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">
                      An Error Has Occured while running Query
                    </p>
                    <p className="text-sm">{resErr}</p>
                  </div>
                </div>
              </div>
            ) : (
              <table className="overflow-hidden border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm mt-5">
                <thead className="bg-slate-50 dark:bg-slate-700">
                  <tr>
                    {sqlResult !== false &&
                      sqlResult?.columns?.map((item, idx) => (
                        <th
                          className="w-1/2 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left"
                          key={idx}
                        >
                          {item.name}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="overflow-auto relative">
                  {sqlResult !== false &&
                    sqlResult?.rows?.map((item, idx) => (
                      <tr key={idx}>
                        {sqlResult.rows[idx].map((item, idx) => (
                          <td
                            className="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
                            key={idx}
                          >
                            {item}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Table;
