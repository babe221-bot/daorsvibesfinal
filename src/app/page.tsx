
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Daors Forge AI Systems</h1>
        <nav>
          <Link href="/login">
            <Button>Prijavi se</Button>
          </Link>
        </nav>
      </header>

      <main className="pt-24">
        <section className="text-center py-20 px-6 bg-white">
          <h2 className="text-5xl font-bold mb-4">Revolucionirajte Svoje Glazbeno Stvaralaštvo</h2>
          <p className="text-xl text-gray-600 mb-8">
            Naša aplikacija pruža glazbenicima alate za transkripciju, analizu i suradnju kao nikada prije.
          </p>
          <Link href="/dashboard">
            <Button size="lg">Započnite besplatno</Button>
          </Link>
        </section>

        <section id="about" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-center mb-12">O nama</h3>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-2xl font-semibold mb-4">Daors Forge AI Systems</h4>
                <p className="text-gray-700 leading-relaxed">
                  Mi smo tehnološka tvrtka specijalizirana za razvoj AI rješenja za glazbenu industriju. Naša misija je osnažiti glazbenike s najnovijom tehnologijom kako bi pomaknuli granice kreativnosti. Posjetite našu web stranicu kako biste saznali više:
                  <a href="https://daorsforgeaisystems.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer"> daorsforgeaisystems.com</a>.
                </p>
              </div>
              <div className="w-full h-64 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                <p className="text-gray-500">Mjesto za sliku tvrtke</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-bold text-center mb-12">Značajke</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-gray-50 rounded-lg shadow-md">
                <h4 className="text-2xl font-semibold mb-4">Povijest Glazbenika</h4>
                <p className="text-gray-700">
                  Od trubadura na srednjovjekovnim dvorovima do modernih uličnih svirača, glazbenici su oduvijek tražili načine kako zaraditi za život svirajući. Naša platforma odaje počast toj tradiciji olakšavajući modernim umjetnicima da se povežu s publikom i unovče svoj talent.
                </p>
              </div>
              <div className="p-8 bg-gray-50 rounded-lg shadow-md">
                <h4 className="text-2xl font-semibold mb-4">Raznolikost Instrumenata</h4>
                <p className="text-gray-700">
                  Bilo da svirate gitaru, klavir, violinu ili bubnjeve, naša platforma podržava širok spektar instrumenata. Istražite povijest i zvuk različitih instrumenata i pronađite inspiraciju za svoju sljedeću skladbu.
                </p>
              </div>
              <div className="p-8 bg-gray-50 rounded-lg shadow-md">
                <h4 className="text-2xl font-semibold mb-4">Mjesta za Slike i Videozapise</h4>
                <p className="text-gray-700">
                  Dodajte vizualnu dimenziju svojoj glazbi. Naša platforma vam omogućuje jednostavno dodavanje slika i videozapisa uz vaše skladbe.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 text-center">
          <h3 className="text-4xl font-bold mb-4">Jeste li spremni?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Pridružite se našoj zajednici glazbenika i podignite svoju glazbu na višu razinu.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="default">Idi na kontrolnu ploču</Button>
          </Link>
        </section>
      </main>

      <footer className="py-8 px-6 bg-gray-800 text-white text-center">
        <p>&copy; {new Date().getFullYear()} Daors Forge AI Systems. Sva prava pridržana.</p>
      </footer>
    </div>
  );
}
