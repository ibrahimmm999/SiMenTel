import { useState } from "react";

function Paginate({
  totalPages,
  current,
}: {
  totalPages: number;
  current: (x: number) => void | undefined;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    current(page);
  };

  const pushPage = (pageNumbers: JSX.Element[], i: number) => {
    pageNumbers.push(
      <li
        key={i}
        className={`cursor-pointer px-2 ${
          currentPage === i
            ? "border-2 border-[#ED7D31]"
            : "hover:bg-[#ED7D31] hover:text-white"
        }`}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </li>
    );
  };

  const renderPage = () => {
    const pageNumbers: JSX.Element[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages < 5) {
        pushPage(pageNumbers, i);
      } else {
        if (currentPage < totalPages - 3) {
          if (
            (i < currentPage + 3 && i >= currentPage - 1) ||
            i == totalPages
          ) {
            pushPage(pageNumbers, i);
          } else if (i == currentPage + 3) {
            pageNumbers.push(<li>...</li>);
          }
        } else {
          if (i >= totalPages - 3 || i <= totalPages - currentPage + 1) {
            pushPage(pageNumbers, i);
          } else if (i == totalPages - 4) {
            pageNumbers.push(<li>...</li>);
          }
        }
      }
    }
    return pageNumbers;
  };
  return (
    <>
      <div className="mt-8 flex w-full grow flex-col items-center justify-end xl:flex-row xl:items-end xl:justify-between">
        <ul className="flex w-auto items-center justify-center gap-2">
          <li
            className={
              currentPage > 1
                ? "html flex h-6 w-6 cursor-pointer items-center justify-center bg-[#ED7D31] text-white"
                : "hidden"
            }
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <img src="assets/less.svg" />
          </li>
          {renderPage()}
          <li
            className={
              currentPage < totalPages
                ? "html flex h-6 w-6 cursor-pointer items-center justify-center bg-[#ED7D31] text-white"
                : "hidden"
            }
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <img src="assets/more.svg" />
          </li>
        </ul>
      </div>
    </>
  );
}

export default Paginate;