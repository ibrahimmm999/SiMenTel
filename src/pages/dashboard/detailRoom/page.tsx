import Button from "../../../components/button";
import Navbar from "../../../components/navbar";
import Facility from "./component/facility";

function DetailRoom() {
  return (
    <div className="w-full flex flex-col pb-10">
      <Navbar />
      <div className="w-full mt-[120PX] flex px-28 gap-24">
        <img
          src="./assets/bedroom.svg"
          alt=""
          className="w-[560px] h-[390px] rounded-lg"
        />
        <div className="flex flex-col">
          <p className="text-[48px] font-semibold">Ruang Mawar</p>
          <p className="text-[24px] font-semibold">Lantai 3</p>
          <p className="text-[16px] font-normal mt-8">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now
          </p>
          <div className="w-full flex justify-between items-center mt-12">
            <p className="text-[24px] font-bold">Price: Rp4.000.000,00</p>
            <Button type={"button"} text="Edit Detail"/>
          </div>
          <hr className="mt-6 h-1 bg-black"/>
        </div>
      </div>
      <p className="text-[32px] font-medium mt-12 px-28">Facilities</p>
      <div className="flex gap-14 mt-8 flex-wrap px-28">
        <Facility status={true} name={"Air Conditioner"}/>
        <Facility status={true} name={"Air Conditioner"}/>
        <Facility status={false} name={"Air Conditioner"}/>
        <Facility status={true} name={"Air Conditioner"}/>
        <Facility status={true} name={"Air Condi"}/>
        <Facility status={true} name={"Air Condi"}/>
        <Facility status={true} name={"Air Condi"}/>
        <Facility status={true} name={"Air Conditioner"}/>
      </div>
    </div>
  );
}

export default DetailRoom;
