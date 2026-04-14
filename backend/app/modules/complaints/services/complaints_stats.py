from sqlalchemy import select, func, union_all, distinct, literal, case, and_
from sqlalchemy.ext.asyncio import AsyncSession
from ..model.complaints import Complaints
from ..model.status_update import ComplaintsStatusUpdates
from pprint import pprint


async def get_complaints_stats(
    session: AsyncSession
):
    # TOTAL COMPLAINTS
    total_complaints = (
        select(
            func.jsonb_build_object(
                'id', 1,
                'title', 'Total Complaints',
                'value', func.count(Complaints.id),
                'description', 'Includes Deleted'
            ).label("data"))
        .select_from(Complaints)
    ).cte("total_complaints")

    # SUBQUERY FOR COMPLAINTS STATS
    complaints_subquery = (
        select(
            func.count(distinct(ComplaintsStatusUpdates.complaint_id))
            .label("total"),
            func.count(ComplaintsStatusUpdates.complaint_id).filter(
                ComplaintsStatusUpdates.status_id == 4
            ).label("completed")).
        select_from(Complaints)
        .join(ComplaintsStatusUpdates, Complaints.id == ComplaintsStatusUpdates.complaint_id)
        .where(Complaints.is_deleted == False)
    ).subquery("complaints_subquery")

    # COMPLETED COMPLAINTS
    completed_complaints = (
        select(
            func.jsonb_build_object(
                'id', 2,
                'title', 'Completion',
                'value', complaints_subquery.c.completed,
                'description',

                func.concat(
                    case(
                        (func.round(
                            (complaints_subquery.c.completed / func.nullif(complaints_subquery.c.total,0)) * 100, 2) > 50, "📈"),
                        else_="📉"),
                    complaints_subquery.c.total,
                    ' ',

                    '(',
                    func.round(
                        (complaints_subquery.c.completed / func.nullif(complaints_subquery.c.total,0)) * 100, 2),
                    '%',
                    ')')
            ).label("data"))
        .select_from(complaints_subquery)
    ).cte("completed_complaints")

    # DAILY COMPLAINTS
    daily_complaints = (
        select(
            func.jsonb_build_object(
                'id', 3,
                'title', 'Daily Complaints',
                'value', func.count(Complaints.id),
                'description', 'Today'
            ).label("data"))
        .select_from(Complaints)
        .where(and_(Complaints.is_deleted == False,(func.date(Complaints.timestamped) == func.current_date())))
    ).cte("daily_complaints")

    # # TOP 10 COMPLAINTS
    # top_complaints = (
    #     select(
    #         func.jsonb_build_object(
    #             'complaint', Complaints.subject,
    #             'count', func.count(Complaints.id)
    #         ).label("top_complaints"),
    #         func.count(Complaints.id).label("total")
    #     ).select_from(Complaints)
    #     .group_by(Complaints.subject)
    #     .order_by(desc("total"))
    #     .limit(10)
    # ).cte("top_complaints")

    # UNION ALL CTE
    cte_union = (
        union_all(
            select(literal(1).label("id"), total_complaints.c.data),
            select(literal(2).label("id"), completed_complaints.c.data),
            select(literal(3).label("id"), daily_complaints.c.data)
        ).order_by("id")
    ).subquery("cte_union")

    # STATS DATA
    stats_data = select(
        select(
            func.json_agg(cte_union.c.data).label("data"),
        ).scalar_subquery().label("data")
    )

    data = (await session.execute(stats_data)).scalar()
    return data
