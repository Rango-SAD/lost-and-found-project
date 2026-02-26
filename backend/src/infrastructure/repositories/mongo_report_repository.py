from ..persistence import db

class ReportRepository:
    async def add_report(self, target_type: str, target_id: str, reporter: str):
        await db.reports.insert_one({
            "target_type": target_type,
            "target_id": target_id,
            "reporter": reporter
        })
        return await db.reports.count_documents({"target_id": target_id})