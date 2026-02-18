import imgRectangle from "figma:asset/5ec7dc9d8362856533767d7c4d92b77e0020ed1e.png";

function Group() {
  return (
    <div className="absolute contents left-[82px] top-[296px]">
      <div className="absolute bg-[#ff80b7] left-[123px] size-[155px] top-[296px]" />
      <div className="absolute bg-[#d9d9d9] h-[63px] left-[82px] top-[516px] w-[237px]" />
    </div>
  );
}

export default function IPhone16Pro() {
  return (
    <div className="bg-[#e9e9e9] relative size-full" data-name="iPhone 16 Pro - 2">
      <div className="absolute inset-[-6.75%_-10.2%_-7.67%_-11.94%]" data-name="Rectangle">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[122.52%] left-[-146.03%] max-w-none top-[-14.4%] w-[361.56%]" src={imgRectangle} />
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bg-[#d9d9d9] h-[51px] left-1/2 top-[701px] w-[192px]" />
      <Group />
    </div>
  );
}