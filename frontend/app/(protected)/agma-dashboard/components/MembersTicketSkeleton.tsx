import AgmaTicketSkeletonCard from '../../../agma-registration/registered/components/agmaTicketSkeletonCard';


const MembersTicketSkeleton = () => {
    const numberofTickets = Array.from({length: 4}, (_, index) => index);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
        {numberofTickets?.map((ticket) => (
            <AgmaTicketSkeletonCard key={ticket} />
        ))}
    </div>
  )
}

export default MembersTicketSkeleton