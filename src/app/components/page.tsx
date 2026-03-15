import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff";
import { ScoreRing } from "@/components/ui/score-ring";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CodeEditorDemo } from "./editor-demo";

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              A collection of reusable UI components.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </header>

        {/* Buttons */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Button</h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/button.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <div className="grid gap-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Variants
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small (sm)</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large (lg)</Button>
                <Button size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                States
              </h3>
              <div className="flex flex-wrap gap-4">
                <Button disabled>Disabled</Button>
                <Button disabled variant="secondary">
                  Disabled
                </Button>
                <Button disabled variant="outline">
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Badge</h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/badge.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <div className="grid gap-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Variants
              </h3>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                With Dot
              </h3>
              <div className="flex flex-wrap gap-4">
                <Badge variant="default" dot>
                  Good
                </Badge>
                <Badge variant="warning" dot>
                  Warning
                </Badge>
                <Badge variant="destructive" dot>
                  Critical
                </Badge>
                <Badge variant="secondary" dot>
                  Neutral
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Card */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Card</h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/card.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <div className="max-w-md">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>You have 3 unread messages.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <User />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Push Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Send notifications to device.
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Mark all as read</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Switch */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Switch</h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/switch.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <Switch id="switch-1" />
                <label htmlFor="switch-1" className="text-sm font-medium">
                  Default (Off)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="switch-2" defaultChecked />
                <label htmlFor="switch-2" className="text-sm font-medium">
                  Default (On)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="switch-3" disabled />
                <label
                  htmlFor="switch-3"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Disabled
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Code Block */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Code Block
            </h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/code-block.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <CodeBlock
              lang="typescript"
              headerRight={
                <span className="font-mono text-xs text-muted-foreground">
                  example.ts
                </span>
              }
              code={`function calculateTotal(items: number[]) {
  return items.reduce((acc, curr) => acc + curr, 0);
}

const prices = [10, 20, 30];
const total = calculateTotal(prices);

console.log(\`Total: \${total}\`);`}
            />
          </div>
        </section>

        {/* Code Editor */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Code Editor
            </h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/code-editor.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <CodeEditorDemo />
          </div>
        </section>

        {/* Score Ring */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Score Ring
            </h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/score-ring.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <div className="flex flex-wrap justify-around gap-8">
              <div className="flex flex-col items-center gap-4">
                <ScoreRing score={2.1} />
                <span className="text-sm font-medium text-muted-foreground">
                  Critical
                </span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <ScoreRing score={5.5} />
                <span className="text-sm font-medium text-muted-foreground">
                  Warning
                </span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <ScoreRing score={9.8} />
                <span className="text-sm font-medium text-muted-foreground">
                  Good
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Diff Line */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Diff Line</h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/diff.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border bg-[#111] p-6">
            <div className="overflow-hidden rounded-md border border-zinc-800">
              <DiffLine type="removed" prefix="-" lineNumber={12}>
                var total = 0;
              </DiffLine>
              <DiffLine type="added" prefix="+" lineNumber={12}>
                const total = 0;
              </DiffLine>
              <DiffLine type="context" lineNumber={13}>
                for (let i = 0; i &lt; items.length; i++) {"{"}
              </DiffLine>
            </div>
          </div>
        </section>

        {/* Table (Leaderboard Row) */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Table</h2>
            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
              ui/table.tsx
            </span>
          </div>

          <div className="grid gap-8 rounded-lg border p-6">
            <Table>
              <TableCaption>A list of recent code roasts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead className="w-[80px]">Score</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead className="text-right">Language</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#1</TableCell>
                  <TableCell className="font-bold text-red-500">2.1</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    function calculateTotal(items) &#123; var total = 0; ...
                  </TableCell>
                  <TableCell className="text-right">javascript</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#2</TableCell>
                  <TableCell className="font-bold text-amber-500">
                    6.4
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    def process_data(data): return [x for x in ...
                  </TableCell>
                  <TableCell className="text-right">python</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3</TableCell>
                  <TableCell className="font-bold text-emerald-500">
                    9.2
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    pub fn main() &#123; println!("Hello, world!"); &#125;
                  </TableCell>
                  <TableCell className="text-right">rust</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
