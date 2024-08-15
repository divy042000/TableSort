import React, { useState, useEffect } from "react";
import mockApiResponse from "./data.js";
import commonFilter from "../Components/commonFilter.js";

// Function to filter and sort data based on column type and filter criteria
const Table = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [columnType, setColumnType] = useState("");
  const [columnName, setColumnName] = useState("");
  const [enumOptions, setEnumOptions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [valueSet, setValueSet] = useState("");
  const [sortColumn, setSortColumn] = useState(""); // State for sort column
  const [sortDirection, setSortDirection] = useState("asc"); // State for sort direction
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Simulate API call and load initial data
    const fetchData = async () => {
      const response = mockApiResponse;
      setData(response);
      setFilteredData(response);
      const uniqueAccessLevels = [
        ...new Set(response.map((item) => item.accessLevel)),
      ];
      setEnumOptions(uniqueAccessLevels);
    };
    fetchData();
  }, []);

  const handleColumnChange = (e) => {
    const selectedColumn = e.target.value;
    setColumnName(selectedColumn);
    // Determine the column type based on the selected column
    if (["age", "salary", "projectsCompleted"].includes(selectedColumn)) {
      setColumnType("integer");
    } else if (["name", "role", "department"].includes(selectedColumn)) {
      setColumnType("string");
    } else if (["hireDate", "lastLogin"].includes(selectedColumn)) {
      setColumnType("date");
    } else if (["accessLevel"].includes(selectedColumn)) {
      setColumnType("enum");
    } else if (["isActive"].includes(selectedColumn)) {
      setColumnType("boolean");
    }
  };

  const handleFilterTypeChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setValueSet(value); // Set the filter value in state
    setFilters({
      ...filters,
      [columnName]: {
        [name]: value,
      },
    });
  };

  const applyFilters = () => {
    let newFilteredData = commonFilter(
      data,
      columnName,
      selectedFilter,
      valueSet
    );
    setFilteredData(newFilteredData);
  };

  useEffect(() => {
    if (sortColumn) {
      const sortedData = [...filteredData].sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        if (typeof valueA === "string") {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
      setFilteredData(sortedData);
    }
  }, [sortColumn, sortDirection]);

  const handleSort = (column) => {
    const newSortDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newSortDirection);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        {/* Column Selection */}
        <div className="mb-2">
          <select
            onChange={handleColumnChange}
            className="border rounded p-1 w-full"
          >
            <option value="">Select Column</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
            <option value="role">Role</option>
            <option value="hireDate">Hire Date</option>
            <option value="isActive">Active</option>
            <option value="salary">Salary</option>
            <option value="department">Department</option>
            <option value="projectsCompleted">Projects Completed</option>
            <option value="lastLogin">Last Login</option>
            <option value="accessLevel">Access Level</option>
          </select>
        </div>

        {/* Filter Type Selection */}
        {columnName && (
          <div className="mb-2">
            <select
              onChange={handleFilterTypeChange}
              className="border rounded p-1 w-full"
            >
              <option value="">Select Filter Type</option>
              {columnType === "integer" && (
                <>
                  <option value="equals">Equals</option>
                  <option value="lessThan">Less than</option>
                  <option value="lessThanOrEqual">Less than or equal</option>
                  <option value="greaterThan">Greater than</option>
                  <option value="greaterThanOrEqual">
                    Greater than or equal
                  </option>
                  <option value="range">Range</option>
                  <option value="notEqual">Not equal</option>
                </>
              )}
              {columnType === "string" && (
                <>
                  <option value="contains">Contains</option>
                  <option value="notContains">Not contains</option>
                  <option value="equals">Equals</option>
                  <option value="notEqual">Not equal</option>
                  <option value="startsWith">Starts with</option>
                  <option value="endsWith">Ends with</option>
                  <option value="isNull">Is null</option>
                  <option value="isNotNull">Is not null</option>
                </>
              )}
              {columnType === "date" && (
                <>
                  <option value="dateIs">Date is</option>
                  <option value="dateRange">Date range</option>
                  <option value="equals">Equals</option>
                  <option value="lessThan">Less than</option>
                  <option value="lessThanOrEqual">Less than or equal</option>
                  <option value="greaterThan">Greater than</option>
                  <option value="greaterThanOrEqual">
                    Greater than or equal
                  </option>
                  <option value="notEqual">Not equal</option>
                  <option value="isNull">Is null</option>
                  <option value="isNotNull">Is not null</option>
                </>
              )}
              {columnType === "enum" && <option value="equals">Equals</option>}
              {columnType === "boolean" && (
                <>
                  <option value="equals">Equals</option>
                </>
              )}
            </select>
          </div>
        )}

        {/* Dynamic Filter Input */}
        {selectedFilter && (
          <div className="mb-2">
            {columnType === "integer" && selectedFilter === "range" && (
              <div className="space-y-2">
                <input
                  type="number"
                  name="rangeStart"
                  placeholder="Range start"
                  onChange={handleFilterChange}
                  className="border rounded p-1 w-full"
                />
                <input
                  type="number"
                  name="rangeEnd"
                  placeholder="Range end"
                  onChange={handleFilterChange}
                  className="border rounded p-1 w-full"
                />
              </div>
            )}
            {columnType === "integer" && selectedFilter !== "range" && (
              <input
                type="number"
                name={selectedFilter}
                placeholder={`Filter by ${selectedFilter}`}
                onChange={handleFilterChange}
                className="border rounded p-1 w-full"
              />
            )}
            {columnType === "string" && (
              <input
                type="text"
                name={selectedFilter}
                placeholder={`Filter by ${selectedFilter}`}
                onChange={handleFilterChange}
                className="border rounded p-1 w-full"
              />
            )}
            {columnType === "date" && (
              <input
                type="date"
                name={selectedFilter}
                placeholder={`Filter by ${selectedFilter}`}
                onChange={handleFilterChange}
                className="border rounded p-1 w-full"
              />
            )}
            {columnType === "enum" && (
              <select
                name={selectedFilter}
                onChange={handleFilterChange}
                className="border rounded p-1 w-full"
              >
                <option value="">Select value</option>
                {enumOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {columnType === "boolean" && (
              <select
                name={selectedFilter}
                onChange={handleFilterChange}
                className="border rounded p-1 w-full"
              >
                <option value="">Select value</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            )}
          </div>
        )}

        {/* Apply Filter Button */}
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white rounded p-2"
        >
          Apply Filters
        </button>
      </div>

      {/* Table to display data */}
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            {[
              "name",
              "age",
              "role",
              "hireDate",
              "isActive",
              "salary",
              "department",
              "projectsCompleted",
              "lastLogin",
              "accessLevel",
            ].map((column, index) => (
              <th
                key={index}
                className="border p-2 cursor-pointer"
                onClick={() => handleSort(column)}
              >
                {column.charAt(0).toUpperCase() + column.slice(1)}
                {sortColumn === column &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.age}</td>
              <td className="border p-2">{item.role}</td>
              <td className="border p-2">
                {new Date(item.hireDate).toLocaleDateString()}
              </td>
              <td className="border p-2">{item.isActive ? "Yes" : "No"}</td>
              <td className="border p-2">{item.salary}</td>
              <td className="border p-2">{item.department}</td>
              <td className="border p-2">{item.projectsCompleted}</td>
              <td className="border p-2">
                {new Date(item.lastLogin).toLocaleDateString()}
              </td>
              <td className="border p-2">{item.accessLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
