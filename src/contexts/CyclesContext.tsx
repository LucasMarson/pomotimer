import { createContext, ReactNode, useState } from 'react'

interface createCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclescontextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: createCycleData) => void
  iterruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclescontextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycles) => cycles.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleFinished() {
    setCycles((state) =>
      state.map((cycles) => {
        if (cycles.id === activeCycleId) {
          return { ...cycles, finishedDate: new Date() }
        } else {
          return cycles
        }
      }),
    )
  }

  function createNewCycle(data: createCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }

  function iterruptCurrentCycle() {
    setCycles((state) =>
      state.map((cycles) => {
        if (cycles.id === activeCycleId) {
          return { ...cycles, interruptedDate: new Date() }
        } else {
          return cycles
        }
      }),
    )
    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        iterruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
