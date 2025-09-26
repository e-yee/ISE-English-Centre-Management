import { useState } from 'react';
import { useRooms } from '@/hooks/entities/useRooms';
import roomService from '@/services/entities/roomService';
import type { Room } from '@/types/room';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DeleteConfirmationModal from '@/components/notifications/DeleteConfirmationModal';

export default function RoomPage() {
  const { data: rooms = [], isLoading } = useRooms();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [target, setTarget] = useState<Room | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onCreate = async () => {
    if (!name.trim()) return;
    await roomService.create({ name: name.trim() });
    setName('');
    setOpen(false);
    await qc.invalidateQueries({ queryKey: ['rooms'] });
  };

  const onDeleteClick = (room: Room) => {
    setTarget(room);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!target) return;
    try {
      setConfirmLoading(true);
      await roomService.remove(target.id);
      await qc.invalidateQueries({ queryKey: ['rooms'] });
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
      setTarget(null);
    }
  };

  return (
    <div className="p-6 h-full space-y-4">
      <div className="flex items-center justify-between h-fit">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard" aria-label="Back to Dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Rooms</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Room name" />
            </div>
            <DialogFooter>
              <Button onClick={onCreate} disabled={!name.trim()}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex-1 h-full">
          <div className="grid gap-4 grid-cols-3 h-[90%] overflow-y-auto">
            {rooms.map((r: Room) => (
              <Card className="" key={r.id}>
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{r.name}</CardTitle>
                    <Badge
                      className={
                        r.status === 'Free'
                          ? 'bg-emerald-500 text-white'
                          : r.status === 'Occupied'
                          ? 'bg-amber-400 text-black'
                          : r.status === 'Maintenance'
                          ? 'bg-slate-500 text-white'
                          : ''
                      }
                      variant="secondary"
                    >
                      {r.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">ID: {r.id}</div>
                  <Button variant="destructive" size="sm" onClick={() => onDeleteClick(r)}>Delete</Button>
                </CardContent>
              </Card>
            ))}
            {rooms.length === 0 && (
              <div className="text-sm text-muted-foreground">No rooms yet</div>
            )}
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        itemName={target?.name}
        title="Delete Room?"
        description={target ? `This will permanently delete room "${target.name}" (ID: ${target.id}).` : undefined}
        onConfirm={confirmDelete}
        confirmLoading={confirmLoading}
      />
    </div>
  );
}


