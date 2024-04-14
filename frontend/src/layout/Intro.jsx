const Intro = (props) => {
  return (
    <div className="max-w-xl pt-20 lg:pt-0 flex flex-col gap-4 text-black">
      <h1 className="text-5xl font-bold">{props.title}</h1>
      <p className="text-xl">{props.text}</p>
    </div>

  );
};

export default Intro;
