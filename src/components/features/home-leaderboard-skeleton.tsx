import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LeaderboardSkeleton() {
  return (
    <div className="w-full max-w-5xl space-y-8 pt-8 animate-pulse">
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-emerald-500/50 text-xl font-bold">
            {"//"}
          </span>
          <div className="h-6 w-48 bg-zinc-900 rounded" />
        </div>
        <div className="h-8 w-24 bg-zinc-900 rounded" />
      </div>

      <div className="h-4 w-64 bg-zinc-900 rounded" />

      <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]">
        <Table>
          <TableHeader className="bg-[#111111]">
            <TableRow className="border-b border-[#2A2A2A]">
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead className="w-[100px]">Score</TableHead>
              <TableHead className="min-w-[400px]">Code Preview</TableHead>
              <TableHead className="text-right">Language</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i} className="border-b border-[#2A2A2A]">
                <TableCell className="align-top pt-4">
                  <div className="h-4 w-4 bg-zinc-900 rounded" />
                </TableCell>
                <TableCell className="align-top pt-4">
                  <div className="h-4 w-8 bg-zinc-900 rounded" />
                </TableCell>
                <TableCell className="py-4">
                  <div className="h-[160px] w-full bg-zinc-900/50 rounded-md border border-zinc-800" />
                </TableCell>
                <TableCell className="text-right align-top pt-4">
                  <div className="ml-auto h-4 w-16 bg-zinc-900 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-[#2A2A2A]">
        <div className="h-4 w-32 bg-zinc-900 rounded" />
        <div className="h-4 w-24 bg-zinc-900 rounded" />
      </div>
    </div>
  );
}
