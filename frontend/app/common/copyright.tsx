"use client";

import React from "react";

const CopyRight = () => {
    const year = new Date().getFullYear();
  return (
    <>
      <p>
        © {year} Busuanga Island Electric Cooperative Inc.
        (BISELCO). All Rights Reserved.
      </p>
      <p className="mt-1 text-slate-600">
        Regulated under the National Electrification Administration (NEA)
      </p>
    </>
  );
};

export default CopyRight;
