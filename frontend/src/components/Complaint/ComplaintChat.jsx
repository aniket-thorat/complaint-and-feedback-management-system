import ScrollableDiv from "../../UI/ScrollableDiv";
import DateFormatter from "../../UI/DateFormatter";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/userAuthSlice";

const ComplaintChat = ({ messages }) => {
  const user = useSelector(selectUser);
  console.log(user);

  const isSent = (value) => {
    return user.role === "user" ? parseInt(value) === 1 : parseInt(value) === 0;
  };

  return (
    <div className="relative p-5 bg-gray-100 rounded-lg shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200 opacity-80"></div>
      <div className="relative z-10 h-[550px] flex items-end overflow-auto p-5">
        <div className="w-full max-h-full flex flex-col gap-4">
          {messages.map((message) => (
            <div
              className={`${
                isSent(message.from) ? "self-start" : "self-end"
              } max-w-[70%]`}
              key={message.id}
            >
              <div
                className={`flex flex-col ${
                  isSent(message.from) ? "items-end" : "items-start"
                }`}
              >
                <p
                  className={`p-3 rounded-lg shadow-md tracking-wide break-words ${
                    isSent(message.from)
                      ? "bg-blue-100 text-gray-800"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {message.text}
                </p>
                <p
                  className={`text-xs text-gray-400 mt-1 ${
                    isSent(message.from) ? "text-left" : "text-right"
                  }`}
                >
                  <DateFormatter date={message.date} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintChat;
