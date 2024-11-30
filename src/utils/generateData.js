// utils/generateData.js

const generateData = (rows, columns) => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = {};
    for (let j = 0; j < columns; j++) {
      if (j === 0) {
        row[`col${j}`] = i + 1; // A 열 (1~1000000 고정값)
      } else {
        row[`col${j}`] = ""; // B, C 열은 빈 값
      }
    }
    data.push(row);
  }
  return data;
};

export default generateData;
