import { useMemo, useState } from 'react';

type BillAmendmentTableLike = {
  law_id?: string;
  law_name?: string;
  rows?: Array<Record<string, any>>;
};

type BillLike = {
  對照表?: BillAmendmentTableLike[];
};

type BillAmendmentTabsProps = {
  bill: BillLike;
  billType: string;
};

function getCellValue(row: Record<string, any>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '無';
}

function AmendmentTable({ table }: { table: BillAmendmentTableLike }) {
  if (!table.rows || table.rows.length === 0) {
    return <p className="text-sm text-gray-500">無對照資料</p>;
  }

  return (
    <div className="space-y-3">
      {table.rows.map((row: Record<string, any>, idx: number) => {
        const articleNo = getCellValue(row, ['條號', 'law_content_id']);
        const currentText = getCellValue(row, ['現行', '現行法']);
        const amendedText = getCellValue(row, ['修正']);
        const note = getCellValue(row, ['說明', '審查會通過條文:備註']);

        return (
          <div key={idx} className="border border-gray-200 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">{articleNo}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-black text-gray-600 mb-1">現行</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentText}</p>
              </div>
              <div>
                <p className="text-[11px] font-black text-gray-600 mb-1">修正</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{amendedText}</p>
              </div>
            </div>
            {note !== '無' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[11px] font-black text-gray-600 mb-1">說明</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BillAmendmentTabs({ bill, billType }: BillAmendmentTabsProps) {
  const tables = useMemo(() => bill.對照表 || [], [bill.對照表]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!tables.length) {
    return (
      <section className="mt-8 bg-white border-2 border-gray-200 p-6 md:p-8">
        <h2 className="text-lg font-black mb-2 uppercase tracking-wide">法條對照</h2>
        <p className="text-sm text-gray-500">本議案目前無法條對照表。</p>
      </section>
    );
  }

  const active = tables[Math.min(activeIndex, tables.length - 1)];

  return (
    <section className="mt-8 bg-white border-2 border-gray-200 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h2 className="text-lg font-black uppercase tracking-wide">法條對照</h2>
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">{billType}</p>
      </div>

      {tables.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tables.map((table: BillAmendmentTableLike, idx: number) => (
            <button
              key={`${table.law_id}-${idx}`}
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1 text-xs font-black uppercase tracking-wider border ${
                idx === activeIndex ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              {table.law_name || `版本 ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <AmendmentTable table={active} />
    </section>
  );
}
