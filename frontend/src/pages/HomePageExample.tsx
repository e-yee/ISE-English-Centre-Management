"use client"
import { motion } from "framer-motion"
import { MoveRight, PhoneCall } from "lucide-react"
import { cn } from "@/lib/utils"
import type React from "react"
import type { ReactNode } from "react"

// AuroraBackground component
interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode
  showRadialGradient?: boolean
}

const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col  h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  text-slate-950 transition-bg",
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            //   I'm sorry but this is what peak developer performance looks like // trigger warning
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
              showRadialGradient && `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  )
}

// Hero1 component
const Hero1 = () => {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3 gap-4 cursor-pointer">
              Read our launch article <MoveRight className="w-4 h-4" />
            </div>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              Trình là gì mà rình ai tắm
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <a
              href="#call"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8 gap-4 cursor-pointer"
            >
              Jump on a call <PhoneCall className="w-4 h-4" />
            </a>
            <a
              href="#signup"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 gap-4 cursor-pointer"
            >
              Sign up here <MoveRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// HeroDemo component
const HeroDemo = () => {
  return (
    <div className="block">
      <Hero1 />
    </div>
  )
}

// AuroraBackgroundDemo component
const AuroraBackgroundDemo = () => {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">Trình là gì mà rình ai tắm?</div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          anh hái thứ hiu
        </div>
        <a
          href="https://youtu.be/7kO_ALcwNAw?si=vk22gUkGtnZqyeDJ"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors cursor-pointer inline-block text-center"
        >
          nghe ngay
        </a>
      </motion.div>
    </AuroraBackground>
  )
}

// Main HomePageExample component
const HomePageExample = () => {
  return (
    <div>
      <AuroraBackgroundDemo />
      <HeroDemo />
    </div>
  )
}

export default HomePageExample
