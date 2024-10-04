import axios from "axios";
import React, { useEffect, useState } from "react";
import { backend } from "../../config/baseUrl";
import { useNavigate, useParams } from "react-router-dom";

const ProductUpdate: React.FC = () => {
  const param = useParams();
  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    price: "",
    discount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getData = async () => {
    const response = await axios.get(`${backend}/products/${param.id}`);
    setFormData({
      product_name: response.data.product_name,
      category: response.data.category,
      price: response.data.price.toString().replace(".00", ""),
      discount:
        response?.data?.discount?.toString().replace(/(\.\d{2})$/, ".99") || 0,
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.product_name)
      newErrors.product_name = "Product name is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.price && isNaN(Number(formData.price)))
      newErrors.price = "Price is required and must be a number";
    if (formData.discount && isNaN(Number(formData.discount)))
      newErrors.discount = "Discount must be a number.";
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (validate()) {
      try {
        const removeTitik = formData.price
          .replace(/\./g, "")
          .replace(/,/g, ".");
        const formatedFormData = { ...formData, price: removeTitik };
        const response = await axios.put(
          `${backend}/products/${param.id}`,
          formatedFormData
        );
        if (response.status === 200) {
          navigate("/product");
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 422) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              ...error?.response?.data.errors,
            }));
          }
        } else {
          // Penanganan kesalahan umum lainnya
          console.error("An unexpected error occurred:", error);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const formattedValue = name === "price" ? value.replace(/\./g, ",") : value;
    setFormData({ ...formData, [name]: formattedValue });
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [name]: undefined,
    }));
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold">Update Product</h1>
        </div>
      </div>

      <div className="mb-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto p-4 mt-8 border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label
              className={`block mb-2 ${errors.product_name && "text-red-500"}`}
              htmlFor="product_name"
            >
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className={`border rounded w-full py-2 px-3 ${
                errors.product_name && "border-red-500"
              }`}
            />
            {errors.product_name && (
              <small className="text-red-500">{errors.product_name}</small>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`block mb-2 ${errors.category && "text-red-500"}`}
              htmlFor="category"
            >
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`border rounded w-full py-2 px-3 ${
                errors.category && "border-red-500"
              }`}
            />
            {errors.category && (
              <small className="text-red-500">{errors.category}</small>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`block mb-2 ${errors.price && "text-red-500"}`}
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`border rounded w-full py-2 px-3 ${
                errors.price && "border-red-500"
              }`}
            />
            {errors.price && (
              <small className="text-red-500">{errors.price}</small>
            )}
          </div>

          <div className="mb-4">
            <label
              className={`block mb-2 ${errors.discount && "text-red-500"}`}
              htmlFor="discount"
            >
              Discount
            </label>
            <input
              type="text"
              name="discount"
              value={formData.discount}
              maxLength={6}
              onChange={handleChange}
              className={`border rounded w-full py-2 px-3 ${
                errors.discount && "border-red-500"
              }`}
            />
            {errors.discount && (
              <small className="text-red-500">{errors.discount}</small>
            )}
          </div>

          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 px-4 rounded w-full ${
              isLoading && "bg-slate-500"
            }`}
            disabled={isLoading}
          >
            {!isLoading ? "Submit" : "Loading"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdate;
