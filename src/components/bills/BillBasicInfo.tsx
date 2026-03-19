interface BillBasicInfoProps {
  bill: {
    提案人?: string;
    提案日期?: string;
    議案狀態?: string;
    議案編號?: string;
  };
}

export default function BillBasicInfo({ bill }: BillBasicInfoProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm border-t border-gray-200 pt-8">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">提案人</p>
        <p className="font-bold">{bill.提案人 || '無紀錄'}</p>
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">提案日期</p>
        <p className="font-bold">{bill.提案日期 || '無紀錄'}</p>
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">議案狀態</p>
        <p className="font-bold">{bill.議案狀態 || '無紀錄'}</p>
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">議案編號</p>
        <p className="font-bold font-mono">{bill.議案編號}</p>
      </div>
    </div>
  );
}
