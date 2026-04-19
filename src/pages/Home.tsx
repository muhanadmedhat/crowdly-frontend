import Hero from "../components/Hero"
import Featured from "../components/Featured"
import Motive from "../components/Motive"
import { useEffect } from "react"
import withLoading from "../utils/WithLoading"

export default function Home() {
  useEffect(() => {
    withLoading(new Promise((resolve) => setTimeout(resolve, 1500)));
  }, []);

  return (
    <main>
      <Hero />
      <Featured />
      <Motive />
    </main>
  )
}