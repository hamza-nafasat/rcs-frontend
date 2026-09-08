import { useState } from "react";
import ClientFddHeading from "./components/ClientFddHeading";
import ClientFddFilter from "./components/ClientFddFilter";
import ClientFddTable from "./components/ClientFddTable";

const initialDocuments = [
  {
    id: 1,
    document: "California State FDD 2025.pdf",
    version: "3.2",
    brand: "Burger Hub",
    country: "United States",
    state: "California",
    status: "Approved",
  },
  {
    id: 2,
    document: "New York State FDD 2025.pdf",
    version: "4.0",
    brand: "Burger Hub",
    country: "United States",
    state: "New York",
    status: "Approved",
  },
  {
    id: 3,
    document: "General US Federal FDD 2025.pdf",
    version: "5.0",
    brand: "Burger Hub",
    country: "United States",
    state: "Texas",
    status: "Approved",
  },
  {
    id: 4,
    document: "Pizza Corner Disclosure.pdf",
    version: "1.0",
    brand: "Pizza Corner",
    country: "USA",
    state: "Ontario",
    status: "Pending",
  },
  {
    id: 5,
    document: "Sushi Place FDD.pdf",
    version: "1.2",
    brand: "Sushi Place",
    country: "United Kingdom",
    state: "London",
    status: "Draft",
  },
];

const initialFilters = {
  country: [],
  state: "",
  brand: [],
  document: "",
};

const ClientFDD = () => {
  const [documents] = useState(initialDocuments);
  const [filters, setFilters] = useState(initialFilters);

  const countries = [...new Set(documents.map((doc) => doc.country))];
  const brands = [...new Set(documents.map((doc) => doc.brand))];

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
        <ClientFddHeading
          heading="FDD Document"
          subheading="Manage your Franchise Disclosure Documents versions."
        />
      </section>

      <section className="mt-6">
        <ClientFddFilter
          filters={filters}
          setFilters={setFilters}
          countries={countries}
          brands={brands}
        />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <ClientFddTable
          documents={filteredDocuments}
          onReview={(row) => console.log("Review", row)}
          onESign={(row) => console.log("E-sign", row)}
          onDownload={(row) => console.log("Download", row)}
        />
      </section>
    </article>
  );
};

export default ClientFDD;
