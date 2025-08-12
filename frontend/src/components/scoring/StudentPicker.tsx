import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/SearchInput';

interface StudentPickerProps {
  classId: string;
  selectedStudentId?: string;
  onSelect: (student: { id: string; name: string }) => void;
  className?: string;
  items: Array<{ id: string; name: string }>;
}

export const StudentPicker: React.FC<StudentPickerProps> = ({
  classId: _classId,
  selectedStudentId,
  onSelect,
  className,
  items,
}) => {
  const [search, setSearch] = React.useState('');
  const students = items;

  const filtered = React.useMemo(() => {
    if (!search) return students;
    const s = search.toLowerCase();
    return students.filter(
      (st) => st.name.toLowerCase().includes(s) || st.id.toLowerCase().includes(s)
    );
  }, [students, search]);

  return (
    <Card className={cn('h-full w-full max-w-full overflow-hidden bg-white border border-gray-200 shadow-sm rounded-[15px]', className)}>
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <SearchInput placeholder="Search students..." onSearch={setSearch} className="w-full" />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 max-h-[80vh]">
          <div className="space-y-2">
            {filtered.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelect(st)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md border transition-colors',
                  selectedStudentId === st.id
                    ? 'border-violet-600 bg-violet-50'
                    : 'border-gray-200 hover:bg-gray-50'
                )}
              >
                <div className="text-sm font-medium text-gray-900">{(st as any).name || (st as any).fullname || st.id}</div>
                <div className="text-xs text-gray-500">{st.id}</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-6">No students found</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPicker;


