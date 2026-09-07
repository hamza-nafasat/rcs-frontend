import { useState } from 'react'
import ClientFranchiseeTable from './component/ClientFranchiseeTable'
import ClientFranchiseeFilter from './component/ClientFranchiseeFilter';
import FranchiseeHeading from './component/FranchiseeHeading';

const ClientFranchisee = () => {
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
                <ClientFranchiseeFilter
                    filters={filters}
                    setFilters={setFilters}
                />
            </section>
            <ClientFranchiseeTable className="mt-5" filters={filters} />
        </article>
    )
}

export default ClientFranchisee
