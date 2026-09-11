import { useState } from "react"
import FranchiseeTable from "./components/FranchiseeTable"
import FranchiseeFilter from "./components/FranchiseeFilter";
import FranchiseeHeading from "./components/FranchiseeHeading";

const Franchisee = () => {
    const initialFilters = {
        restaurant: "",
        owner: "",
        status: [],
    };
    const [filters, setFilters] = useState(initialFilters);

    return (
        <article>
            <FranchiseeHeading
                className="fade-up"
                heading="Franchisee Management"
                subheading="Manage your franchisees and their information."
            />
            <section className="mt-6">
                <FranchiseeFilter
                    filters={filters}
                    setFilters={setFilters}
                />
            </section>
            <FranchiseeTable className="mt-5" filters={filters} />
        </article>
    )
}

export default Franchisee
