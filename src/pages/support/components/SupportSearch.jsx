import { Search } from "lucide-react";
import Input from "../../../components/shared/Input";

const SupportSearch = ({ search, setSearch }) => {
  return (
    <section className="w-full">
      <Input
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Ticket ID or Subject"
        icon={<Search size={16} />}
        iconPosition="left"
      />
    </section>
  );
};

export default SupportSearch;
