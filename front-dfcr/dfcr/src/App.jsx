import InputField from "./components/input/InputField"
function App() {
  return (
    <>
      <h1 class="text-3xl font-bold underline">Vite + React</h1>

      <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-lg text-center">
          <h1 class="text-2xl font-bold sm:text-3xl">Bon retour à toi!</h1>
          <p class="mt-4 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla
            eaque error neque ipsa culpa autem, at itaque nostrum!
          </p>
        </div>

        <form class="mx-auto mb-0 mt-8 max-w-md space-y-4" action="#">
          <InputField placeholder="Entrez votre "></InputField>
          <InputField placeholder="Entrez votre mot de passe"></InputField>
          

          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Pas de compte?
              <a href="#" class="underline">Inscrivez vous</a>
            </p>
            <button
              class="inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              type="submit"
            >
              Connexion
            </button>
          </div>
        </form>
      </div>

    </>
  )
}

export default App
