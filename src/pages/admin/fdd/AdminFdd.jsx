import { useState } from "react";
import FddHeading from "./components/FddHeading";
import FddFilter from "./components/FddFilter";
import FddTable from "../../../components/global/FddTable";
import { initialDocuments } from "./utils/data";

const initialFilters = {
  country: [],
  state: "",
  brand: [],
  document: "",
};

const AdminFdd = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filters, setFilters] = useState(initialFilters);

  const countries = [...new Set(documents.map((doc) => doc.country))];
  const brands = [...new Set(documents.map((doc) => doc.brand))];

  const handleAddFdd = (newDoc) => {
    const createdDoc = {
      id: Date.now(),
      document: newDoc.document || `${newDoc.title}.pdf`,
      version: newDoc.version || "1.0",
      brand: Array.isArray(newDoc.brands) ? newDoc.brands.join(", ") : newDoc.brands || "Burger Hub",
      country: newDoc.country || "United States",
      state: newDoc.state || "General (Non-Registration States)",
      status: "Approved",
    };
    setDocuments((prev) => [createdDoc, ...prev]);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchCountry =
      filters.country.length === 0 || filters.country.includes(doc.country);

    const matchBrand =
      filters.brand.length === 0 || filters.brand.includes(doc.brand);

    const matchState = doc.state
      .toLowerCase()
      .includes(filters.state.trim().toLowerCase());

    const matchDocument = doc.document
      .toLowerCase()
      .includes(filters.document.trim().toLowerCase());

    return matchCountry && matchBrand && matchState && matchDocument;
  });

  return (
    <article className="flex h-full min-h-0 flex-col">
      <section className="border-b color-border py-4">
        <FddHeading
          heading="FDD Document"
          subheading="Manage your Franchise Disclosure Documents versions."
          onAddFdd={handleAddFdd}
        />
      </section>

      <section className="mt-6">
        <FddFilter
          filters={filters}
          setFilters={setFilters}
          countries={countries}
          brands={brands}
        />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <FddTable
          documents={filteredDocuments}
          onReview={(row) => console.log("Review", row)}
          onESign={(row) => console.log("E-sign", row)}
          onDownload={(row) => console.log("Download", row)}
        />
      </section>
    </article>
  );
};

export default AdminFdd;
