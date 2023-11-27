function Table({
  data,
  header,
  isLoading,
}: {
  data: any[];
  header: any[];
  isLoading: boolean;
}) {
  const Load = () => {
    const dummy = [1, 2, 3, 4, 5];
    return dummy.map((idx: number) => (
      <tr key={idx}>
        {header.map((idx: number) => {
          return (
            <td
              key={idx}
              className="h-auto w-auto border-collapse border-b-2 border-kGrey-100 px-2 py-1 text-center xl:px-4"
            >
              <div className="h-4 w-full animate-pulse bg-bnw-500"></div>
            </td>
          );
        })}
      </tr>
    ));
  };
  return (
    <>
      <div 
      className="flex overflow-auto"
      style={{ boxShadow: "0px 4px 50px 0px rgba(32, 0, 149, 0.10)" }}
      >
        <table className="min-w-full overflow-visible">
          <thead>
            <tr>
              {header.map((cell: any, idx: number) => {
                return (
                  <th
                    key={idx}
                    className="h-auto w-auto border-collapse text-white bg-orange-primary px-2 py-1 text-center font-normal xl:px-4 truncate"
                  >
                    {cell}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <Load />
            ) : data.length > 0 ? (
              Object.values(data).map((obj: any, idx: number) => {
                return (
                  <tr key={idx} className="overflow-visible bg-orange-ternary">
                    {Object.values(obj).map((cell: any, idx: number) => {
                      return (
                        <td
                          key={idx}
                          className="h-auto w-auto border-collapse border-b-2 border-mono-grey px-2 py-3 text-center xl:px-4 min-w-max"
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <td colSpan={header.length}>
                <p className="text-center text-[20px] py-5">
                  Data tidak ditemukan
                </p>
              </td>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
