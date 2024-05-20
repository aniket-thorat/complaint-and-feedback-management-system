import macross_icon from "../assets/macross.jpg";
const Hero = (props) => {
  return (
    <div
      className="pb-12 pt-4 px-2 lg:px-0 md:py-40 flex flex-col gap-4 bg-gray-200 text-white text-center capitalize"
      style={{
        backgroundColor: "#333645",
        height: "5px",
      }}
    >
      {props?.headTitle && <h1 className="text-4xl">{props.headTitle}</h1>}
      <h1 className="text-3xl">{props.title}</h1>
      {props.children}
    </div>
  );
};

export default Hero;
