import { useState, useEffect } from "react";
import { PiNavigationArrowFill } from "react-icons/pi";

const TextareaForm = ({
  text,
  setText,
  placeholder,
  submitFunction,
  conditionToSend,
}) => {
  const classes =
    "absolute bottom-4 right-6 text-lg sm:text-xl text-gray-600 opacity-0 cursor-pointer rotate-[135deg] transition duration-500";

  const [showSendIcon, setShowSendIcon] = useState(false);
  const [iconClasses, setIconClasses] = useState(classes);

  useEffect(() => {
    if (conditionToSend(text)) {
      setShowSendIcon(conditionToSend(text));
      setIconClasses(classes + " !text-sky-500 opacity-100");
    }
  }, [classes, conditionToSend]);

  const changeHandler = (e) => {
    setText(e.target.value);

    setShowSendIcon(true);
    setIconClasses(
      conditionToSend(e.target.value)
        ? classes +
            " !text-sky-500 opacity-100 hover:text-sky-600 hover:scale-110"
        : classes
    );
  };

  const focusHandler = () => {
    setIconClasses((prevState) => prevState + " !opacity-100");
  };

  const submitHandler = () => {
    if (!conditionToSend(text)) return;

    submitFunction();
    setIconClasses(classes);
  };

  const keyDownHandler = (e) => {
    if (!conditionToSend(text)) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitFunction();
    }
  };

  return (
    <form className="w-full mt-4">
      <div className="relative w-full">
        <textarea
          className="w-full min-h-[3rem] h-auto max-h-[10rem] resize-y pl-4 pr-12 py-2 border rounded-xl shadow-md outline-none text-sm sm:text-base bg-white text-gray-500 border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
          placeholder={placeholder}
          value={text}
          onChange={changeHandler}
          onFocus={focusHandler}
          onKeyDown={keyDownHandler}
        />
        <PiNavigationArrowFill
          className={`${iconClasses} absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-blue-500 cursor-pointer transition duration-300 ease-in-out ${showSendIcon ? 'opacity-100' : 'opacity-50'}`}
          onClick={submitHandler}
        />
      </div>
    </form>
  );
};

export default TextareaForm;
