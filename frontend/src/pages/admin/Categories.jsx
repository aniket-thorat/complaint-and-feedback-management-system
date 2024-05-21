import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import Table from "../../components/Table/Table";
import { categoriesPageGrid } from "../../data/pagesGrid";
import InputWithIcon from "../../UI/InputWithIcon";
import Alert from "../../UI/Alert";
import Button from "../../UI/Button";
import { FaIdCard } from "react-icons/fa6";
import axios from "axios";

const Categories = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesHasError,
  } = useAxios("http://127.0.0.1:5000/api/v1/categories", "GET");

  const [sortBy, setSortBy] = useState("id");

  useEffect(() => {
    if (categories) {
      const newData = categories.map((element) => ({
        id: element._id,
        name: element.name,
        number: parseInt(element.number),
      }));

      setCategoriesList(newData);
    }
  }, [categories]);

  const sortHandler = (value) => {
    setSortBy(value);
  };

  const [Category, setCategory] = useState("");
  const [text, settext] = useState("");

  function waitThreeSeconds() {
    // This function will be executed after the delay
    // console.log("Waited for 3 seconds!");
    settext("");
  }

  const CreateCategory = (value) => {
    if (value.length > 2) {
      const categoryData = {
        name: value,
      };
      setCategory("");
      settext("Category Created");
      console.log(value);
      // Set a timer to execute the waitThreeSeconds function after 3000 milliseconds (3 seconds)
      setTimeout(waitThreeSeconds, 1000);
      axios
        .post("http://127.0.0.1:5000/api/v1/categories", categoryData)
        .then((response) => {
          console.log(response.status, response.data.token);
        });
    }
  };
  return (
    <>
      <h1 style={{ fontSize: "20px" }}>Create New Category</h1>
      <br></br>
      <InputWithIcon
        icon={<FaIdCard />}
        // inputError={firstNameInputHasError}
        type="text"
        id="newcategory"
        name="newcategory"
        placeholder="Create Category"
        value={Category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <h3>{text}</h3>
      {/* <Alert text={text} /> */}
      <br></br>
      <Button
        type="submit"
        text="Create Category"
        onClick={() => CreateCategory(Category)}
      />
      <br></br>
      <br></br>
      <Table
        title="Categories"
        table={categoriesPageGrid}
        elements={categoriesList}
        pagination={false}
        isLoading={categoriesLoading}
        error={categoriesHasError}
        search={false}
        filteredArray={categoriesList}
        sortBy={sortBy}
        sortHandler={sortHandler}
      />
    </>
  );
};

export default Categories;
