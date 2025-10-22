import * as React from "react";
import Login from "./page/Auth/Login";

function App() {


  return (
    <>
      <div class="grid grid-cols-2 h-screen">
        {/* Image Display*/}
        <div class="relative bg-antique-white-image w-full h-auto bg-cover bg-center">
          <div class="absolute inset-0 bg-[var(--color-background)] opacity-100 mix-blend-multiply"></div>
        </div>
        {/* Formulaire */}
        <div class="mx-auto my-auto max-auto px-4 py-16 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-lg text-center">
            <h1 class="italic">Bon retour à toi!</h1>
            <p class="mt-4 text-gray-600">Ceci est facile à utiliser</p>
          </div>

          <Login></Login>
        </div>
      </div>
    </>
  );
}

export default App;
