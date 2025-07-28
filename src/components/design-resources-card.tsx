import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Server, LayoutTemplate, Palette, Lightbulb, ArrowRight, BookOpen } from "lucide-react";

export function DesignResourcesCard() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
          <BookOpen /> UI/UX Design Resources
        </CardTitle>
        <CardDescription className="text-gray-300">
          A curated list of free resources to accelerate your app design and development.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <Server /> FirebaseUI (Official)
          </h3>
          <p className="text-gray-300">
            Open-source JavaScript library that provides simple, customizable UI bindings on top of Firebase SDKs. Especially powerful for authentication flows.
          </p>
          <a href="https://github.com/firebase/firebaseui-web" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
              View on GitHub <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <LayoutTemplate /> Boilerplates & Starter Kits
          </h3>
          <p className="text-gray-300">
            Starter kits for building dashboards and apps with Firebase using various frameworks like React, Angular, and Vue, often including UI components.
          </p>
          <a href="https://github.com/search?q=firebase+template" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
              Find Templates <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <Palette /> General Purpose UI Kits
          </h3>
          <p className="text-gray-300">
            Adaptable design systems like Material Design (MUI), Tailwind CSS, and Bootstrap to build your UI on top of a Firebase backend.
          </p>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-white/20">
              <AccordionTrigger className="hover:no-underline">Learn More</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside text-gray-300 space-y-2 pl-2">
                  <li><b>Material-UI (MUI) for React:</b> Implements Google's Material Design.</li>
                  <li><b>Angular Material:</b> Official Material Design library for Angular.</li>
                  <li><b>Tailwind CSS:</b> A utility-first CSS framework for rapid UI development.</li>
                  <li><b>Bootstrap:</b> A classic and widely-used CSS framework.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <Lightbulb /> Design Resources for Developers
          </h3>
          <p className="text-gray-300">
            Curated lists of design assets including illustrations (UnDraw.co), icons (Feather, Tabler), and more to enhance your app's look and feel.
          </p>
          <a href="https://github.com/bradtraversy/design-resources-for-developers" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">
              Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
