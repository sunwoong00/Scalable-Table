// utils/handleCellChange.js
export const handleCellChange = (rows, setData) => (rowIndex, colIndex, newValue) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[rowIndex][`col${colIndex}`] = newValue;
  
      // B(1) 변경 시 모든 C(i) 업데이트
      if (rowIndex === 0 && colIndex === 1) {
        const b1Value = parseFloat(newValue) || 0; // B(1) 값
        for (let i = 0; i < rows; i++) {
          const aValue = parseFloat(updatedData[i][`col0`]) || 0; // A(i) 값
          updatedData[i][`col2`] = (aValue * b1Value).toString(); // C(i) = A(i) * B(1)
        }
      }
  
      // A(i) 변경 시 해당 행의 C(i) 업데이트
      if (colIndex === 0) {
        const aValue = parseFloat(newValue) || 0; // A(i) 값
        const b1Value = parseFloat(updatedData[0][`col1`]) || 0; // B(1) 값
        updatedData[rowIndex][`col2`] = (aValue * b1Value).toString(); // C(i) = A(i) * B(1)
      }
  
      return updatedData;
    });
  };
  