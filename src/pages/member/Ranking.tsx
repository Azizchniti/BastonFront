import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { Member } from "@/types";

const gradeColors: Record<string, string> = {
  beginner: "bg-slate-500",
  standard: "bg-blue-500",
  gold: "bg-yellow-500",
  platinum: "bg-violet-500",
  diamond: "bg-emerald-500",
};

const RankingPage = () => {
  const [ranking, setRanking] = useState<Member[]>([]);
  const { getTopMembers } = useData();

  useEffect(() => {
    const fetchRanking = async () => {
      const data = await getTopMembers();
      if (data) setRanking(data);
    };
    fetchRanking();
  }, [getTopMembers]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Ranking de Comissões</h1>
      <div className="space-y-4">
        {ranking.map((member, index) => (
          <Card key={member.id} className="flex items-center justify-between p-4 shadow">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold w-6">{index + 1}</div>
              <div>
                <p className="font-semibold text-lg">
                  {member.first_name} {member.last_name}
                </p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${gradeColors[member.grade]}`}
                >
                  {member.grade}
                </span>
              </div>
            </div>
            <div className="text-lg font-bold text-green-600">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(member.total_commission)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RankingPage;
