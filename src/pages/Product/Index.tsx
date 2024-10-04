import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend } from "../../config/baseUrl";
import { ProductInterface } from "../../interface/productInterface";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../../utils/function";
import ProductDelete from "./Delete"; // Import the new component

const ProductIndex = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  const getProduct = async (currentPage: number, search: string) => {
    const response = await axios.get(`${backend}/products`, {
      params: {
        page: currentPage + 1,
        per_page: itemsPerPage,
        search,
      },
    });
    setProducts(response.data.data);
    setPageCount(response.data.last_page);
  };

  useEffect(() => {
    getProduct(currentPage, search);
  }, [currentPage, search, itemsPerPage]);

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Data Product</h1>
        </div>
        <div className="flex-1 text-right">
          <button
            className="bg-blue-500 text-white font-semibold py-1 px-4 rounded-xl shadow hover:bg-blue-600"
            onClick={() => navigate("/product/add")}
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-4 flex">
        <div className="w-6/12 px-2 md:w-1/12 md:px-0">
          <select
            className="border border-gray-300 rounded py-2 px-2 w-full"
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="75">75</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="none md:w-9/12"></div>
        <div className="w-6/12 px-2 md:w-2/12 md:px-0">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded py-2 px-3 w-full"
          />
        </div>
      </div>

      {!products.length ? (
        <div className="w-full bg-red-500 p-4 text-center items-center text-white">
          No Data
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2">ID</th>
                <th className="border border-gray-200 p-2">Name</th>
                <th className="border border-gray-200 p-2">Category</th>
                <th className="border border-gray-200 p-2">Price</th>
                <th className="border border-gray-200 p-2">Discount</th>
                <th className="border border-gray-200 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">{product.id}</td>
                  <td className="border border-gray-200 p-2">
                    {product.product_name}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {product.category}
                  </td>
                  <td className="border border-gray-200 p-2">
                    Rp {formatRupiah(product.price)}
                  </td>
                  <td className="border border-gray-200 p-2">
                    {product.discount && product.discount + "%"}
                  </td>
                  <td className="border border-gray-200 p-2">
                    <button
                      className="px-2 py-1 text-xs rounded-lg bg-green-600 text-white"
                      onClick={() => navigate(`/product/update/${product.id}`)}
                    >
                      Update
                    </button>
                    <ProductDelete
                      productId={product.id}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"flex justify-center mt-4"}
            pageClassName={"mx-1"}
            activeClassName={"font-bold"}
            pageLinkClassName={"border border-gray-300 rounded p-2"}
            previousLinkClassName={"border border-gray-300 rounded p-2"}
            nextLinkClassName={"border border-gray-300 rounded p-2"}
          />
        </div>
      )}
    </div>
  );
};

export default ProductIndex;
