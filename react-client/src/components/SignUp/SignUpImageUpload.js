import React, { useState } from "react";

const SignUpImageUpload = ({ handleImageUpload, preview }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        type="button"
        onClick={() => document.getElementById("file-upload").click()}
        style={{
          backgroundColor: "var(--button-secondary-color)",
          marginBottom: "10px",
        }}
      >
        Upload Image
      </button>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      {preview && (
        <img
          src={preview}
          alt="Profile Preview"
          style={{
            width: "100px",
            height: "100px",
            marginBottom: "14px",
            border: "2px solid var(--link-color-blue)",
            borderRadius: "5px",
            padding: "5px",
          }}
        />
      )}
    </div>
  );
};

export default SignUpImageUpload;
