"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export function SettingsForm() {
  return (
    <div className="space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Moj Profil</CardTitle>
          <CardDescription>
            Ažurirajte svoje podatke.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ime</Label>
            <Input id="name" defaultValue="Daors" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="daors@example.com" />
          </div>
           <Button variant="outline">Promijeni Lozinku</Button>
        </CardContent>
        <CardFooter>
          <Button>Sačuvaj Promjene</Button>
        </CardFooter>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Postavke Teme</CardTitle>
          <CardDescription>
            Prilagodite izgled aplikacije.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="dark" className="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Svijetla
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Tamna
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

       <Card className="glass-card">
        <CardHeader>
          <CardTitle>Notifikacije</CardTitle>
          <CardDescription>
            Upravljajte načinom na koji primate obavijesti.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
              <span>Marketing Emails</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Primajte emailove o novim proizvodima, funkcijama i još mnogo toga.
              </span>
            </Label>
            <Switch id="marketing-emails" defaultChecked />
          </div>
           <div className="flex items-center justify-between space-x-4">
            <Label htmlFor="social-emails" className="flex flex-col space-y-1">
              <span>Društvene Notifikacije</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Primajte notifikacije o interakcijama na platformi.
              </span>
            </Label>
            <Switch id="social-emails" />
          </div>
        </CardContent>
        <CardFooter>
            <Button>Sačuvaj Promjene</Button>
        </CardFooter>
      </Card>
      
       <Card className="border-destructive glass-card">
        <CardHeader>
          <CardTitle>Nalog</CardTitle>
          <CardDescription>
            Upravljajte postavkama svog naloga.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="destructive">Obriši Nalog</Button>
        </CardContent>
      </Card>
    </div>
  )
}
