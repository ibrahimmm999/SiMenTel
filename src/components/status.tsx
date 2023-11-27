function Status({status}: {status:string}) {
  return (
    <>
      <div
        className={`${
          status == "WAITING"
            ? "bg-blue-secondary"
            : status == "REVIEW"
            ? "bg-yellow-primary"
            : status == "FIXED"
            ? "bg-green-primary"
            : "bg-red-primary"
        } w-full px-5 py-2 rounded-xl flex justify-center items-center text-white font-semibold`}
      >
        {status}
      </div>
    </>
  );
}
export default Status;
