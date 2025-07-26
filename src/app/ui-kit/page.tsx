import AppLayout from "@/components/layout/app-layout";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function UIKitPage() {
  return (
    <AppLayout>
      <Header title="UI Kit" />
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div className="grid gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Examples of text styles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h1>Headline 1</h1>
              <h2>Headline 2</h2>
              <h3>Headline 3</h3>
              <p>This is a paragraph of body text using PT Sans. It's designed for readability. The quick brown fox jumps over the lazy dog.</p>
              <p className="text-muted-foreground">This is muted text, for secondary information.</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Various button styles.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button className="gradient-btn">Gradient</Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Inputs, sliders, and switches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label>Input</label>
                <Input placeholder="Enter some text..." />
              </div>
              <div className="space-y-2">
                <label>Slider</label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <label htmlFor="airplane-mode">Switch</label>
              </div>
              <div className="space-y-2">
                <label>Progress</label>
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Alert components for notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        This is a default alert.
                    </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                        This is a destructive alert.
                    </AlertDescription>
                </Alert>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
                <CardTitle>Tabs</CardTitle>
                <CardDescription>Tabbed navigation component.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
            </CardContent>
          </Card>

           <Card className="glass-card">
            <CardHeader>
                <CardTitle>Tooltip</CardTitle>
                <CardDescription>Tooltip component example.</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline">Hover me</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This is a tooltip!</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardContent>
          </Card>

        </div>
      </main>
    </AppLayout>
  );
}
