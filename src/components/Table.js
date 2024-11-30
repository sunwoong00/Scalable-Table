import React, { useState, useRef, useEffect, useCallback } from "react";
import Cell from "./Cell";
import generateData from "../utils/generateData"; // generateData 함수 import
import { throttle } from "lodash";

const Table = ({ rows = 1000000, columns = 3, rowHeight = 30, height = 600 }) => {
  const [data, setData] = useState(() => generateData(rows, columns)); // generateData 함수 사용
  const [startIndex, setStartIndex] = useState(0); // 시작 인덱스
  const tableRef = useRef(null); // 테이블 컨테이너 참조

  const visibleRowCount = Math.ceil(height / rowHeight); // 한 화면에 보이는 행의 수
  const buffer = 5; // 추가 렌더링할 행 수

  // 셀 값 변경 핸들러
  const handleCellChange = useCallback(
    (rowIndex, colIndex, newValue) => {
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
    },
    [rows]
  );

  // 스크롤 핸들러
  // eslint-disable-next-line
  const handleScroll = useCallback(
    throttle((e) => {
      const scrollTop = e.target.scrollTop;
      const newStartIndex = Math.min(
        Math.floor(scrollTop / rowHeight),
        rows - visibleRowCount
      );
      setStartIndex(newStartIndex);
    }, 100),
    [rowHeight, rows, visibleRowCount]
  );

  // 스크롤 이벤트 등록
  useEffect(() => {
    const tableContainer = tableRef.current;
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  // 현재 가시 데이터 계산
  const visibleData = data.slice(
    Math.max(0, startIndex - buffer),
    Math.min(rows, startIndex + visibleRowCount + buffer)
  );

  // 상단 및 하단 스페이서 높이 계산
  const totalHeight = rows * rowHeight; // 테이블 전체 높이
  const topSpacerHeight = startIndex * rowHeight; // 상단 스페이서 높이
  const bottomSpacerHeight = totalHeight - topSpacerHeight - visibleData.length * rowHeight; // 하단 스페이서 높이

  return (
    <div
      ref={tableRef}
      className="table-container"
      style={{
        height: `${height}px`,
        overflowY: "auto",
        border: "1px solid black",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0",
        }}
      >
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th
                key={colIndex}
                style={{
                  border: "1px solid #000",
                  textAlign: "center",
                  boxSizing: "border-box",
                  backgroundColor: "#f1f1f1",
                }}
              >
                {colIndex === 0 ? "A" : colIndex === 1 ? "B" : "C"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 상단 스페이서 */}
          <tr style={{ height: `${topSpacerHeight}px` }}>
            <td colSpan={columns} style={{ padding: 0, border: 0 }}></td>
          </tr>
          {/* 가시 데이터 렌더링 */}
          {visibleData.map((row, rowIndex) => (
            <tr
              key={startIndex + rowIndex}
              style={{
                height: `${rowHeight}px`,
              }}
            >
              {Object.entries(row).map(([key, cell], colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    border: "1px solid #000",
                    textAlign: "center",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <Cell
                    value={cell}
                    onChange={(newValue) =>
                      handleCellChange(startIndex + rowIndex, colIndex, newValue)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
          {/* 하단 스페이서 */}
          <tr style={{ height: `${Math.max(bottomSpacerHeight, 0)}px` }}>
            <td colSpan={columns} style={{ padding: 0, border: 0 }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
