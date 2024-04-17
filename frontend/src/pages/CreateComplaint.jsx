import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxios from "../hooks/useAxios";
import useInput from "../hooks/useInput";
import Hero from "../UI/Hero";
import Alert from "../UI/Alert";
import Button from "../UI/Button";
import UserPageLoading from "../components/States/UserPageLoading";
import UserPageError from "../components/States/UserPageError";
import Input from "../UI/Input";
import ErrorText from "../UI/ErrorText";
import Section from "../layout/Section";
import "../components/Complaint/Complaints.css";
const CreateComplaint = () => {
  const navigate = useNavigate();

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesHasError,
  } = useAxios("http://127.0.0.1:5000/api/v1/categories", "GET");

  const {
    value: enteredTitle,
    valueIsValid: enteredTitleIsValid,
    hasError: titleInputHasError,
    valueChangeHandler: titleInputChangeHandler,
    inputBlurHandler: titleInputBlurHandler,
  } = useInput(
    (value) => value.trim().length >= 10 && value.trim().length <= 50
  );

  const {
    value: enteredCategory,
    valueChangeHandler: categoryInputChangeHandler,
    inputBlurHandler: categoryInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredMessage,
    valueIsValid: enteredMessageIsValid,
    hasError: messageInputHasError,
    valueChangeHandler: messageInputChangeHandler,
    inputBlurHandler: messageInputBlurHandler,
  } = useInput((value) => value.trim().length >= 50);

  const formIsValid = enteredMessageIsValid && enteredTitleIsValid;

  const [submitting, setSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState(false);
  const [rating, setRating] = useState(0);
  const [file , setFile] = useState(null);
    
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

    const submitHandler = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('image', file);
      console.log("Rating is ", rating);
      if (!formIsValid) {
        return;
      }

      setSubmitting(true);

      try {
        await axios({
          method: "POST",
          url: "http://127.0.0.1:5000/api/v1/complaints",
          data: {
            title: enteredTitle,
            category: enteredCategory || categories[0]._id,
            text: enteredMessage,
            product_rating: rating,
            image: file
          },
          headers:{
            'Content-Type': 'multipart/form-data',
          },
        });

        setSubmitting(false);
        navigate("/my-complaints");
      } catch (error) {
        setSubmitting(false);
        setSubmittingError(true);
      }
    };
  

  if (categoriesLoading) {
    return <UserPageLoading title="Create a New Complaint" />;
  }

  if (categoriesHasError) {
    return <UserPageError title="Create a New Complaint" />;
  }

  return (
    <>
      <Hero title="Create a New Complaint" />
      <Section>
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-10">
          <form
            className="lg:col-span-2 order-2 lg:order-1 flex flex-col gap-6"
            onSubmit={submitHandler}
          >
            {submittingError && (
              <ErrorText text="An error occurred while submitting your complaint." />
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-0.5">
                <Input
                  className="!rounded-none"
                  name="title"
                  placeholder="Title"
                  inputError={titleInputHasError}
                  value={enteredTitle}
                  onChange={titleInputChangeHandler}
                  onBlur={titleInputBlurHandler}
                />
                {titleInputHasError && (
                  <ErrorText text="Title must be [10, 50] characters." />
                )}
              </div>
              <select
                className="h-fit w-full py-[0.45rem] px-3 bg-white border border-gray-200 outline-none text-gray-600"
                name="categoryId"
                onChange={categoryInputChangeHandler}
                onBlur={categoryInputBlurHandler}
                value={enteredCategory}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <textarea
                className={`min-h-[150px] py-[0.45rem] px-3 bg-white border border-gray-200 outline-none text-gray-600 ${
                  messageInputHasError &&
                  "!bg-red-100 border-red-200 focus:!bg-orange-100"
                }`}
                placeholder="Message"
                onChange={messageInputChangeHandler}
                onBlur={messageInputBlurHandler}
                value={enteredMessage}
              />
              {messageInputHasError && (
                <ErrorText text="Message must be at least 50 characters." />
              )}
            </div>
            <div>
              <h1 className="star-label">Rate this product</h1>
              <div class="rating">
                <input
                  type="radio"
                  id="star5"
                  onClick={() => setRating(5)}
                  name="rating"
                  value="5"
                />
                <label for="star5">★</label>
                <input
                  type="radio"
                  id="star4"
                  onClick={() => setRating(4)}
                  name="rating"
                  value="4"
                />
                <label for="star4">★</label>
                <input
                  type="radio"
                  id="star3"
                  onClick={() => setRating(3)}
                  name="rating"
                  value="3"
                />
                <label for="star3">★</label>
                <input
                  type="radio"
                  id="star2"
                  onClick={() => setRating(2)}
                  name="rating"
                  value="2"
                />
                <label for="star2">★</label>
                <input
                  type="radio"
                  id="star1"
                  onClick={() => setRating(1)}
                  name="rating"
                  value="1"
                />
                <label for="star1">★</label>
              </div>
            </div>

            <div>
              <h1>Upload image</h1>
              <input type="file" id="image-input" name="image" onChange={handleFileChange}/>
            </div>
            <div className="flex flex-row gap-5">
              <Button
                text="Cancel"
                onClick={() => {
                  navigate("/my-complaints");
                }}
              />
              <Button text="Submit" disabled={submitting} />
            </div>
          </form>
          {/* <div> */}
        </div>
      </Section>
    </>
  );
};
export default CreateComplaint;
