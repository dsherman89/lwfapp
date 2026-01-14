"use client";

export default function DeleteUserButton() {
  return (
    <button
      className="btn"
      type="submit"
      onClick={(e) => {
        if (!confirm("Are you sure you want to delete this user?")) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      Delete
    </button>
  );
}
