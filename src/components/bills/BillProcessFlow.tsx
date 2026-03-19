type BillProcessFlowProps = {
  processes: Array<{
    會期?: string;
    狀態?: string;
    日期?: string[];
    [key: string]: any;
  }>;
};

function processDate(value: string): string {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length < 8) return value || '未標註';
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export default function BillProcessFlow({ processes }: BillProcessFlowProps) {
  const normalized = [...(processes || [])].sort((a, b) => {
    const aDate = (a.日期 || []).map(processDate).sort()[0] || '';
    const bDate = (b.日期 || []).map(processDate).sort()[0] || '';
    return aDate.localeCompare(bDate);
  });

  return (
    <section className="mt-8 bg-white border-2 border-gray-200 p-6 md:p-8">
      <h2 className="text-lg font-black mb-4 uppercase tracking-wide">議案流程</h2>
      <div className="space-y-4">
        {normalized.map((process, idx) => {
          const dates = (process.日期 || []).map(processDate).filter(Boolean);
          const committee = process['院會或委員會'] || process['院會/委員會'] || '未標註';
          return (
            <div key={`${process.狀態}-${idx}`} className="border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <p className="text-sm font-black">{process.狀態 || '流程更新'}</p>
                <p className="text-xs text-gray-500">{process.會期 || '未標註會期'}</p>
              </div>
              <p className="text-xs text-gray-600 mb-1">{committee}</p>
              <p className="text-xs font-bold text-gray-700">
                日期：{dates.length ? dates.join(' / ') : '未標註'}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
