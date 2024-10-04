import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { backend } from "../../config/baseUrl";

interface ProductDeleteProps {
  productId: number;
  onDelete: (id: number) => void; // Callback function to update the parent state
}

const ProductDelete: React.FC<ProductDeleteProps> = ({
  productId,
  onDelete,
}) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "ml-auto",
        cancelButton: "mr-auto",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${backend}/products/${productId}`);
        onDelete(productId);
      } catch (error) {
        Swal.fire(
          "Error!",
          "There was a problem deleting your product.",
          "error"
        );
      }
    }
  };

  return (
    <button
      className="ml-2 px-2 py-1 text-xs rounded-lg bg-red-600 text-white"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
};

export default ProductDelete;
