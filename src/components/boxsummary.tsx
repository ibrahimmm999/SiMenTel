function BoxSummary({
  type,
  header,
  subheader,
}: {
  type: "red" | "orange" | "green";
  header: string;
  subheader: string;
}) {
  return (
    <>
      <div
        className={`${
          type == "red"
            ? " bg-red-primary"
            : type == "orange"
            ? " bg-orange-primary"
            : " bg-green-secondary"
        } p-14 w-full rounded-xl shadow-lg`}
      >
        <p className=" font-montserrat text-[64px] font-bold text-center text-white">
          {header}
        </p>
        <p className=" font-montserrat text-[36px] font-bold text-center text-white">
          {subheader}
        </p>
      </div>
    </>
  );
}

export default BoxSummary;
