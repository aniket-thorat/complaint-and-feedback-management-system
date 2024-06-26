import axios from "axios";
import TextareaForm from "../../UI/TextareaForm";

const ComplaintForm = ({
  complaintId,
  message,
  setMessage,
  status,
  reFetchComplaintDetails,
  reFetchMessages,
}) => {
  const sendMessageHandler = async () => {
    await axios({
      method: "POST",
      url: "http://127.0.0.1:5000/api/v1/messages",
      data: {
        complaintId,
        text: message,
      },
    });

    setMessage("");

    if (parseInt(status) === 0) {
      reFetchComplaintDetails();
    }

    reFetchMessages();
  };

  return (
    <TextareaForm
      text={message}
      setText={setMessage}
      placeholder="Your message..."
      submitFunction={sendMessageHandler}
      conditionToSend={(value) => value.trim().length >= 1}
    />
  );
};

export default ComplaintForm;
