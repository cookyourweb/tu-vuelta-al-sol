'use client';

interface PageNumberProps {
  pageNumber: number;
}

export default function PageNumber({ pageNumber }: PageNumberProps) {
  return (
    <div className="print-only absolute bottom-6 left-0 right-0 flex justify-center">
      <span className="text-xs text-gray-400 font-body">
        {pageNumber}
      </span>
    </div>
  );
}
