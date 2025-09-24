import Navbar from "~/components/Navbar";
import HeroSection from "~/components/HeroSection";
import Features from "~/components/Features";
import Footer from "~/components/Footer";
import PricingSection from "~/components/PricingSection";



export default async function Home() {

  return (
    <div className="flex flex-col items-center">
    <Navbar/>
    <HeroSection/>
    <Features/>
    <PricingSection/>
    <Footer/>
    </div>
  );
}
